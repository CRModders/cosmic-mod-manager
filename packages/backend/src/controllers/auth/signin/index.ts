import prisma from "@/services/prisma";
import { setUserCookie } from "@/utils";
import { status } from "@/utils/http";
import { AUTHTOKEN_COOKIE_NAME, SITE_NAME_SHORT, USER_SESSION_VALIDITY } from "@shared/config";
import { Capitalize } from "@shared/lib/utils";
import type { Context } from "hono";
import { getAuthProviderProfileData } from "../commons";
import { createNewUserSession } from "../session";

export const oAuthSignInHandler = async (ctx: Context, authProvider: string, tokenExchangeCode: string) => {
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
                received: profileData,
            },
            status.BAD_REQUEST,
        );
    }

    const expectedAuthAccount = await prisma.authAccount.findFirst({
        where: {
            providerName: profileData.providerName,
            OR: [{ providerAccountEmail: profileData.email }, { providerAccountId: profileData.providerAccountId }],
        },
        select: {
            id: true,
            user: true,
        },
    });

    if (!expectedAuthAccount?.id) {
        return ctx.json(
            {
                success: false,
                message: `This ${Capitalize(profileData.providerName)} account (${profileData.email}) is not linked to any ${SITE_NAME_SHORT} user account. First link ${Capitalize(profileData.providerName)} auth provider to your user account to be able to signin using ${Capitalize(profileData.providerName)}`,
            },
            status.BAD_REQUEST,
        );
    }

    const newSession = await createNewUserSession({
        userId: expectedAuthAccount.user.id,
        providerName: profileData.providerName,
        ctx: ctx,
        user: expectedAuthAccount.user,
    });
    setUserCookie(ctx, AUTHTOKEN_COOKIE_NAME, JSON.stringify(newSession), { maxAge: USER_SESSION_VALIDITY });

    return ctx.json(
        { success: true, message: `Successfuly logged in using ${profileData.providerName} as ${expectedAuthAccount.user.name}` },
        status.OK,
    );
};
