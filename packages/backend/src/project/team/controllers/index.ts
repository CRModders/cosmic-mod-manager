import { addInvalidAuthAttempt } from "@/middleware/rate-limit/invalid-auth-attempt";
import prisma from "@/services/prisma";
import { createProjectTeamInviteNotification } from "@/src/user/notification/controllers/helpers";
import type { ContextUserData } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData, unauthorizedReqResponseData } from "@/utils/http";
import { STRING_ID_LENGTH } from "@shared/config";
import { doesMemberHaveAccess } from "@shared/lib/utils";
import type { updateProjectMemberFormSchema } from "@shared/schemas/project/settings/members";
import { ProjectPermission } from "@shared/types";
import type { Context } from "hono";
import { nanoid } from "nanoid";
import type { z } from "zod";

export async function inviteToProjectTeam(
    ctx: Context,
    userSession: ContextUserData,
    userName: string,
    teamId: string,
): Promise<RouteHandlerResponse> {
    const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: {
            id: true,
            members: {
                select: {
                    userId: true,
                    isOwner: true,
                    permissions: true,
                },
            },
            project: {
                select: {
                    id: true,
                },
            },
        },
    });
    const currMember = team?.members.find((member) => member.userId === userSession.id);
    if (!team?.id || !currMember || !team.project) return notFoundResponseData();

    const canManageInvites = doesMemberHaveAccess(
        ProjectPermission.MANAGE_INVITES,
        currMember.permissions as ProjectPermission[],
        currMember.isOwner,
    );
    if (!canManageInvites) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to manage member invites");
    }

    const targetUser = await prisma.user.findUnique({
        where: {
            lowerCaseUserName: userName.toLowerCase(),
        },
    });

    if (!targetUser?.id) return notFoundResponseData("User not found");
    if (team.members.some((member) => member.userId === targetUser.id)) {
        return invalidReqestResponseData(`"${targetUser.userName}" is already a member of this project`);
    }

    const newMember = await prisma.teamMember.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            teamId: team.id,
            userId: targetUser.id,
            role: "Member",
            isOwner: false,
            permissions: [],
            organisationPermissions: [],
            accepted: false,
        },
    });

    // Notify the user
    await createProjectTeamInviteNotification({
        userId: targetUser.id,
        teamId: team.id,
        projectId: team.project?.id || "",
        invitedBy: userSession.id,
        role: newMember.role,
    });

    return { data: { success: true }, status: HTTP_STATUS.OK };
}

export async function acceptProjectTeamInvite(ctx: Context, userSession: ContextUserData, teamId: string): Promise<RouteHandlerResponse> {
    const targetTeamMember = await prisma.teamMember.findFirst({
        where: {
            teamId: teamId,
            userId: userSession.id,
            accepted: false,
        },
    });
    if (!targetTeamMember?.id) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData();
    }

    await prisma.teamMember.update({
        where: {
            id: targetTeamMember.id,
        },
        data: {
            accepted: true,
            dateAccepted: new Date(),
        },
    });

    return { data: { success: true, message: "Joined successfully" }, status: HTTP_STATUS.OK };
}

export async function leaveProjectTeam(ctx: Context, userSession: ContextUserData, teamId: string): Promise<RouteHandlerResponse> {
    const targetTeamMember = await prisma.teamMember.findFirst({
        where: {
            teamId: teamId,
            userId: userSession.id,
        },
    });
    if (!targetTeamMember?.id) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData();
    }
    if (targetTeamMember.isOwner !== false) invalidReqestResponseData("You can't leave the team while you're the owner");

    await prisma.teamMember.delete({
        where: {
            id: targetTeamMember.id,
        },
    });

    return { data: { success: true, message: "Left the project team" }, status: HTTP_STATUS.OK };
}

export async function editProjectMember(
    ctx: Context,
    userSession: ContextUserData,
    targetMemberId: string,
    teamId: string,
    formData: z.infer<typeof updateProjectMemberFormSchema>,
): Promise<RouteHandlerResponse> {
    const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: {
            id: true,
            members: {
                select: {
                    id: true,
                    userId: true,
                    permissions: true,
                    isOwner: true,
                },
            },
        },
    });
    const currMember = team?.members.find((member) => member.userId === userSession.id);
    if (!team?.id || !currMember?.id) return notFoundResponseData();

    const canEditMembers = doesMemberHaveAccess(
        ProjectPermission.EDIT_MEMBER,
        currMember.permissions as ProjectPermission[],
        currMember.isOwner,
    );
    if (!canEditMembers) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to edit members");
    }

    const targetMember = team.members.find((member) => member.id === targetMemberId);
    if (!targetMember?.id) return notFoundResponseData("Member not found");

    await prisma.teamMember.update({
        where: {
            id: targetMember.id,
        },
        data: {
            role: formData.role,
            ...(targetMember.isOwner ? {} : { permissions: formData.permissions }),
        },
    });

    return { data: { success: true, message: "Member updated" }, status: HTTP_STATUS.OK };
}

export const removeProjectMember = async (ctx: Context, userSession: ContextUserData, targetMemberId: string, teamId: string) => {
    const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: {
            id: true,
            members: {
                select: {
                    id: true,
                    isOwner: true,
                    userId: true,
                    permissions: true,
                },
            },
        },
    });
    const currMember = team?.members.find((member) => member.userId === userSession.id);
    if (!team?.id || !currMember) return notFoundResponseData();

    const canRemoveMembers = doesMemberHaveAccess(
        ProjectPermission.REMOVE_MEMBER,
        currMember.permissions as ProjectPermission[],
        currMember.isOwner,
    );
    if (!canRemoveMembers) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to remove members");
    }

    const targetMember = team.members.find((member) => member.id === targetMemberId);
    if (!targetMember?.id) return notFoundResponseData("Member not found");

    if (!targetMember) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData("Member not found");
    }

    await prisma.teamMember.delete({
        where: {
            id: targetMember.id,
        },
    });

    return { data: { success: true }, status: HTTP_STATUS.OK };
};
