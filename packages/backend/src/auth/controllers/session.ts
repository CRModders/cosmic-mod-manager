import { addInvalidAuthAttempt } from "@/middleware/rate-limit/invalid-auth-attempt";
import prisma from "@/services/prisma";
import type { ContextUserData } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS, invalidReqestResponseData } from "@/utils/http";
import { AUTHTOKEN_COOKIE_NAMESPACE } from "@shared/config";
import type { UserSessionStates } from "@shared/types";
import type { SessionListData } from "@shared/types/api";
import { deleteSessionCookie, invalidateSessionFromId } from "@src/auth/helpers/session";
import type { Context } from "hono";
import { hashString } from "../helpers";

export async function getUserSessions(userSession: ContextUserData): Promise<RouteHandlerResponse> {
    const sessions = await prisma.session.findMany({
        where: {
            userId: userSession.id,
        },
        orderBy: { dateLastActive: "desc" },
    });

    if (!sessions?.[0]?.id) {
        return invalidReqestResponseData();
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

    return {
        data: list,
        status: HTTP_STATUS.OK,
    };
}

export async function deleteUserSession(ctx: Context, userSession: ContextUserData, sessionId: string): Promise<RouteHandlerResponse> {
    const deletedSession = await invalidateSessionFromId(sessionId, userSession.id);

    if (!deletedSession?.id) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData();
    }
    if (userSession.sessionId === deletedSession.id) deleteSessionCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE);

    return {
        data: { success: true, message: `Session with id: ${sessionId} logged out successfully` },
        status: HTTP_STATUS.OK,
    };
}

export async function revokeSessionFromAccessCode(ctx: Context, code: string): Promise<RouteHandlerResponse> {
    const revokeAccessCodeHash = await hashString(code);
    const targetSession = await prisma.session.findUnique({
        where: {
            revokeAccessCode: revokeAccessCodeHash,
        },
    });
    if (!targetSession?.id) {
        await addInvalidAuthAttempt(ctx);
        return { data: { success: false, message: "Invalid access code" }, status: HTTP_STATUS.BAD_REQUEST };
    }

    await invalidateSessionFromId(targetSession.id);
    return { data: { success: true, message: "Successfully revoked the session access" }, status: HTTP_STATUS.OK };
}
