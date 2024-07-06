import type { Profile, authHandlerResult } from "@/types";
import type { Context } from "hono";
import type { BlankInput, Env } from "hono/types";
import authenticateUser, { ValidateProviderProfileData } from "../authenticate";
import { AuthProvidersEnum } from "@root/types";

async function fetchUserData(access_token: string) {
    const userDataRes = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `token ${access_token}`,
        },
    });

    return await userDataRes.json();
}

type EmailData = {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
};

async function fetchUserEmail(access_token: string): Promise<EmailData | null> {
    const userEmailRes = await fetch("https://api.github.com/user/emails", {
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${access_token}`,
            "X-Github-Api-Version": "2022-11-28",
        },
    });

    const userEmailData = (await userEmailRes.json()) as EmailData[];
    let userEmailObj: EmailData | null = null;

    for (const emailObj of userEmailData) {
        if (emailObj?.primary === true) {
            userEmailObj = emailObj;
        }
    }

    if (userEmailObj?.verified !== true) {
        throw new Error("Your email is not verified. First verify your email on Github");
    }

    return userEmailObj;
}

async function fetchGithubUserData(temp_access_code: string): Promise<Profile> {
    const authTokenRes = await fetch(
        `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${temp_access_code}`,
        {
            method: "POST",
            headers: {
                accept: "application/json",
            },
        },
    );

    const tokenData = await authTokenRes.json();
    const access_token = tokenData?.access_token;

    const fetchPromises = [fetchUserData(access_token), fetchUserEmail(access_token)];
    const [userData, userEmailData] = await Promise.all(fetchPromises);

    const profile: Profile = {
        name: userData?.name || null,
        email: userEmailData?.email || null,
        providerName: AuthProvidersEnum.GITHUB,
        providerAccountId: userData?.id || null,
        authType: "oauth",
        accessToken: access_token,
        refreshToken: null,
        tokenType: tokenData?.token_type || null,
        scope: tokenData?.scope || null,
        avatarImage: userData?.avatar_url || null,
    };

    return profile;
}

export default async function githubCallbackHandler(
    c: Context<Env, "/callback/github", BlankInput>,
): Promise<authHandlerResult> {
    try {
        const temp_access_code = (await c.req.json())?.code;
        const profile = await fetchGithubUserData(temp_access_code);

        // Throws an error if the profile is not valid, returns true for valid profile
        ValidateProviderProfileData(profile);
        const { user, success, message } = await authenticateUser(profile, c);

        if (success !== true) {
            throw new Error("Something went wrong while signing you in! Please try again later");
        }

        return {
            status: {
                success: true,
                message: message,
            },
            user,
        };
    } catch (error) {
        console.error(error);
        return {
            status: {
                success: false,
                message: (error?.message as string) || "Something went wrong!",
            },
        };
    }
}
