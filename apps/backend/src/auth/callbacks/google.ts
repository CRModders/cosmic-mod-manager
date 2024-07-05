import type { Profile, authHandlerResult } from "@/types";
import type { Context } from "hono";
import type { BlankInput, Env } from "hono/types";
import authenticateUser, { ValidateProviderProfileData } from "../authenticate";

async function fetchUserData(access_token: string) {
    const userDataRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`, {
        headers: {
            Authorization: `token ${access_token}`,
        },
    });

    return await userDataRes.json();
}

async function fetchGithubUserData(temp_access_code: string): Promise<Profile> {
    const clientId = process.env.GOOGLE_ID;
    const clientSecret = process.env.GOOGLE_SECRET;

    const url = "https://oauth2.googleapis.com/token";
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("code", temp_access_code);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", `${process.env.SIGNIN_REDIRECT_URI}/google`);

    const authTokenRes = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });

    const tokenData = await authTokenRes.json();
    const access_token = tokenData?.access_token;

    const userData = await fetchUserData(access_token);

    const profile: Profile = {
        name: userData?.name || null,
        email: userData?.email || null,
        providerName: "google",
        providerAccountId: userData?.sub || null,
        authType: "oauth",
        accessToken: access_token,
        refreshToken: null,
        tokenType: tokenData?.token_type || null,
        scope:
            (tokenData?.scope || "").replaceAll("https://www.googleapi.com/auth/userinfo.", "").replaceAll(" ", "+") ||
            null,
        avatarImage: userData?.picture || null,
    };

    return profile;
}

export default async function googleCallbackHandler(
    c: Context<Env, "/callback/google", BlankInput>,
): Promise<authHandlerResult> {
    try {
        const temp_access_code = (await c.req.json())?.code;
        if (!temp_access_code) return { status: { success: true, message: "No token provided" } };

        const profile = await fetchGithubUserData(temp_access_code);

        // Throws an error if the profile is not valid, returns true for valid profile
        ValidateProviderProfileData(profile);
        const { user, success, message } = await authenticateUser(profile, c);

        if (success !== true) {
            throw new Error("Something went wrong while signing you in! Please try again later");
        }

        return { status: { success: true, message: message }, user };
    } catch (error) {
        console.error(error);
        return { status: { success: false, message: (error?.message as string) || "Something went wrong!" } };
    }
}
