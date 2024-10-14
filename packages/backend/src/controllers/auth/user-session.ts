import type { ContextUserSession } from "@/../types";
import { addToUsedApiRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { deleteUserCookie } from "@/utils";
import { defaultInvalidReqResponse, status } from "@/utils/http";
import type { Session } from "@prisma/client";
import { AUTHTOKEN_COOKIE_NAMESPACE } from "@shared/config";
import { UNAUTHORIZED_ACCESS_ATTEMPT_CHARGE } from "@shared/config/rate-limit-charges";
import type { UserSessionStates } from "@shared/types";
import type { SessionListData } from "@shared/types/api";
import type { Context } from "hono";

export const getUserSessions = async (ctx: Context, userSession: ContextUserSession) => {
    const sessions = await prisma.session.findMany({
        where: {
            userId: userSession.id,
        },
        orderBy: { dateLastActive: "desc" },
    });

    if (!sessions?.[0]?.id) {
        return defaultInvalidReqResponse(ctx);
    }

    const list: SessionListData[] = [];
    for (const session of sessions) {
        list.push({
            id: session.id,
            userId: session.userId,
            dateCreated: session.dateCreated,
            dateLastActive: session.dateLastActive,
            providerName: session.providerName || "",
            status: session.status as UserSessionStates,
            os: session.os,
            browser: session.browser,
            city: session.city,
            country: session.country,
            ip: session.ip,
            userAgent: session.userAgent,
        });
    }

    return ctx.json(list, status.OK);
};

export const deleteUserSession = async (ctx: Context, userSession: ContextUserSession, sessionId: string) => {
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
        if (userSession.sessionId === sessionId) deleteUserCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE);

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
        await addToUsedApiRateLimit(ctx, UNAUTHORIZED_ACCESS_ATTEMPT_CHARGE);
        return ctx.json({ success: false, message: "Invalid access code" }, status.BAD_REQUEST);
    }
    return ctx.json({ success: true, message: "Successfully revoked the session access" }, status.OK);
};
