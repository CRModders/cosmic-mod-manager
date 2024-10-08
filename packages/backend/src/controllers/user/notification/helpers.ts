import prisma from "@/services/prisma";
import type { JsonObject } from "@prisma/client/runtime/library";
import { STRING_ID_LENGTH } from "@shared/config";
import { NotificationType } from "@shared/types";
import { nanoid } from "nanoid";

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

export const createTeamInviteNotification = async (data: TeamInviteNotificationData) => {
    return await createNotification({
        id: nanoid(STRING_ID_LENGTH),
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
