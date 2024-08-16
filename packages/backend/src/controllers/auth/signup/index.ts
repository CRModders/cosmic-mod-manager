import prisma from "@/services/prisma";
import { setUserCookie } from "@/utils";
import httpCode from "@/utils/http";
import { AUTHTOKEN_COOKIE_NAME, STRING_ID_LENGTH } from "@shared/config";
import { GlobalUserRoles } from "@shared/types";
import type { Context } from "hono";
import { nanoid } from "nanoid";
import { createNewAuthAccount, getAuthProviderProfileData } from "../commons";
import { createNewUserSession } from "../session";

export const oAuthSignUpHandler = async (ctx: Context, authProvider: string, tokenExchangeCode: string) => {
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
            { success: false, message: "A user already exists with this account, try to login instead" },
            httpCode("bad_request"),
        );
    }

    // Return if a user already exists with the same email
    const possiblyAlreadyExistingUser = await prisma.user.findUnique({
        where: {
            email: profileData.email,
        },
    });
    if (possiblyAlreadyExistingUser?.id) {
        return ctx.json(
            { success: false, message: "A user already exists with the email you are trying to sign up with." },
            httpCode("bad_request"),
        );
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
            role: GlobalUserRoles.USER,
            newSignInAlerts: true,
            avatarUrl: profileData.avatarImage,
            avatarUrlProvider: profileData.providerName
        },
    });

    await createNewAuthAccount(newUser.id, profileData);

    const newSession = await createNewUserSession({
        userId: newUser.id,
        providerName: authProvider,
        ctx,
        isFirstSignIn: true,
        user: newUser,
    });
    setUserCookie(ctx, AUTHTOKEN_COOKIE_NAME, JSON.stringify(newSession));

    return ctx.json(
        {
            success: true,
            message: `Successfully signed up using ${authProvider} as ${newUser.name}`,
        },
        httpCode("ok"),
    );
};
