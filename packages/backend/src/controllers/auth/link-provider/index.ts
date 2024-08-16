import type { ContextUserSession } from "@/../types";
import { addToUsedRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import httpCode, { defaultInvalidReqResponse } from "@/utils/http";
import { CHARGE_FOR_SENDING_INVALID_DATA } from "@shared/config/rate-limit-charges";
import { Capitalize } from "@shared/lib/utils";
import { getAuthProviderFromString } from "@shared/lib/utils/convertors";
import type { Context } from "hono";
import { createNewAuthAccount, getAuthProviderProfileData } from "../commons";

export const linkAuthProviderHandler = async (ctx: Context, userSession: ContextUserSession, authProvider: string, tokenExchangeCode: string) => {
    const profileData = await getAuthProviderProfileData(authProvider, tokenExchangeCode);

    if (
        !profileData ||
        !profileData?.email ||
        !profileData?.providerName ||
        !profileData?.providerAccountId ||
        !profileData.emailVerified
    ) {
        return ctx.json(
            {
                message: "Invalid profile data received from the auth provider, most likely the code provided was invalid",
                success: false,
                data: profileData,
                redirect: "/settings/account",
            },
            httpCode("bad_request"),
        );
    }

    // Return if an auth account already exists with the same provider
    const possiblyAlreadyExistingAuthAccount = await prisma.authAccount.findFirst({
        where: {
            providerName: profileData.providerName,
            OR: [{ providerAccountId: `${profileData.providerAccountId}` }, { providerAccountEmail: profileData.email }],
        },
    });
    if (possiblyAlreadyExistingAuthAccount?.id) {
        return ctx.json(
            {
                success: false,
                message: `The ${Capitalize(profileData.providerName)} account is already linked to a user account`,
                redirect: "/settings/account",
            },
            httpCode("bad_request"),
        );
    }

    // Return if the same type of provider is already linked with the user
    const existingSameProvider = await prisma.authAccount.findFirst({
        where: {
            userId: userSession.id,
            providerName: profileData.providerName,
        },
    });
    if (existingSameProvider?.id) {
        await addToUsedRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
        return defaultInvalidReqResponse(ctx);
    }

    await createNewAuthAccount(userSession.id, profileData);

    return ctx.json(
        {
            success: true,
            message: `Successfully linked ${Capitalize(profileData.providerName)} to your account`,
            redirect: "/settings/account",
        },
        httpCode("ok"),
    );
};

export const unlinkAuthProvider = async (ctx: Context, userSession: ContextUserSession, authProvider: string) => {
    const allLinkedProviders = await prisma.authAccount.findMany({
        where: {
            userId: userSession.id,
        },
    });

    if (allLinkedProviders.length < 2) {
        return ctx.json({ success: false, message: "You can't remove the only remaining auth provider" }, httpCode("bad_request"));
    }

    const providerName = getAuthProviderFromString(authProvider);
    let deletedAuthAccount: number | undefined = undefined;

    try {
        deletedAuthAccount = (
            await prisma.authAccount.deleteMany({
                where: {
                    userId: userSession.id,
                    providerName: providerName,
                },
            })
        ).count;
    } catch (err) { }

    if (!deletedAuthAccount || deletedAuthAccount < 1) {
        await addToUsedRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
        return defaultInvalidReqResponse(ctx);
    }

    return ctx.json({ success: true, message: `Unlinked ${Capitalize(providerName)} from your account.` });
};
