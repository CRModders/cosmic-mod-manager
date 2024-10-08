import { getUserNotifications, markNotificationAsRead as markNotificationsAsRead } from "@/controllers/user/notification";
import { LoginProtectedRoute } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { type Context, Hono } from "hono";

const notificationRouter = new Hono();

notificationRouter.get("/", LoginProtectedRoute, notifications_get);
notificationRouter.patch("/", LoginProtectedRoute, bulkNotifications_patch);
notificationRouter.patch("/:notifId", LoginProtectedRoute, notifications_patch);

async function notifications_get(ctx: Context) {
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

async function notifications_patch(ctx: Context) {
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

export default notificationRouter;
