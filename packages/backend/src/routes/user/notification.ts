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

const notificationRouter = new Hono();

notificationRouter.get("/", LoginProtectedRoute, userNotifications_get);
notificationRouter.patch("/", LoginProtectedRoute, bulkNotifications_patch);
notificationRouter.delete("/", LoginProtectedRoute, bulkNotifications_delete);
notificationRouter.get("/:notifId", LoginProtectedRoute, notification_get);
notificationRouter.patch("/:notifId", LoginProtectedRoute, notification_patch);
notificationRouter.delete("/:notifId", LoginProtectedRoute, notification_delete);

async function userNotifications_get(ctx: Context) {
    try {
        const userSlug = ctx.req.param("userId");
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession || !userSlug) {
            return defaultServerErrorResponse(ctx, "User session not found");
        }

        return await getUserNotifications(ctx, userSession, userSlug);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function notification_get(ctx: Context) {
    try {
        const notifId = ctx.req.param("notifId");
        const userSlug = ctx.req.param("userId");
        const userSession = getUserSessionFromCtx(ctx);

        if (!userSession || !userSlug || !notifId) {
            return defaultInvalidReqResponse(ctx);
        }

        return await getNotificationById(ctx, userSession, notifId, userSlug);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function notification_patch(ctx: Context) {
    try {
        const userSlug = ctx.req.param("userId");
        const notificationId = ctx.req.param("notifId");
        const userSession = getUserSessionFromCtx(ctx);

        if (!userSession || !userSlug || !notificationId) {
            return defaultInvalidReqResponse(ctx);
        }

        return await markNotificationsAsRead(ctx, userSession, [notificationId], userSlug);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function bulkNotifications_patch(ctx: Context) {
    try {
        const userSlug = ctx.req.param("userId");
        const userSession = getUserSessionFromCtx(ctx);
        const notificationIds = JSON.parse(ctx.req.query("ids") as string);

        if (!userSession || !userSlug || !notificationIds.length) {
            return defaultInvalidReqResponse(ctx);
        }

        if (notificationIds.some((id: unknown) => typeof id !== "string")) {
            return defaultInvalidReqResponse(ctx, "Invalid notification ids list");
        }

        return await markNotificationsAsRead(ctx, userSession, notificationIds, userSlug);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function notification_delete(ctx: Context) {
    try {
        const userSlug = ctx.req.param("userId");
        const notifId = ctx.req.param("notifId");
        const userSession = getUserSessionFromCtx(ctx);

        if (!userSession || !userSlug || !notifId) {
            return defaultInvalidReqResponse(ctx);
        }

        return await deleteNotifications(ctx, userSession, userSlug, [notifId]);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function bulkNotifications_delete(ctx: Context) {
    try {
        const userSlug = ctx.req.param("userId");
        const userSession = getUserSessionFromCtx(ctx);
        const notificationIds = JSON.parse(ctx.req.query("ids") as string);

        if (!userSession || !userSlug || !notificationIds.length) {
            return defaultInvalidReqResponse(ctx);
        }

        if (notificationIds.some((id: unknown) => typeof id !== "string")) {
            return defaultInvalidReqResponse(ctx, "Invalid notification ids list");
        }

        return await deleteNotifications(ctx, userSession, userSlug, notificationIds);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

export default notificationRouter;
