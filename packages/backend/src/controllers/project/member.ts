import type { ContextUserSession } from "@/../types";
import prisma from "@/services/prisma";
import httpCode from "@/utils/http";
import { STRING_ID_LENGTH } from "@shared/config";
import { ProjectPermissions } from "@shared/types";
import type { Context } from "hono";
import { nanoid } from "nanoid";

export const inviteProjectMember = async (ctx: Context, userSession: ContextUserSession, userName: string, projectSlug: string) => {
    const project = await prisma.project.findUnique({
        where: { slug: projectSlug },
        select: {
            id: true,
            team: {
                select: {
                    id: true,
                    members: {
                        select: {
                            userId: true,
                            permissions: true,
                        },
                    },
                },
            },
        },
    });

    if (!project?.id) return ctx.json({ success: false }, httpCode("not_found"));

    const currMember = project.team.members.find((member) => member.userId === userSession.id);
    if (!currMember?.permissions.includes(ProjectPermissions.MANAGE_INVITES)) {
        return ctx.json({ success: false, message: "You don't have access to manage member invites" }, httpCode("unauthorized"));
    }

    const targetUser = await prisma.user.findUnique({
        where: {
            lowerCaseUserName: userName.toLowerCase(),
        },
    });

    if (!targetUser?.id) return ctx.json({ success: false, message: "Invalid username" }, httpCode("not_found"));
    if (project.team.members.some((member) => member.userId === targetUser.id)) {
        return ctx.json(
            { success: false, message: `"${targetUser.userName}" is already a member of this project` },
            httpCode("bad_request"),
        );
    }

    await prisma.teamMember.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            teamId: project.team.id,
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
