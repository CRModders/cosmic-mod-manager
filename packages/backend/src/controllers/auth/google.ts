import type { AuthUserProfile } from "@/../types";
import { AuthProvider } from "@shared/types";

export const getGoogleUserProfileData = async (tokenExchangeCode: string) => {
    const clientId = process.env.GOOGLE_ID;
    const clientSecret = process.env.GOOGLE_SECRET;

    // Exchange the code for an accesToken that can be used to access user data
    const url = "https://oauth2.googleapis.com/token";
    const params = new URLSearchParams();
    params.append("client_id", clientId || "");
    params.append("client_secret", clientSecret || "");
    params.append("code", tokenExchangeCode);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", `${process.env.OAUTH_REDIRECT_URI}/${AuthProvider.GOOGLE}`);

    const authTokenRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
    });
    const tokenData = await authTokenRes.json();
    const accessToken = tokenData?.access_token;

    // Fetch the user data using exchanged token
    const userDataRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`, {
        headers: { Authorization: `token ${accessToken}` },
    });
    const userData = await userDataRes.json();

    // Construct the user profile
    const profile: AuthUserProfile = {
        name: userData?.name || "",
        email: userData?.email || null,
        emailVerified: userData?.email_verified === true,
        providerName: AuthProvider.GOOGLE,
        providerAccountId: userData?.sub?.toString() || null,
        authType: "oauth",
        accessToken: accessToken,
        refreshToken: null,
        tokenType: tokenData?.token_type || null,
        scope: (tokenData?.scope || "").replaceAll("https://www.googleapi.com/auth/userinfo.", "").replaceAll(" ", "+") || null,
        avatarImage: userData?.picture || null,
    };

    return profile;
};
