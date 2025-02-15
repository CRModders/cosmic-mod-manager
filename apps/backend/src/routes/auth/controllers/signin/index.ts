import { SITE_NAME_SHORT, USER_SESSION_VALIDITY } from "@app/utils/constants";
import { Capitalize } from "@app/utils/string";
import type { Context } from "hono";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { getAuthProviderProfileData } from "~/routes/auth/helpers";
import { createUserSession, setSessionCookie } from "~/routes/auth/helpers/session";
import prisma from "~/services/prisma";
import { AUTH_COOKIE_NAMESPACE } from "~/types/namespaces";
import { HTTP_STATUS } from "~/utils/http";

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
        await addInvalidAuthAttempt(ctx);
        return {
            data: {
                success: false,
                message: `This ${Capitalize(profileData.providerName)} account (${profileData.email}) is not linked to any ${SITE_NAME_SHORT} user account. First link ${Capitalize(profileData.providerName)} auth provider to your user account to be able to signin using ${Capitalize(profileData.providerName)}`,
            },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    const newSession = await createUserSession({
        userId: expectedAuthAccount.user.id,
        providerName: profileData.providerName,
        ctx: ctx,
        user: expectedAuthAccount.user,
    });
    setSessionCookie(ctx, AUTH_COOKIE_NAMESPACE, newSession, { maxAge: USER_SESSION_VALIDITY });

    return {
        data: { success: true, message: `Successfuly logged in using ${profileData.providerName} as ${expectedAuthAccount.user.name}` },
        status: HTTP_STATUS.OK,
    };
}
