import { AuthProvider } from "@app/utils/types";
import type { OAuthProfile } from "~/types/oAuth";
import env from "~/utils/env";

export async function getDiscordUserProfileData(tokenExchangeCode: string) {
    const client_id = env.DISCORD_ID;
    const client_secret = env.DISCORD_SECRET;

    const url = new URL("https://discord.com/api/oauth2/token");
    const formData = new URLSearchParams();
    formData.append("client_id", client_id);
    formData.append("client_secret", client_secret);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", `${env.OAUTH_REDIRECT_URI}/${AuthProvider.DISCORD}`);
    formData.append("code", tokenExchangeCode);

    const authTokenRes = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });

    const tokenData = await authTokenRes.json();
    const accessToken = tokenData?.access_token;
    const accessTokenType = tokenData?.token_type;

    const userDataRes = await fetch("https://discord.com/api/v10/users/@me", {
        headers: {
            Authorization: `${accessTokenType} ${accessToken}`,
        },
    });
    const userProfile = await userDataRes.json();

    const profile = {
        name: userProfile?.name || null,
        email: userProfile?.email || null,
        emailVerified: userProfile?.verified === true,
        providerName: AuthProvider.DISCORD,
        providerAccountId: userProfile?.id?.toString() || null,
        authType: "oauth",
        accessToken: accessToken,
        refreshToken: tokenData?.refresh_token || null,
        tokenType: accessTokenType || null,
        scope: tokenData?.scope || null,
        avatarImage: `https://cdn.discordapp.com/avatars/${userProfile?.id}/${userProfile?.avatar}`,
    } satisfies OAuthProfile;

    return profile;
}
