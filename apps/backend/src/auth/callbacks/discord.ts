import type { Profile, authHandlerResult } from "@/types";
import type { Context } from "hono";
import type { BlankInput, Env } from "hono/types";
import authenticateUser, { ValidateProviderProfileData } from "../authenticate";

async function fetchUserProfile(access_token: string, access_token_type: string) {
	const userDataRes = await fetch("https://discord.com/api/v10/users/@me", {
		headers: {
			Authorization: `${access_token_type} ${access_token}`,
		},
	});
	return await userDataRes.json();
}

async function fetchDiscordUserData(temp_access_code: string) {
	const client_id = process.env.DISCORD_ID;
	const client_secret = process.env.DISCORD_SECRET;

	const url = new URL("https://discord.com/api/oauth2/token");
	const formData = new URLSearchParams();
	formData.append("client_id", client_id);
	formData.append("client_secret", client_secret);
	formData.append("grant_type", "authorization_code");
	formData.append("redirect_uri", `${process.env.SIGNIN_REDIRECT_URI}/discord`);
	formData.append("code", temp_access_code);

	const authTokenRes = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: formData.toString(),
	});

	const tokenData = await authTokenRes.json();
	const access_token = tokenData?.access_token;
	const access_token_type = tokenData?.token_type;

	const userProfile = await fetchUserProfile(access_token, access_token_type);
	const profile: Profile = {
		name: userProfile?.name || null,
		email: userProfile?.email || null,
		providerName: "discord",
		providerAccountId: userProfile?.id || null,
		authType: "oauth",
		accessToken: access_token,
		refreshToken: tokenData?.refresh_token || null,
		tokenType: access_token_type || null,
		scope: tokenData?.scope || null,
		avatarImage: `https://cdn.discordapp.com/avatars/${userProfile?.id}/${userProfile?.avatar}`,
	};

	return profile;
}

export default async function discordCallbackHandler(
	c: Context<Env, "/callback/discord", BlankInput>,
): Promise<authHandlerResult> {
	try {
		const body = await c.req.json();
		const temp_access_code = body?.code;
		const profile = await fetchDiscordUserData(temp_access_code);

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
		return {
			status: {
				success: false,
				message: (error?.message as string) || "Something went wrong!",
			},
		};
	}
}
