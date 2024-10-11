import type { ContextUserSession } from "@/../types";
import prisma from "@/services/prisma";
import { status } from "@/utils/http";
import type { Context } from "hono";

export const getUserNotifications = async (ctx: Context, userSession: ContextUserSession, slug: string) => {
    const notifications = await prisma.notification.findMany({
        where: {
            user: {
                OR: [{ lowerCaseUserName: slug.toLowerCase() }, { id: slug }],
            },
        },
        orderBy: {
            dateCreated: "desc",
        },
    });

    // Check if the user has access to the notifications
    if (notifications.length > 0 && notifications[0].userId !== userSession.id) {
        return ctx.json({ success: false, message: "You don't have access to these notifications" }, status.UNAUTHORIZED);
    }

    return ctx.json(notifications, status.OK);
};

export const markNotificationAsRead = async (
    ctx: Context,
    userSession: ContextUserSession,
    notificationIds: string[],
    notifUserId: string,
) => {
    const notifications = await prisma.notification.findMany({
        where: {
            id: {
                in: notificationIds,
            },
            userId: notifUserId,
        },
    });
    if (!notifications.length) {
        return ctx.json({ success: false, message: "Notification not found" }, status.NOT_FOUND);
    }

    // Check permission
    if (notifications[0].userId !== userSession.id) {
        return ctx.json({ success: false }, status.UNAUTHORIZED);
    }

    await prisma.notification.updateMany({
        where: {
            id: {
                in: notifications.map((n) => n.id),
            },
        },
        data: {
            read: true,
            dateRead: new Date(),
        },
    });

    return ctx.json({ success: true, message: "Notifications marked as read." }, status.OK);
};

export const deleteNotifications = async (ctx: Context, userSession: ContextUserSession, userSlug: string, notificationIds: string[]) => {
    if (userSlug !== userSession.id) {
        return ctx.json({ success: false }, status.UNAUTHORIZED);
    }

    try {
        await prisma.notification.deleteMany({
            where: {
                id: {
                    in: notificationIds,
                },
                userId: userSlug,
            },
        });
    } catch {}

    return ctx.json({ success: true, message: "Notifications deleted." }, status.OK);
};
