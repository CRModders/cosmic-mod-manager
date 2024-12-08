import { addInvalidAuthAttempt } from "@/middleware/rate-limit/invalid-auth-attempt";
import prisma from "@/services/prisma";
import { getUserAvatar } from "@/src/user/controllers/profile";
import type { RouteHandlerResponse } from "@/types/http";
import { getImageFromHttpUrl } from "@/utils/file";
import { HTTP_STATUS } from "@/utils/http";
import { generateDbId } from "@/utils/str";
import { AUTHTOKEN_COOKIE_NAMESPACE, USER_SESSION_VALIDITY } from "@shared/config";
import { createURLSafeSlug } from "@shared/lib/utils";
import { GlobalUserRole } from "@shared/types";
import { createNewAuthAccount, getAuthProviderProfileData } from "@src/auth/helpers";
import { createUserSession, setSessionCookie } from "@src/auth/helpers/session";
import type { Context } from "hono";

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

    const userId = generateDbId();
    let userName = createURLSafeSlug(profileData.name).value;

    // Check if the username is available
    const existingUserWithSameUserName = await prisma.user.findFirst({
        where: {
            lowerCaseUserName: userName,
        },
    });
    if (existingUserWithSameUserName) {
        userName = `${userName}-${userId}`;
    }

    // Create the avatar image
    let avatarImgId: string | null = null;
    try {
        const avatarFile = await getImageFromHttpUrl(profileData.avatarImage);
        if (avatarFile) avatarImgId = await getUserAvatar(userId, null, avatarFile);
    } catch (error) {
        console.error("Error creating avatar image");
        console.error(error);
    }

    // Finally create a user
    const newUser = await prisma.user.create({
        data: {
            id: userId,
            name: profileData?.name || "",
            email: profileData.email,
            userName: userName,
            lowerCaseUserName: userName.toLocaleLowerCase(),
            emailVerified: profileData.emailVerified === true,
            role: GlobalUserRole.USER,
            newSignInAlerts: true,
            avatar: avatarImgId,
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
