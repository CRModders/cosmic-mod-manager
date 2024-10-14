import type { ContextUserSession } from "@/../types";
import prisma from "@/services/prisma";
import { generateRandomString } from "@/utils";
import { sendNewSigninAlertEmail } from "@/utils/email";
import type { User } from "@prisma/client";
import { USER_SESSION_VALIDITY_ms } from "@shared/config";
import { UserSessionStates } from "@shared/types";
import type { Context } from "hono";
import { generateSessionToken, getUserDeviceDetails, getUserSessionCookie, hashString } from ".";

interface CreateNewSessionProps {
    userId: string;
    providerName: string;
    ctx: Context;
    isFirstSignIn?: boolean;
    user: Partial<User>;
}

export const createUserSession = async ({ userId, providerName, ctx, isFirstSignIn, user }: CreateNewSessionProps) => {
    const sessionToken = generateSessionToken();
    const sessionId = await hashString(sessionToken);
    const deviceDetails = await getUserDeviceDetails(ctx);
    const revokeAccessCode = await hashString(generateRandomString());

    const newSession = await prisma.session.create({
        data: {
            id: sessionId,
            userId: userId,
            providerName: providerName,
            dateExpires: new Date(Date.now() + USER_SESSION_VALIDITY_ms),
            status: UserSessionStates.ACTIVE,
            revokeAccessCode: revokeAccessCode,
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
                revokeAccessCode: newSession.revokeAccessCode,
            });
        }
    }

    return sessionToken;
};

export async function validateSessionToken(token: string): Promise<ContextUserSession | null> {
    const sessionId = await hashString(token);
    if (sessionId.length > 256) {
        return null;
    }

    const session = await prisma.session.findUnique({
        where: {
            id: sessionId,
        },
        include: {
            user: true,
        },
    });
    if (!session) {
        return null;
    }

    if (Date.now() >= session.dateExpires.getTime()) {
        await prisma.session.delete({
            where: {
                id: sessionId,
            },
        });
        return null;
    }

    if (Date.now() >= session.dateExpires.getTime() - USER_SESSION_VALIDITY_ms / 2) {
        const extendedExpiryData = new Date(Date.now() + USER_SESSION_VALIDITY_ms);
        await prisma.session.update({
            where: {
                id: session.id,
            },
            data: {
                dateExpires: extendedExpiryData,
                dateLastActive: new Date(),
            },
        });
    } else {
        await prisma.session.update({
            where: {
                id: session.id,
            },
            data: {
                dateLastActive: new Date(),
            },
        });
    }

    return { ...session.user, sessionId: session.id, sessionToken: token };
}

export async function validateContextSession(ctx: Context): Promise<ContextUserSession | null> {
    try {
        // Get the current cookie data
        const cookie = getUserSessionCookie(ctx);
        if (!cookie) {
            return null;
        }

        // Get the current logged in user from the cookie data
        const session = await validateSessionToken(cookie);
        if (!session?.id) {
            return null;
        }

        return session;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function invalidateSessionFromId(sessionId: string): Promise<void> {
    await prisma.session.delete({
        where: { id: sessionId },
    });
}

export async function invalidateSessionFromToken(token: string): Promise<void> {
    const sessionId = await hashString(token);
    await invalidateSessionFromId(sessionId);
}

export async function invalidateAllUserSessions(userId: string) {
    await prisma.session.deleteMany({
        where: { userId: userId },
    });
}
