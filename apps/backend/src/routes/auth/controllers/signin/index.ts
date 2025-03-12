import { SITE_NAME_SHORT } from "@app/utils/constants";
import { Capitalize, CapitalizeAndFormatString } from "@app/utils/string";
import type { Context } from "hono";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { getAuthProviderProfileData } from "~/routes/auth/helpers";
import { createUserSession, setSessionCookie } from "~/routes/auth/helpers/session";
import prisma from "~/services/prisma";
import { HTTP_STATUS, invalidReqestResponseData } from "~/utils/http";

export async function oAuthSignInHandler(ctx: Context, authProvider: string, tokenExchangeCode: string) {
    const profileData = await getAuthProviderProfileData(authProvider, tokenExchangeCode);

    if (
        !profileData ||
        !profileData?.email ||
        !profileData?.providerName ||
        !profileData?.providerAccountId ||
        !profileData.emailVerified
    ) {
        await addInvalidAuthAttempt(ctx);
        return {
            data: {
                message: "Invalid profile data received from the auth provider, most likely the code provided was invalid",
                success: false,
                received: profileData,
            },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    const authAccount = await prisma.authAccount.findFirst({
        where: {
            providerName: profileData.providerName,
            OR: [{ providerAccountEmail: profileData.email }, { providerAccountId: profileData.providerAccountId }],
        },
        include: {
            user: true,
        },
    });

    if (!authAccount?.id) {
        const otherProviderAccount = await prisma.authAccount.findFirst({
            where: {
                OR: [{ providerAccountEmail: profileData.email }, { providerAccountId: profileData.providerAccountId }],
            },
        });

        if (!otherProviderAccount?.id) {
            return invalidReqestResponseData(
                "No user account found with this email or provider account id. Sign up first to link this account",
            );
        }

        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData(
            `This ${Capitalize(profileData.providerName)} account is not linked to your ${SITE_NAME_SHORT} user account. We found a ${CapitalizeAndFormatString(otherProviderAccount.providerName)} account linked to your user account, please sign in using that.\nNOTE: You can manage linked providers in account settings.`,
        );
    }

    const newSession = await createUserSession({
        userId: authAccount.user.id,
        providerName: profileData.providerName,
        ctx: ctx,
        user: authAccount.user,
    });
    setSessionCookie(ctx, newSession);

    return {
        data: {
            success: true,
            message: `Successfuly logged in using ${profileData.providerName} as ${authAccount.user.userName}`,
        },
        status: HTTP_STATUS.OK,
    };
}
