import { NotificationType } from "@app/utils/types";
import type { JsonObject } from "@prisma/client/runtime/library";
import prisma from "~/services/prisma";
import { generateRandomId } from "~/utils/str";

interface CreateNotificationData {
    id: string;
    userId: string;
    type: NotificationType;
    body: JsonObject;
}

export async function createNotification(notification: CreateNotificationData) {
    return await createNotifications([notification]);
}

export async function createNotifications(notifications: CreateNotificationData[]) {
    return await prisma.notification.createMany({
        data: notifications,
    });
}

interface TeamInviteNotificationData {
    userId: string;
    teamId: string;
    projectId: string;
    invitedBy: string;
    role: string;
}

export async function createProjectTeamInviteNotification(data: TeamInviteNotificationData) {
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
}

interface OrgTeamInviteNotificationData {
    userId: string;
    teamId: string;
    orgId: string;
    invitedBy: string;
    role: string;
}

export async function createOrgTeamInviteNotification(data: OrgTeamInviteNotificationData) {
    return await createNotification({
        id: generateRandomId(),
        userId: data.userId,
        type: NotificationType.ORGANIZATION_INVITE,
        body: {
            invitedBy: data.invitedBy,
            teamId: data.teamId,
            orgId: data.orgId,
            role: data.role,
            type: NotificationType.ORGANIZATION_INVITE,
        },
    });
}
