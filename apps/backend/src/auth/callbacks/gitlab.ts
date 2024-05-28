import type { Profile, authHandlerResult } from "@/types";
import type { Context } from "hono";
import type { BlankInput, Env } from "hono/types";
import authenticateUser, { ValidateProviderProfileData } from "../authenticate";

async function fetchUserProfile(access_token: string, access_token_type: string) {
	const userDataRes = await fetch("https://gitlab.com/api/v4/user", {
		headers: {
			Authorization: `${access_token_type} ${access_token}`,
		},
	});
	return await userDataRes.json();
}

async function fetchGitlabUserData(temp_access_code: string) {
	const client_id = process.env.GITLAB_ID;
	const client_secret = process.env.GITLAB_SECRET;

	const url = new URL("https://gitlab.com/oauth/token");
	url.searchParams.append("grant_type", "authorization_code");
	url.searchParams.append("code", temp_access_code);
	url.searchParams.append("redirect_uri", `${process.env.SIGNIN_REDIRECT_URI}/gitlab`);

	const authTokenRes = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});

	const tokenData = await authTokenRes.json();
	const access_token = tokenData?.access_token;
	const access_token_type = tokenData?.token_type;

	const userProfile = await fetchUserProfile(access_token, access_token_type);

	const profile: Profile = {
		name: userProfile?.name || null,
		email: userProfile?.email || null,
		providerName: "gitlab",
		providerAccountId: userProfile?.id || null,
		authType: "oauth",
		accessToken: access_token,
		refreshToken: tokenData?.refresh_token || null,
		tokenType: access_token_type || null,
		scope: tokenData?.scope || null,
		avatarImage: userProfile?.avatar_url || null,
	};

	return profile;
}

export default async function gitlabCallbackHandler(
	c: Context<Env, "/callback/gitlab", BlankInput>,
): Promise<authHandlerResult> {
	try {
		const body = await c.req.json();
		const temp_access_code = body?.code;
		const profile = await fetchGitlabUserData(temp_access_code);

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
