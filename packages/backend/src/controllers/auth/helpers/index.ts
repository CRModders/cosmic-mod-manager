import type { AuthUserProfile } from "@/../types";
import prisma from "@/services/prisma";
import { setUserCookie } from "@/utils";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { AUTHTOKEN_COOKIE_NAMESPACE, CSRF_STATE_COOKIE_NAMESPACE, STRING_ID_LENGTH } from "@shared/config";
import { getAuthProviderFromString } from "@shared/lib/utils/convertors";
import { type AuthActionIntent, AuthProvider } from "@shared/types";
import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { nanoid } from "nanoid";
import { UAParser } from "ua-parser-js";
import { getDiscordUserProfileData } from "../providers/discord";
import { getGithubUserProfileData } from "../providers/github";
import { getGitlabUserProfileData } from "../providers/gitlab";
import { getGoogleUserProfileData } from "../providers/google";

const authUrlTemplates = {
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

export const getOAuthSignInUrl = (ctx: Context, authProvider: string, actionIntent: AuthActionIntent) => {
    const redirectUri = `${process.env.OAUTH_REDIRECT_URI}/${authProvider}`;
    const csrfState = `${actionIntent}-${nanoid(24)}`;

    setUserCookie(ctx, CSRF_STATE_COOKIE_NAMESPACE, csrfState, { httpOnly: false });

    switch (authProvider) {
        case AuthProvider.GITHUB:
            return authUrlTemplates[AuthProvider.GITHUB](process.env.GITHUB_ID || "", redirectUri, csrfState);
        case AuthProvider.GITLAB:
            return authUrlTemplates[AuthProvider.GITLAB](process.env.GITLAB_ID || "", redirectUri, csrfState);
        case AuthProvider.DISCORD:
            return authUrlTemplates[AuthProvider.DISCORD](process.env.DISCORD_ID || "", redirectUri, csrfState);
        case AuthProvider.GOOGLE:
            return authUrlTemplates[AuthProvider.GOOGLE](process.env.GOOGLE_ID || "", redirectUri, csrfState);
        default:
            return "";
    }
};

export const getAuthProviderProfileData = async (authProvider: string, code: string) => {
    switch (getAuthProviderFromString(authProvider)) {
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
};

export const createNewAuthAccount = async (
    userId: string,
    { providerName, providerAccountId, email, avatarImage, accessToken, tokenType, refreshToken, authType, scope }: AuthUserProfile,
) => {
    return await prisma.authAccount.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            userId: userId,
            providerName: providerName,
            providerAccountId: providerAccountId.toString(),
            providerAccountEmail: email,
            avatarUrl: avatarImage,
            accessToken: accessToken,
            tokenType: tokenType,
            refreshToken: refreshToken,
            authType: authType,
            authorizationScope: scope,
        },
    });
};

type IpAddressType =
    | {
          address: string;
          family: string;
          port: number;
      }
    | string
    | null;

export type GeoApiData = {
    city?: string;
    country?: string;
};

export const getUserIpAddress = (ctx: Context) => {
    let ipAddr =
        ctx.req.header("x-forwarded-for")?.split(", ")?.[0] || ctx.req.header("x-forwarded-for") || (ctx.env.ip as string as IpAddressType);
    if (typeof ipAddr !== "string") {
        ipAddr = ipAddr?.address || null;
    }

    return ipAddr;
};

export const getUserDeviceDetails = async (ctx: Context) => {
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
            const res = await fetch(`https://ipinfo.io/${ipAddr}?token=${process.env.IP2GEO_API_KEY}`);
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
};

const secretKey = process.env.HASH_SECRET_KEY;
if (!secretKey) {
    throw new Error("HASH_SECRET_KEY is not defined");
}

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export async function hashString(str: string) {
    return (await new Promise((resolve) => {
        const hasher = new Bun.CryptoHasher("sha256", secretKey);
        hasher.update(str);
        resolve(hasher.digest("hex") as string);
    })) as string;
}

export const getUserSessionCookie = (ctx: Context) => {
    try {
        const cookie = getCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE);
        if (!cookie) {
            return null;
        }
        return cookie;
    } catch (error) {}
    return null;
};
