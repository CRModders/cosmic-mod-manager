import { addInvalidAuthAttempt } from "@/middleware/rate-limit/invalid-auth-attempt";
import { deleteSessionTokenAndIdCache, getSessionCacheFromToken, setSessionTokenCache } from "@/services/cache/session";
import prisma from "@/services/prisma";
import type { ContextUserData } from "@/types";
import { CTX_USER_NAMESPACE } from "@/types/namespaces";
import { sendNewSigninAlertEmail } from "@/utils/email";
import { deleteCookie, setCookie } from "@/utils/http";
import { generateRandomId } from "@/utils/str";
import type { Session, User } from "@prisma/client";
import { AUTHTOKEN_COOKIE_NAMESPACE, USER_SESSION_VALIDITY_ms } from "@shared/config";
import { UserSessionStates } from "@shared/types";
import type { Context } from "hono";
import type { CookieOptions } from "hono/utils/cookie";
import { generateRandomToken, getUserDeviceDetails, getUserSessionCookie, hashString } from "./index";

interface CreateNewSessionProps {
    userId: string;
    providerName: string;
    ctx: Context;
    isFirstSignIn?: boolean;
    user: Partial<User>;
}

export async function createUserSession({ userId, providerName, ctx, isFirstSignIn, user }: CreateNewSessionProps) {
    const sessionToken = generateRandomToken();
    const tokenHash = await hashString(sessionToken);

    const revokeAccessCode = generateRandomId();
    const revokeAccessCodeHash = await hashString(revokeAccessCode);

    const deviceDetails = await getUserDeviceDetails(ctx);

    await prisma.session.create({
        data: {
            id: generateRandomId(28),
            tokenHash: tokenHash,
            userId: userId,
            providerName: providerName,
            dateExpires: new Date(Date.now() + USER_SESSION_VALIDITY_ms),
            status: UserSessionStates.ACTIVE,
            revokeAccessCode: revokeAccessCodeHash,
            os: `${deviceDetails.os.name} ${deviceDetails.os.version || ""}`,
            browser: deviceDetails.browserName || "",
            ip: deviceDetails.ipAddr || "",
            city: deviceDetails.city || "",
            country: deviceDetails.country || "",
            userAgent: deviceDetails.userAgent || "",
        },
    });

    if (isFirstSignIn !== true) {
        const userData = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (userData?.newSignInAlerts === true) {
            sendNewSigninAlertEmail({
                fullName: user.name || "",
                receiverEmail: user.email || "",
                region: deviceDetails.city || "",
                country: deviceDetails.country || "",
                ip: deviceDetails.ipAddr || "",
                browserName: deviceDetails.browserName || "",
                osName: deviceDetails.os.name || "",
                authProviderName: providerName || "",
                revokeAccessCode: revokeAccessCode,
            });
        }
    }

    return sessionToken;
}

export async function validateSessionToken(ctx: Context, token: string): Promise<ContextUserData | null> {
    const tokenHash = await hashString(token);
    if (tokenHash.length > 256) {
        return null;
    }

    // Check cache
    const cachedSession = await getSessionCacheFromToken(tokenHash, true); // SESSION_CACHE : GET
    if (cachedSession) return cachedSession;

    const session = await prisma.session.findUnique({
        where: {
            tokenHash: tokenHash,
        },
        include: {
            user: true,
        },
    });
    if (!session) {
        await addInvalidAuthAttempt(ctx);
        return null;
    }

    if (Date.now() >= session.dateExpires.getTime()) {
        await prisma.session.delete({
            where: {
                id: session.id,
            },
        });
        await deleteSessionTokenAndIdCache([session.tokenHash], [session.id]); // SESSION_CACHE : DELETE
        return null;
    }

    await prisma.session.update({
        where: {
            id: session.id,
        },
        data: {
            dateLastActive: new Date(),
        },
    });

    await setSessionTokenCache(tokenHash, session.id, session.userId, session.user); // SESSION_CACHE : SET
    return { ...session.user, sessionId: session.id };
}

export async function validateContextSession(ctx: Context): Promise<ContextUserData | null> {
    try {
        // Get the current cookie data
        const cookie = getUserSessionCookie(ctx);
        if (!cookie) {
            return null;
        }

        // Get the current logged in user from the cookie data
        const session = await validateSessionToken(ctx, cookie);
        if (!session?.id) {
            deleteSessionCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE);
            return null;
        }

        return session;
    } catch (error) {
        deleteSessionCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE);
        console.error(error);
        return null;
    }
}

export async function invalidateSessionFromId(sessionId: string, userId?: string): Promise<Session> {
    const deletedSession = await prisma.session.delete({
        where: userId ? { id: sessionId, userId: userId } : { id: sessionId },
    });

    await deleteSessionTokenAndIdCache([deletedSession.tokenHash], [deletedSession.id]); // SESSION_CACHE : DELETE
    return deletedSession;
}

export async function invalidateSessionFromToken(token: string): Promise<Session> {
    const tokenHash = await hashString(token);
    const deletedSession = await prisma.session.delete({
        where: { tokenHash: tokenHash },
    });

    await deleteSessionTokenAndIdCache([deletedSession.tokenHash], [deletedSession.id]); // SESSION_CACHE : DELETE
    return deletedSession;
}

export async function invalidateAllUserSessions(userId: string) {
    const sessionsList = await prisma.session.findMany({
        where: { userId: userId },
    });

    const tokenHashes = sessionsList.map((session) => session.tokenHash);
    const sessionIds = sessionsList.map((session) => session.id);
    await prisma.session.deleteMany({
        where: {
            id: { in: sessionIds },
        },
    });

    await deleteSessionTokenAndIdCache(tokenHashes, sessionIds); // SESSION_CACHE : DELETE
}

export async function invalidateAllOtherUserSessions(userId: string, currSessionId: string) {
    const sessionsList = await prisma.session.findMany({
        where: {
            userId: userId,
            NOT: {
                id: currSessionId,
            },
        },
    });

    const tokenHashes = sessionsList.map((session) => session.tokenHash);
    const sessionIds = sessionsList.map((session) => session.id);
    await prisma.session.deleteMany({
        where: {
            id: { in: sessionIds },
        },
    });

    await deleteSessionTokenAndIdCache(tokenHashes, sessionIds); // SESSION_CACHE : DELETE
}

// Cookie things
export function setSessionCookie(ctx: Context, name: string, value: string, options?: CookieOptions) {
    return setCookie(ctx, name, value, {
        httpOnly: true,
        secure: true,
        ...options,
    });
}

export function deleteSessionCookie(ctx: Context, name: string, options?: CookieOptions) {
    return deleteCookie(ctx, name, { sameSite: "Strict", ...options });
}

export function getUserFromCtx(ctx: Context) {
    return ctx.get(CTX_USER_NAMESPACE) as ContextUserData | undefined;
}
