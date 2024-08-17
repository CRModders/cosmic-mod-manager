import type { ContextUserSession } from "@/../types";
import { addToUsedRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { deleteUserCookie } from "@/utils";
import { sendNewSigninAlertEmail } from "@/utils/email";
import httpCode, { defaultInvalidReqResponse } from "@/utils/http";
import type { Session, User } from "@prisma/client";
import { AUTHTOKEN_COOKIE_NAME, STRING_ID_LENGTH, USER_SESSION_VALIDITY } from "@shared/config";
import { CHARGE_FOR_SENDING_INVALID_DATA } from "@shared/config/rate-limit-charges";
import { UserSessionStates } from "@shared/types";
import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { nanoid } from "nanoid";
import { getUserDeviceDetails } from "./commons";

interface CreateNewSessionProps {
    userId: string;
    providerName: string;
    ctx: Context;
    isFirstSignIn?: boolean;
    user: Partial<User>;
}

interface UserSessionCookieData {
    userId: string;
    sessionId: string;
    sessionToken: string;
}

export const createNewUserSession = async ({
    userId,
    providerName,
    ctx,
    isFirstSignIn,
    user,
}: CreateNewSessionProps): Promise<UserSessionCookieData> => {
    const deviceDetails = await getUserDeviceDetails(ctx);

    const newSession = await prisma.session.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            userId: userId,
            sessionToken: nanoid(STRING_ID_LENGTH),
            providerName: providerName,
            dateExpires: new Date(Date.now() + USER_SESSION_VALIDITY),
            status: UserSessionStates.ACTIVE,
            revokeAccessCode: `${nanoid(STRING_ID_LENGTH)}`,
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
            const allPreviousSessions = await prisma.session.findMany({
                where: {
                    userId: userId,
                    NOT: [{ id: newSession.id }],
                },
            });

            const currIp = deviceDetails.ipAddr;
            let isSignInFromUnknownLocation = true;

            for (const prevSession of allPreviousSessions) {
                if (prevSession.ip === currIp) {
                    isSignInFromUnknownLocation = false;
                    break;
                }
            }

            if (isSignInFromUnknownLocation === true) {
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
    }

    return {
        userId: userId,
        sessionId: newSession.id,
        sessionToken: newSession.sessionToken,
    };
};

export const getUserSessionCookie = (c: Context): UserSessionCookieData | null => {
    try {
        const cookie = getCookie(c, AUTHTOKEN_COOKIE_NAME);
        if (!cookie) {
            return null;
        }
        const cookieData = JSON.parse(cookie) as UserSessionCookieData;
        return cookieData;
    } catch (error) {}
    return null;
};

export async function getLoggedInUser(sessionId: string, sessionToken: string): Promise<ContextUserSession | null> {
    try {
        if (!sessionId || !sessionToken) {
            throw new Error("Missing required fields!");
        }

        const session = await prisma.session.update({
            where: {
                id: sessionId,
                sessionToken: sessionToken,
            },
            data: {
                dateLastActive: new Date(),
            },
            select: {
                user: true,
            },
        });

        return (
            {
                ...session?.user,
                sessionId,
                sessionToken,
            } || null
        );
    } catch (error) {
        return null;
    }
}

export const getUserSession = async (ctx: Context): Promise<User | null> => {
    try {
        // Get the current cookie data
        const cookie = getUserSessionCookie(ctx);
        if (!cookie || !cookie?.userId || !cookie?.sessionId || !cookie?.sessionToken) {
            return null;
        }

        // Get the current logged in user from the cookie data
        const user = await getLoggedInUser(cookie?.sessionId, cookie?.sessionToken);
        if (!user?.id) {
            return null;
        }

        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const logOutUserSession = async (ctx: Context, userSession: ContextUserSession, sessionId: string) => {
    try {
        const deletedSession = await prisma.session.delete({
            where: {
                id: sessionId,
                userId: userSession.id,
            },
        });

        if (!deletedSession?.id) {
            return ctx.json({ success: false, message: `Cannot delete session id: ${sessionId}, idk why!` });
        }
        if (userSession.sessionId === sessionId) deleteUserCookie(ctx, AUTHTOKEN_COOKIE_NAME);

        return ctx.json({ success: true, message: `Session with id: ${sessionId} logged out successfully` });
    } catch (error) {
        return defaultInvalidReqResponse(ctx);
    }
};

export const revokeSessionFromAccessCode = async (ctx: Context, code: string) => {
    let session: Session | null = null;
    try {
        session = await prisma.session.delete({
            where: {
                revokeAccessCode: code,
            },
        });
    } catch (err) {}

    if (!session?.id) {
        await addToUsedRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
        return ctx.json({ success: false, message: "Invalid access code" }, httpCode("bad_request"));
    }
    return ctx.json({ success: true, message: "Successfully revoked the session access" }, httpCode("ok"));
};
