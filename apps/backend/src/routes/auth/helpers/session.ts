import { AUTHTOKEN_COOKIE_NAMESPACE, USER_SESSION_VALIDITY_ms } from "@app/utils/constants";
import { getSessionMetadata } from "@app/utils/headers";
import { type GlobalUserRole, UserSessionStates } from "@app/utils/types";
import type { Prisma, Session, User } from "@prisma/client";
import type { Context } from "hono";
import type { CookieOptions } from "hono/utils/cookie";
import {
    CreateSession,
    DeleteManySessions,
    DeleteSession,
    GetManySessions,
    GetSession_First,
    GetSession_Unique,
    UpdateSession,
} from "~/db/session_item";
import { deleteSessionTokenAndIdCache, getSessionCacheFromToken, setSessionTokenCache } from "~/services/cache/session";
import type { ContextUserData } from "~/types";
import { CTX_USER_NAMESPACE } from "~/types/namespaces";
import { sendNewSigninAlertEmail } from "~/utils/email";
import { deleteCookie, setCookie } from "~/utils/http";
import { generateDbId, generateRandomId } from "~/utils/str";
import { generateRandomToken, getUserSessionCookie, hashString } from "./index";

interface CreateNewSessionProps {
    userId: string;
    providerName: string;
    ctx: Context;
    isFirstSignIn?: boolean;
    user: User;
}

export async function createUserSession({ userId, providerName, ctx, isFirstSignIn, user }: CreateNewSessionProps) {
    function getHeader(key: string) {
        return ctx.req.header(key);
    }

    const sessionToken = generateRandomToken();
    const tokenHash = await hashString(sessionToken);

    const revokeAccessCode = generateRandomId(32);
    const revokeAccessCodeHash = await hashString(revokeAccessCode);

    const sessionMetadata = getSessionMetadata(getHeader, ctx.env.ip?.address || "");

    if (isFirstSignIn !== true) {
        const significantIp = (sessionMetadata.ipAddr || "")?.slice(0, 9);
        const similarSession = await GetSession_First({
            where: {
                userId: userId,
                ip: {
                    startsWith: significantIp,
                },
            },
        });

        // Send email alert if the user is signing in from a new location
        if (!similarSession?.id) {
            sendNewSigninAlertEmail({
                fullName: user.name || user.userName,
                receiverEmail: user.email,
                region: sessionMetadata.city || "",
                country: sessionMetadata.country || "",
                ip: sessionMetadata.ipAddr || "",
                browserName: sessionMetadata.browserName || "",
                osName: sessionMetadata.os.name || "",
                authProviderName: providerName || "",
                revokeAccessCode: revokeAccessCode,
            });
        }
    }

    await CreateSession({
        data: {
            id: generateDbId(),
            tokenHash: tokenHash,
            userId: userId,
            providerName: providerName,
            dateExpires: new Date(Date.now() + USER_SESSION_VALIDITY_ms),
            status: UserSessionStates.ACTIVE,
            revokeAccessCode: revokeAccessCodeHash,
            os: `${sessionMetadata.os.name} ${sessionMetadata.os.version || ""}`,
            browser: sessionMetadata.browserName || "",
            ip: sessionMetadata.ipAddr || "",
            city: sessionMetadata.city || "",
            country: sessionMetadata.country || "",
            userAgent: sessionMetadata.userAgent || "",
        },
    });

    return sessionToken;
}

export async function validateSessionToken(token: string): Promise<ContextUserData | null> {
    const tokenHash = await hashString(token);
    if (tokenHash.length > 256) {
        return null;
    }

    // Check cache
    const cachedSession = await getSessionCacheFromToken(tokenHash, true); // SESSION_CACHE : GET
    if (cachedSession) return cachedSession;

    const session = await GetSession_Unique({
        where: {
            tokenHash: tokenHash,
        },
        include: {
            user: true,
        },
    });
    if (!session) {
        // TODO: await addInvalidAuthAttempt(ctx);
        return null;
    }

    const now = Date.now();
    const sessionExpiry = session.dateExpires.getTime();
    const timeToExpire = sessionExpiry - now;

    if (timeToExpire <= 0) {
        await DeleteSession({
            where: {
                id: session.id,
            },
        });

        await deleteSessionTokenAndIdCache([session.tokenHash], [session.id]); // SESSION_CACHE : DELETE
        return null;
    }

    const sessionUpdateData: Prisma.SessionUpdateInput = {
        dateLastActive: new Date(),
    };
    // If the session is about to expire, extend the session
    if (timeToExpire < USER_SESSION_VALIDITY_ms / 3) {
        sessionUpdateData.dateExpires = new Date(now + USER_SESSION_VALIDITY_ms);
    }

    await UpdateSession({
        where: {
            id: session.id,
        },
        data: sessionUpdateData,
    });

    await setSessionTokenCache(tokenHash, session.id, session.userId, session.user); // SESSION_CACHE : SET

    const user = session.user;
    const sessionData: ContextUserData = {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        userName: user.userName,
        name: user.name || user.userName,
        dateJoined: user.dateJoined,
        emailVerified: user.emailVerified,
        role: user.role as GlobalUserRole,
        bio: user.bio,
        password: user.password,
        newSignInAlerts: user.newSignInAlerts,

        sessionId: session.id,
    };

    return sessionData;
}

export async function validateContextSession(ctx: Context): Promise<ContextUserData | null> {
    try {
        // Get the current cookie data
        const cookie = getUserSessionCookie(ctx);
        if (!cookie) {
            return null;
        }

        // Get the current logged in user from the cookie data
        const session = await validateSessionToken(cookie);
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
    const deletedSession = await DeleteSession({
        where: userId ? { id: sessionId, userId: userId } : { id: sessionId },
    });

    await deleteSessionTokenAndIdCache([deletedSession.tokenHash], [deletedSession.id]); // SESSION_CACHE : DELETE
    return deletedSession;
}

export async function invalidateSessionFromToken(token: string): Promise<Session> {
    const tokenHash = await hashString(token);
    const deletedSession = await DeleteSession({
        where: { tokenHash: tokenHash },
    });

    await deleteSessionTokenAndIdCache([deletedSession.tokenHash], [deletedSession.id]); // SESSION_CACHE : DELETE
    return deletedSession;
}

export async function invalidateAllUserSessions(userId: string) {
    const sessionsList = await GetManySessions({
        where: { userId: userId },
    });

    const tokenHashes = sessionsList.map((session) => session.tokenHash);
    const sessionIds = sessionsList.map((session) => session.id);
    await DeleteManySessions({
        where: {
            id: { in: sessionIds },
        },
    });

    await deleteSessionTokenAndIdCache(tokenHashes, sessionIds); // SESSION_CACHE : DELETE
}

export async function invalidateAllOtherUserSessions(userId: string, currSessionId: string) {
    const sessionsList = await GetManySessions({
        where: {
            userId: userId,
            NOT: {
                id: currSessionId,
            },
        },
    });

    const tokenHashes = sessionsList.map((session) => session.tokenHash);
    const sessionIds = sessionsList.map((session) => session.id);
    await DeleteManySessions({
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
    return deleteCookie(ctx, name, options);
}

export function getUserFromCtx(ctx: Context) {
    return ctx.get(CTX_USER_NAMESPACE) as ContextUserData | undefined;
}
