import { addInvalidAuthAttempt } from "@/middleware/rate-limit/invalid-auth-attempt";
import prisma from "@/services/prisma";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS } from "@/utils/http";
import { AUTHTOKEN_COOKIE_NAMESPACE, STRING_ID_LENGTH, USER_SESSION_VALIDITY } from "@shared/config";
import { GlobalUserRole } from "@shared/types";
import { createNewAuthAccount, getAuthProviderProfileData } from "@src/auth/helpers";
import { createUserSession, setSessionCookie } from "@src/auth/helpers/session";
import type { Context } from "hono";
import { nanoid } from "nanoid";

export const oAuthSignUpHandler = async (ctx: Context, authProvider: string, tokenExchangeCode: string): Promise<RouteHandlerResponse> => {
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
                data: profileData,
            },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    // Return if an auth account already exists with the same provider
    const possiblyAlreadyExistingAuthAccount = await prisma.authAccount.findFirst({
        where: {
            providerName: profileData.providerName,
            OR: [{ providerAccountId: `${profileData.providerAccountId}` }, { providerAccountEmail: profileData.email }],
        },
    });
    if (possiblyAlreadyExistingAuthAccount?.id) {
        await addInvalidAuthAttempt(ctx);
        return {
            data: { success: false, message: "A user already exists with this account, try to login instead" },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    // Return if a user already exists with the same email
    const possiblyAlreadyExistingUser = await prisma.user.findUnique({
        where: {
            email: profileData.email,
        },
    });
    if (possiblyAlreadyExistingUser?.id) {
        await addInvalidAuthAttempt(ctx);
        return {
            data: { success: false, message: "A user already exists with the email you are trying to sign up with." },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    const userName = nanoid(STRING_ID_LENGTH);
    // Finally create a user
    const newUser = await prisma.user.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            name: profileData?.name || "",
            email: profileData.email,
            userName: userName,
            lowerCaseUserName: userName.toLocaleLowerCase(),
            emailVerified: profileData.emailVerified === true,
            role: GlobalUserRole.USER,
            newSignInAlerts: true,
            avatarUrl: profileData.avatarImage,
            avatarUrlProvider: profileData.providerName,
        },
    });

    await createNewAuthAccount(newUser.id, profileData);

    const newSession = await createUserSession({
        userId: newUser.id,
        providerName: authProvider,
        ctx,
        isFirstSignIn: true,
        user: newUser,
    });
    setSessionCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE, newSession, { maxAge: USER_SESSION_VALIDITY });

    return {
        data: {
            success: true,
            message: `Successfully signed up using ${authProvider} as ${newUser.name}`,
        },
        status: HTTP_STATUS.OK,
    };
};
