import type { ContextUserSession } from "@/../types";
import prisma from "@/services/prisma";
import httpCode from "@/utils/http";
import { STRING_ID_LENGTH } from "@shared/config";
import type { updateProjectMemberFormSchema } from "@shared/schemas/project/settings/members";
import { ProjectPermissions } from "@shared/types";
import type { Context } from "hono";
import { nanoid } from "nanoid";
import type { z } from "zod";

export const inviteMember = async (ctx: Context, userSession: ContextUserSession, userName: string, teamId: string) => {
    const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: {
            id: true,
            members: {
                select: {
                    userId: true,
                    permissions: true,
                },
            },
        },
    });

    if (!team?.id) return ctx.json({ success: false }, httpCode("not_found"));

    const currMember = team.members.find((member) => member.userId === userSession.id);
    if (!currMember?.permissions.includes(ProjectPermissions.MANAGE_INVITES)) {
        return ctx.json({ success: false, message: "You don't have access to manage member invites" }, httpCode("unauthorized"));
    }

    const targetUser = await prisma.user.findUnique({
        where: {
            lowerCaseUserName: userName.toLowerCase(),
        },
    });

    if (!targetUser?.id) return ctx.json({ success: false, message: "Invalid username" }, httpCode("not_found"));
    if (team.members.some((member) => member.userId === targetUser.id)) {
        return ctx.json(
            { success: false, message: `"${targetUser.userName}" is already a member of this project` },
            httpCode("bad_request"),
        );
    }

    await prisma.teamMember.create({
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

    return ctx.json({ success: true }, httpCode("ok"));
};

export const acceptTeamInvite = async (ctx: Context, userSession: ContextUserSession, teamId: string) => {
    const targetTeamMember = await prisma.teamMember.findFirst({
        where: {
            teamId: teamId,
            userId: userSession.id,
            accepted: false,
        },
    });
    if (!targetTeamMember?.id) return ctx.json({ success: false, message: "Invalid request" }, httpCode("bad_request"));

    await prisma.teamMember.update({
        where: {
            id: targetTeamMember.id,
        },
        data: {
            accepted: true,
            dateAccepted: new Date(),
        },
    });

    return ctx.json({ success: true, message: "Joined successfully" }, httpCode("ok"));
};

export const leaveTeam = async (ctx: Context, userSession: ContextUserSession, teamId: string) => {
    const targetTeamMember = await prisma.teamMember.findFirst({
        where: {
            teamId: teamId,
            userId: userSession.id,
        },
    });
    if (!targetTeamMember?.id) return ctx.json({ success: false, message: "Invalid request" }, httpCode("bad_request"));
    if (targetTeamMember.isOwner !== false)
        return ctx.json({ success: false, message: "You can't leave the team while you're the owner" }, httpCode("bad_request"));

    await prisma.teamMember.delete({
        where: {
            id: targetTeamMember.id,
        },
    });

    return ctx.json({ success: true, message: "Left team" }, httpCode("ok"));
};

export const removeMember = async (ctx: Context, userSession: ContextUserSession, targetMemberId: string, teamId: string) => {
    const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: {
            id: true,
            members: {
                select: {
                    id: true,
                    userId: true,
                    permissions: true,
                },
            },
        },
    });

    if (!team?.id) return ctx.json({ success: false }, httpCode("not_found"));

    const currMember = team.members.find((member) => member.userId === userSession.id);
    if (!currMember?.permissions.includes(ProjectPermissions.REMOVE_MEMBER)) {
        return ctx.json({ success: false, message: "You don't have access to remove members" }, httpCode("unauthorized"));
    }

    const targetMember = team.members.find((member) => member.id === targetMemberId);
    if (!targetMember?.id) return ctx.json({ success: false, message: "Invalid username" }, httpCode("not_found"));

    if (!targetMember) {
        return ctx.json({ success: false, message: "User is not a member of this project" }, httpCode("bad_request"));
    }

    await prisma.teamMember.delete({
        where: {
            id: targetMember.id,
        },
    });

    return ctx.json({ success: true }, httpCode("ok"));
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
    if (!team?.id) return ctx.json({ success: false }, httpCode("not_found"));

    const currMember = team.members.find((member) => member.userId === userSession.id);
    if (!currMember?.permissions.includes(ProjectPermissions.EDIT_MEMBER)) {
        return ctx.json({ success: false, message: "You don't have access to edit members" }, httpCode("unauthorized"));
    }

    const targetMember = team.members.find((member) => member.id === targetMemberId);
    if (!targetMember?.id) return ctx.json({ success: false, message: "Invalid member id" }, httpCode("not_found"));

    await prisma.teamMember.update({
        where: {
            id: targetMember.id,
        },
        data: {
            role: formData.role,
            ...(targetMember.isOwner ? {} : { permissions: formData.permissions }),
        },
    });

    return ctx.json({ success: true, message: "Member updated" }, httpCode("ok"));
};
