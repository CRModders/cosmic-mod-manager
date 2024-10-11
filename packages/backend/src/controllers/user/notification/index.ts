import type { ContextUserSession } from "@/../types";
import prisma from "@/services/prisma";
import { status } from "@/utils/http";
import type { Context } from "hono";

export const getUserNotifications = async (ctx: Context, userSession: ContextUserSession, notifUserId: string) => {
    const notifications = await prisma.notification.findMany({
        where: {
            user: {
                OR: [{ lowerCaseUserName: notifUserId.toLowerCase() }, { id: notifUserId }],
            },
        },
        orderBy: {
            dateCreated: "desc",
        },
    });

    // Check if the user has access to the notifications
    if (!hasNotificationAccess(userSession, notifUserId)) {
        return ctx.json({ success: false }, status.UNAUTHORIZED);
    }

    return ctx.json(notifications, status.OK);
};

export const getNotificationById = async (ctx: Context, userSession: ContextUserSession, notifId: string) => {
    const notification = await prisma.notification.findFirst({
        where: {
            id: notifId,
        },
    });

    if (!notification) {
        return ctx.json({ success: false, message: "Notification not found" }, status.NOT_FOUND);
    }

    // Check permission
    if (!hasNotificationAccess(userSession, notification.userId)) {
        return ctx.json({ success: false }, status.UNAUTHORIZED);
    }

    return ctx.json(notification, status.OK);
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
            user: {
                OR: [{ lowerCaseUserName: notifUserId.toLowerCase() }, { id: notifUserId }],
            },
        },
    });
    if (!notifications.length) {
        return ctx.json({ success: false, message: "Notification not found" }, status.NOT_FOUND);
    }

    // Check permission
    if (!hasNotificationAccess(userSession, notifUserId)) {
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
    if (!hasNotificationAccess(userSession, userSlug)) {
        return ctx.json({ success: false }, status.UNAUTHORIZED);
    }

    try {
        await prisma.notification.deleteMany({
            where: {
                id: {
                    in: notificationIds,
                },
                user: {
                    OR: [{ lowerCaseUserName: userSlug.toLowerCase() }, { id: userSlug }],
                },
            },
        });
    } catch {}

    return ctx.json({ success: true, message: "Notifications deleted." }, status.OK);
};

// Helpers
export function hasNotificationAccess(session: ContextUserSession, notificationUser: string) {
    return session.id === notificationUser || session.userName.toLowerCase() === notificationUser.toLowerCase();
}
