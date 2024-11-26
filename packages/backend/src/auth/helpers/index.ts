import prisma from "@/services/prisma";
import type { OAuthProfile } from "@/types/oAuth";
import env from "@/utils/env";
import { setCookie } from "@/utils/http";
import { generateDbId, generateRandomId } from "@/utils/str";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { AUTHTOKEN_COOKIE_NAMESPACE, CSRF_STATE_COOKIE_NAMESPACE, PASSWORD_HASH_SALT_ROUNDS } from "@shared/config";
import { type AuthActionIntent, AuthProvider } from "@shared/types";
import { getDiscordUserProfileData } from "@src/auth/providers/discord";
import { getGithubUserProfileData } from "@src/auth/providers/github";
import { getGitlabUserProfileData } from "@src/auth/providers/gitlab";
import { getGoogleUserProfileData } from "@src/auth/providers/google";
import type { SocketAddress } from "bun";
import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { random } from "nanoid";
import UAParser = require("ua-parser-js");

const oAuthUrlTemplates = {
    [AuthProvider.GITHUB]: (clientId: string, redirectUri: string, csrfState: string) => {
        return `https://github.com/login/oauth/authorize?&response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${redirectUri}&scope=${encodeURIComponent("read:user user:email")}&state=${csrfState}`;
    },
    [AuthProvider.GITLAB]: (clientId: string, redirectUri: string, csrfState: string) => {
        return `https://gitlab.com/oauth/authorize?scope=read_user&response_type=code&client_id=${encodeURI(clientId)}&redirect_uri=${redirectUri}&state=${csrfState}`;
    },
    [AuthProvider.DISCORD]: (clientId: string, redirectUri: string, csrfState: string) => {
        return `https://discord.com/oauth2/authorize?scope=identify+email&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${csrfState}`;
    },
    [AuthProvider.GOOGLE]: (clientId: string, redirectUri: string, csrfState: string) => {
        return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${redirectUri}&state=${csrfState}&scope=openid+profile+email`;
    },
};

export function getOAuthUrl(ctx: Context, authProvider: string, actionIntent: AuthActionIntent) {
    const redirectUri = `${env.OAUTH_REDIRECT_URI}/${authProvider}`;
    const csrfState = `${actionIntent}-${generateRandomId(24)}`;

    setCookie(ctx, CSRF_STATE_COOKIE_NAMESPACE, csrfState, { httpOnly: false });
    switch (authProvider) {
        case AuthProvider.GITHUB:
            return oAuthUrlTemplates[AuthProvider.GITHUB](env.GITHUB_ID || "", redirectUri, csrfState);
        case AuthProvider.GITLAB:
            return oAuthUrlTemplates[AuthProvider.GITLAB](env.GITLAB_ID || "", redirectUri, csrfState);
        case AuthProvider.DISCORD:
            return oAuthUrlTemplates[AuthProvider.DISCORD](env.DISCORD_ID || "", redirectUri, csrfState);
        case AuthProvider.GOOGLE:
            return oAuthUrlTemplates[AuthProvider.GOOGLE](env.GOOGLE_ID || "", redirectUri, csrfState);
        default:
            return "";
    }
}

export async function getAuthProviderProfileData(authProvider: string, code: string) {
    switch (authProvider.toLowerCase()) {
        case AuthProvider.GITHUB:
            return await getGithubUserProfileData(code);

        case AuthProvider.GITLAB:
            return await getGitlabUserProfileData(code);

        case AuthProvider.DISCORD:
            return await getDiscordUserProfileData(code);

        case AuthProvider.GOOGLE:
            return await getGoogleUserProfileData(code);

        default:
            return null;
    }
}

export async function createNewAuthAccount(
    userId: string,
    { providerName, providerAccountId, email, avatarImage, accessToken, tokenType, refreshToken, authType, scope }: OAuthProfile,
) {
    return await prisma.authAccount.create({
        data: {
            id: generateDbId(),
            userId: userId,
            providerName: providerName,
            providerAccountId: `${providerAccountId}`,
            providerAccountEmail: email,
            avatarUrl: avatarImage,
            accessToken: accessToken,
            tokenType: tokenType,
            refreshToken: refreshToken,
            authType: authType,
            authorizationScope: scope,
        },
    });
}

export type GeoApiData = {
    city?: string;
    country?: string;
};

export function getUserIpAddress(ctx: Context): string | null {
    const clientIP = ctx.req.header("x-client-ip");
    const identityToken = ctx.req.header("x-identity-token");

    if (clientIP && env.FRONTEND_SECRET === identityToken) {
        return clientIP;
    }

    const socketAddr = ctx.env.ip as SocketAddress;
    // Don't allow IPv6 addresses
    if (socketAddr.family === "IPv6" && socketAddr.address !== "::1") return null;

    return socketAddr.address;
}

export async function getUserDeviceDetails(ctx: Context) {
    const userAgent = ctx.req.header("user-agent");
    const ipAddr = getUserIpAddress(ctx);

    const parsedResult = new UAParser(userAgent).getResult();
    const browserName = parsedResult.browser.name;
    const os = {
        name: parsedResult?.os?.name || "",
        version: parsedResult?.os?.version || "",
    };

    const geoData: GeoApiData = {};

    // Gettings Geo data from the IP address
    if (ipAddr) {
        try {
            const res = await fetch(`https://ipinfo.io/${ipAddr}?token=${env.IP2GEO_API_KEY}`);
            const resJsonData = await res.json();

            if (resJsonData?.city || resJsonData?.region) {
                geoData.city = `${resJsonData?.city} ${resJsonData?.region}`;
            }
            if (resJsonData?.country) {
                geoData.country = resJsonData?.country;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return {
        browserName,
        os,
        ipAddr,
        userAgent,
        ...geoData,
    };
}

export function generateRandomToken(): string {
    const bytes = random(32);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export async function hashString(str: string) {
    return (await new Promise((resolve) => {
        const hasher = new Bun.CryptoHasher("sha256", env.HASH_SECRET_KEY);
        hasher.update(str);
        resolve(hasher.digest("hex") as string);
    })) as string;
}

export function getUserSessionCookie(ctx: Context) {
    try {
        const cookie = getCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE);
        if (!cookie) {
            return null;
        }
        return cookie;
    } catch (error) {}
    return null;
}

// Hash the user password
export async function hashPassword(password: string) {
    const hashedPassword = await Bun.password.hash(password, {
        algorithm: "argon2id",
        timeCost: PASSWORD_HASH_SALT_ROUNDS,
    });

    return hashedPassword;
}

// Compare plain text password and the hashed password
export async function matchPassword(password: string, hash: string) {
    try {
        return await Bun.password.verify(password, hash, "argon2id");
    } catch (error) {
        return false;
    }
}
