import {
    deleteNotifications,
    getNotificationById,
    getUserNotifications,
    markNotificationAsRead as markNotificationsAsRead,
} from "@/controllers/user/notification";
import { LoginProtectedRoute } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { type Context, Hono } from "hono";

const userNotificationRouter = new Hono();

userNotificationRouter.get("/", LoginProtectedRoute, userNotifications_get);
userNotificationRouter.patch("/", LoginProtectedRoute, bulkNotifications_patch);
userNotificationRouter.delete("/", LoginProtectedRoute, bulkNotifications_delete);
userNotificationRouter.get("/:notifId", LoginProtectedRoute, notification_get);
userNotificationRouter.patch("/:notifId", LoginProtectedRoute, notification_patch);
userNotificationRouter.delete("/:notifId", LoginProtectedRoute, notification_delete);

async function userNotifications_get(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession) {
            return defaultServerErrorResponse(ctx, "User session not found");
        }

        return await getUserNotifications(ctx, userSession, userSession.id);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function notification_get(ctx: Context) {
    try {
        const notifId = ctx.req.param("notifId");
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession || !notifId) {
            return defaultInvalidReqResponse(ctx);
        }

        return await getNotificationById(ctx, userSession, notifId);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function notification_patch(ctx: Context) {
    try {
        const notificationId = ctx.req.param("notifId");
        const userSession = getUserSessionFromCtx(ctx);

        if (!userSession || !notificationId) {
            return defaultInvalidReqResponse(ctx);
        }

        return await markNotificationsAsRead(ctx, userSession, [notificationId], userSession.id);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function bulkNotifications_patch(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const notificationIds = JSON.parse(ctx.req.query("ids") as string);

        if (!userSession || !notificationIds.length) {
            return defaultInvalidReqResponse(ctx);
        }

        if (notificationIds.some((id: unknown) => typeof id !== "string")) {
            return defaultInvalidReqResponse(ctx, "Invalid notification ids list");
        }

        return await markNotificationsAsRead(ctx, userSession, notificationIds, userSession.id);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function notification_delete(ctx: Context) {
    try {
        const notifId = ctx.req.param("notifId");
        const userSession = getUserSessionFromCtx(ctx);

        if (!userSession || !notifId) {
            return defaultInvalidReqResponse(ctx);
        }

        return await deleteNotifications(ctx, userSession, userSession.id, [notifId]);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function bulkNotifications_delete(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const notificationIds = JSON.parse(ctx.req.query("ids") as string);

        if (!userSession || !notificationIds.length) {
            return defaultInvalidReqResponse(ctx);
        }

        if (notificationIds.some((id: unknown) => typeof id !== "string")) {
            return defaultInvalidReqResponse(ctx, "Invalid notification ids list");
        }

        return await deleteNotifications(ctx, userSession, userSession.id, notificationIds);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

export default userNotificationRouter;
