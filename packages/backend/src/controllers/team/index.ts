import type { ContextUserSession } from "@/../types";
import prisma from "@/services/prisma";
import { status } from "@/utils/http";
import { STRING_ID_LENGTH } from "@shared/config";
import { doesMemberHaveAccess } from "@shared/lib/utils";
import type { updateProjectMemberFormSchema } from "@shared/schemas/project/settings/members";
import { ProjectPermission } from "@shared/types";
import type { Context } from "hono";
import { nanoid } from "nanoid";
import type { z } from "zod";
import { createTeamInviteNotification } from "../user/notification/helpers";

export const inviteMember = async (ctx: Context, userSession: ContextUserSession, userName: string, teamId: string) => {
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
    if (!team?.id || !currMember) return ctx.json({ success: false }, status.NOT_FOUND);

    const canManageInvites = doesMemberHaveAccess(
        ProjectPermission.MANAGE_INVITES,
        currMember.permissions as ProjectPermission[],
        currMember.isOwner,
    );
    if (!canManageInvites) {
        return ctx.json({ success: false, message: "You don't have access to manage member invites" }, status.UNAUTHORIZED);
    }

    const targetUser = await prisma.user.findUnique({
        where: {
            lowerCaseUserName: userName.toLowerCase(),
        },
    });

    if (!targetUser?.id) return ctx.json({ success: false, message: "Invalid username" }, status.NOT_FOUND);
    if (team.members.some((member) => member.userId === targetUser.id)) {
        return ctx.json({ success: false, message: `"${targetUser.userName}" is already a member of this project` }, status.BAD_REQUEST);
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
    await createTeamInviteNotification({
        userId: targetUser.id,
        teamId: team.id,
        projectId: team.project?.id || "",
        invitedBy: userSession.id,
        role: newMember.role,
    });

    return ctx.json({ success: true }, status.OK);
};

export const acceptTeamInvite = async (ctx: Context, userSession: ContextUserSession, teamId: string) => {
    const targetTeamMember = await prisma.teamMember.findFirst({
        where: {
            teamId: teamId,
            userId: userSession.id,
            accepted: false,
        },
    });
    if (!targetTeamMember?.id) return ctx.json({ success: false, message: "Invalid request" }, status.BAD_REQUEST);

    await prisma.teamMember.update({
        where: {
            id: targetTeamMember.id,
        },
        data: {
            accepted: true,
            dateAccepted: new Date(),
        },
    });

    return ctx.json({ success: true, message: "Joined successfully" }, status.OK);
};

export const leaveTeam = async (ctx: Context, userSession: ContextUserSession, teamId: string) => {
    const targetTeamMember = await prisma.teamMember.findFirst({
        where: {
            teamId: teamId,
            userId: userSession.id,
        },
    });
    if (!targetTeamMember?.id) return ctx.json({ success: false, message: "Invalid request" }, status.BAD_REQUEST);
    if (targetTeamMember.isOwner !== false)
        return ctx.json({ success: false, message: "You can't leave the team while you're the owner" }, status.BAD_REQUEST);

    await prisma.teamMember.delete({
        where: {
            id: targetTeamMember.id,
        },
    });

    return ctx.json({ success: true, message: "Left team" }, status.OK);
};

export const removeMember = async (ctx: Context, userSession: ContextUserSession, targetMemberId: string, teamId: string) => {
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
    if (!team?.id || !currMember) return ctx.json({ success: false }, status.NOT_FOUND);

    const canRemoveMembers = doesMemberHaveAccess(
        ProjectPermission.REMOVE_MEMBER,
        currMember.permissions as ProjectPermission[],
        currMember.isOwner,
    );
    if (!canRemoveMembers) {
        return ctx.json({ success: false, message: "You don't have access to remove members" }, status.UNAUTHORIZED);
    }

    const targetMember = team.members.find((member) => member.id === targetMemberId);
    if (!targetMember?.id) return ctx.json({ success: false, message: "Invalid username" }, status.NOT_FOUND);

    if (!targetMember) {
        return ctx.json({ success: false, message: "User is not a member of this project" }, status.BAD_REQUEST);
    }

    await prisma.teamMember.delete({
        where: {
            id: targetMember.id,
        },
    });

    return ctx.json({ success: true }, status.OK);
};

export const updateMember = async (
    ctx: Context,
    userSession: ContextUserSession,
    targetMemberId: string,
    teamId: string,
    formData: z.infer<typeof updateProjectMemberFormSchema>,
) => {
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
    if (!team?.id || !currMember) return ctx.json({ success: false }, status.NOT_FOUND);

    const canEditMembers = doesMemberHaveAccess(
        ProjectPermission.EDIT_MEMBER,
        currMember.permissions as ProjectPermission[],
        currMember.isOwner,
    );
    if (!canEditMembers) {
        return ctx.json({ success: false, message: "You don't have access to edit members" }, status.UNAUTHORIZED);
    }

    const targetMember = team.members.find((member) => member.id === targetMemberId);
    if (!targetMember?.id) return ctx.json({ success: false, message: "Invalid member id" }, status.NOT_FOUND);

    await prisma.teamMember.update({
        where: {
            id: targetMember.id,
        },
        data: {
            role: formData.role,
            ...(targetMember.isOwner ? {} : { permissions: formData.permissions }),
        },
    });

    return ctx.json({ success: true, message: "Member updated" }, status.OK);
};
