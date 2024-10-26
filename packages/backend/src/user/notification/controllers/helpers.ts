import prisma from "@/services/prisma";
import { generateRandomId } from "@/utils/str";
import type { JsonObject } from "@prisma/client/runtime/library";
import { NotificationType } from "@shared/types";

interface CreateNotificationData {
    id: string;
    userId: string;
    type: NotificationType;
    body: JsonObject;
}

export const createNotification = async (notification: CreateNotificationData) => {
    return await createNotifications([notification]);
};

export const createNotifications = async (notifications: CreateNotificationData[]) => {
    return await prisma.notification.createMany({
        data: notifications,
    });
};

interface TeamInviteNotificationData {
    userId: string;
    teamId: string;
    projectId: string;
    invitedBy: string;
    role: string;
}

export const createProjectTeamInviteNotification = async (data: TeamInviteNotificationData) => {
    return await createNotification({
        id: generateRandomId(),
        userId: data.userId,
        type: NotificationType.TEAM_INVITE,
        body: {
            invitedBy: data.invitedBy,
            teamId: data.teamId,
            projectId: data.projectId,
            role: data.role,
            type: NotificationType.TEAM_INVITE,
        },
    });
};
