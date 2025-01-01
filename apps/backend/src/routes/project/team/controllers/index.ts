import { hasRootAccess } from "@app/utils/config/roles";
import { doesMemberHaveAccess, doesOrgMemberHaveAccess, getCurrMember } from "@app/utils/project";
import type { overrideOrgMemberFormSchema, updateTeamMemberFormSchema } from "@app/utils/schemas/project/settings/members";
import { OrganisationPermission, ProjectPermission } from "@app/utils/types";
import type { Context } from "hono";
import type { z } from "zod";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { createOrgTeamInviteNotification, createProjectTeamInviteNotification } from "~/routes/user/notification/controllers/helpers";
import prisma from "~/services/prisma";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData, unauthorizedReqResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";
import { teamPermsSelectObj } from "../../queries/project";

export async function inviteMember(ctx: Context, userSession: ContextUserData, userSlug: string, teamId: string) {
    const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: {
            id: true,
            members: {
                select: {
                    userId: true,
                    isOwner: true,
                    permissions: true,
                    organisationPermissions: true,
                    accepted: true,
                },
            },
            project: {
                select: {
                    id: true,
                    organisation: {
                        select: {
                            ...teamPermsSelectObj(),
                        },
                    },
                },
            },
            organisation: {
                select: {
                    id: true,
                },
            },
        },
    });
    if (!team || (!team.project && !team.organisation)) return notFoundResponseData();

    let canManageInvites = false;
    // Handle organiszation team invite
    if (team?.organisation?.id) {
        const currMember = team.members.find((member) => member.userId === userSession.id);
        canManageInvites = doesOrgMemberHaveAccess(
            OrganisationPermission.MANAGE_INVITES,
            currMember?.organisationPermissions as OrganisationPermission[],
            currMember?.isOwner,
            userSession.role,
        );
    }
    // Handle project team invite
    else {
        if (!team?.id) return invalidReqestResponseData();

        const currMember = getCurrMember(userSession.id, team.members || [], team.project?.organisation?.team.members || []);
        canManageInvites = doesMemberHaveAccess(
            ProjectPermission.MANAGE_INVITES,
            currMember?.permissions as ProjectPermission[],
            currMember?.isOwner,
            userSession.role,
        );
    }
    if (!canManageInvites) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to manage member invites");
    }

    const targetUser = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    userName: { equals: userSlug, mode: "insensitive" },
                },
                { id: userSlug },
            ],
        },
    });

    if (!targetUser?.id) return notFoundResponseData("User not found");
    const existingMember = team.members.find((member) => member.userId === targetUser.id);
    if (existingMember) {
        if (existingMember.accepted === false)
            return invalidReqestResponseData(`"${targetUser.userName}" has already been invited to this team`);
        return invalidReqestResponseData(`"${targetUser.userName}" is already a member of this team`);
    }

    let isAlreadyProjectOrgMember = false;
    if (team?.project?.organisation) {
        const orgMembership = team.project.organisation?.team?.members.find((member) => member.userId === targetUser.id);
        isAlreadyProjectOrgMember = !!orgMembership?.id && orgMembership.accepted;

        if (orgMembership?.isOwner === true) {
            return invalidReqestResponseData("You cannot override the permissions of organization's owner in a project team");
        }
    }

    // No need to send an invite if the user is already a member of the organisation which the project belongs to
    const defaultAccepted = isAlreadyProjectOrgMember;
    const newMember = await prisma.teamMember.create({
        data: {
            id: generateDbId(),
            teamId: team.id,
            userId: targetUser.id,
            role: "Member",
            isOwner: false,
            permissions: [],
            organisationPermissions: [],
            accepted: defaultAccepted === true,
            dateAccepted: defaultAccepted === true ? new Date() : null,
        },
    });

    if (defaultAccepted) return { data: { success: true }, status: HTTP_STATUS.OK };

    if (team.organisation?.id) {
        await createOrgTeamInviteNotification({
            userId: targetUser.id,
            teamId: team.id,
            orgId: team.organisation.id,
            invitedBy: userSession.id,
            role: newMember.role,
        });
    } else if (team?.project) {
        await createProjectTeamInviteNotification({
            userId: targetUser.id,
            teamId: team.id,
            projectId: team.project.id,
            invitedBy: userSession.id,
            role: newMember.role,
        });
    }

    return { data: { success: true }, status: HTTP_STATUS.OK };
}

export async function acceptProjectTeamInvite(ctx: Context, userSession: ContextUserData, teamId: string) {
    const targetTeamMember = await prisma.teamMember.findFirst({
        where: {
            teamId: teamId,
            userId: userSession.id,
            accepted: false,
        },
    });
    if (!targetTeamMember?.id || targetTeamMember.accepted) {
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

export async function leaveProjectTeam(ctx: Context, userSession: ContextUserData, teamId: string) {
    const targetTeamMember = await prisma.teamMember.findFirst({
        where: {
            teamId: teamId,
            userId: userSession.id,
        },
        include: {
            team: {
                select: {
                    // Check if this team belongs to an organization
                    organisation: {
                        select: {
                            id: true,
                        },
                    },

                    // Check if the user is also the part of the organization this team's project belongs to
                    project: {
                        where: {
                            organisation: {
                                team: {
                                    members: { some: { userId: userSession.id, accepted: true } },
                                },
                            },
                        },
                    },

                    // NOTE: A team will never have both project and organisation
                },
            },
        },
    });
    if (!targetTeamMember?.id) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData("You're not a member of this team");
    }
    if (targetTeamMember.isOwner === true) return invalidReqestResponseData("You can't leave the team while you're the owner");

    // If this is a project team, the project is part of an organization and, the user is also part of the organization
    // Then the user shouldn't be allowed to leave the project team directly, this would cause the overriden permissions to reset to default
    // which might be a bad thing in some cases
    const project = targetTeamMember.team.project;
    if (project?.id && project.organisationId) {
        return invalidReqestResponseData(
            "You can't leave the project team directly, please leave the parent organization in order to be removed from this project team!",
        );
    }

    // Remove the member from the team
    await prisma.teamMember.delete({
        where: {
            id: targetTeamMember.id,
        },
    });

    // If this is an organization team, remove the member from all the projects of the organization
    // This should only be done if the user is an accepted member of the organization
    // Reason: If the user is still a pending member of the organization, then the only reason they are in any of the org project's team
    // is because they were explicitly added to the project, we don't want to remove members from the project in this case
    if (targetTeamMember.team.organisation?.id && targetTeamMember.accepted === true) {
        await removeMemberFromAllOrgProjects(targetTeamMember.team.organisation.id, targetTeamMember.userId);
    }

    return { data: { success: true, message: "Left the project team" }, status: HTTP_STATUS.OK };
}

export async function editProjectMember(
    ctx: Context,
    userSession: ContextUserData,
    targetMemberId: string,
    teamId: string,
    formData: z.infer<typeof updateTeamMemberFormSchema>,
) {
    const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: {
            id: true,
            members: {
                select: {
                    id: true,
                    userId: true,
                    permissions: true,
                    organisationPermissions: true,
                    isOwner: true,
                },
            },
            project: {
                select: {
                    id: true,
                    organisation: {
                        select: {
                            ...teamPermsSelectObj({ userId: userSession.id }),
                        },
                    },
                },
            },
            organisation: {
                select: {
                    id: true,
                },
            },
        },
    });
    if (!team?.id) return notFoundResponseData();

    const currMember = getCurrMember(userSession.id, team.members || [], team.project?.organisation?.team.members || []);
    let canEditMembers = false;

    if (team.organisation?.id) {
        canEditMembers = doesOrgMemberHaveAccess(
            OrganisationPermission.EDIT_MEMBER,
            currMember?.organisationPermissions as OrganisationPermission[],
            currMember?.isOwner,
            userSession.role,
        );
    } else {
        canEditMembers = doesMemberHaveAccess(
            ProjectPermission.EDIT_MEMBER,
            currMember?.permissions as ProjectPermission[],
            currMember?.isOwner,
            userSession.role,
        );
    }
    if (!canEditMembers) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to edit members");
    }

    const targetMember = team.members.find((member) => member.id === targetMemberId);
    if (!targetMember?.id) return notFoundResponseData("Member not found");

    // Only owner can add permissions to the member
    if (!hasRootAccess(currMember?.isOwner, userSession.role)) {
        for (const permission of formData.permissions || []) {
            if (!targetMember.permissions.includes(permission)) {
                // If this is an org team, check if the user has access to edit default permissions
                if (team.organisation?.id) {
                    const canEditDefaultPermissions = doesOrgMemberHaveAccess(
                        OrganisationPermission.EDIT_MEMBER_DEFAULT_PERMISSIONS,
                        currMember?.organisationPermissions as OrganisationPermission[],
                        currMember?.isOwner,
                        userSession.role,
                    );

                    if (canEditDefaultPermissions) break;
                }

                return unauthorizedReqResponseData("You don't have access to add permissions to the member");
            }
        }

        for (const permission of formData.organisationPermissions || []) {
            if (!targetMember.organisationPermissions.includes(permission)) {
                return unauthorizedReqResponseData("You don't have access to add permissions to the member");
            }
        }
    }

    const updatedPerms = {
        permissions: formData.permissions || [],
        organisationPermissions: team.organisation?.id ? formData.organisationPermissions : [],
    };

    await prisma.teamMember.update({
        where: {
            id: targetMember.id,
        },
        data: {
            role: formData.role,
            ...(targetMember.isOwner ? {} : updatedPerms),
        },
    });

    return { data: { success: true, message: "Member updated" }, status: HTTP_STATUS.OK };
}

export async function overrideOrgMember(
    ctx: Context,
    userSession: ContextUserData,
    teamId: string,
    formData: z.infer<typeof overrideOrgMemberFormSchema>,
) {
    const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: {
            id: true,
            members: {
                select: {
                    id: true,
                    userId: true,
                    isOwner: true,
                    permissions: true,
                },
            },
            project: {
                select: {
                    id: true,
                    organisation: {
                        select: {
                            id: true,
                            ...teamPermsSelectObj(),
                        },
                    },
                },
            },
        },
    });
    if (!team) return notFoundResponseData();
    if (!team?.project?.id || !team.project.organisation?.id) return invalidReqestResponseData();

    const currMember = getCurrMember(userSession.id, team?.members || [], team?.project?.organisation?.team.members || []);
    const canEditMembers = doesMemberHaveAccess(
        ProjectPermission.EDIT_MEMBER,
        currMember?.permissions as ProjectPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canEditMembers) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to override members");
    }

    if (!hasRootAccess(currMember?.isOwner, userSession.role) && formData.permissions?.length)
        return unauthorizedReqResponseData("You don't have access to add permissions to a member");

    // Check if the user is a member of the organisation
    const orgMember = team.project.organisation.team.members.find((member) => member.userId === formData.userId);
    if (!orgMember) return notFoundResponseData("User is not a part of this project's organisation");
    if (!orgMember.accepted) return invalidReqestResponseData("User is still a pending member of the organization");

    // Check if the user is already a member of the project team
    const existingMember = team.members.find((member) => member.userId === formData.userId);
    if (existingMember) return invalidReqestResponseData("User is already a member of this project's team");

    const targetUser = await prisma.user.findUnique({
        where: {
            id: formData.userId,
        },
    });
    if (!targetUser) return notFoundResponseData("User not found");

    await prisma.teamMember.create({
        data: {
            id: generateDbId(),
            teamId: team.id,
            userId: targetUser.id,
            role: formData.role,
            isOwner: false,
            permissions: orgMember.isOwner ? [] : formData.permissions,
            organisationPermissions: [],
            accepted: true,
            dateAccepted: new Date(),
        },
    });

    return { data: { success: true }, status: HTTP_STATUS.OK };
}

export async function removeProjectMember(ctx: Context, userSession: ContextUserData, targetMemberId: string, teamId: string) {
    const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: {
            id: true,
            members: {
                select: {
                    id: true,
                    accepted: true,
                    isOwner: true,
                    userId: true,
                    permissions: true,
                    organisationPermissions: true,
                },
            },
            project: {
                select: {
                    id: true,
                    organisation: {
                        select: {
                            ...teamPermsSelectObj({ userId: userSession.id }),
                        },
                    },
                },
            },
            organisation: {
                select: {
                    id: true,
                },
            },
        },
    });
    if (!team?.id) return notFoundResponseData();

    const currMember = getCurrMember(userSession.id, team.members || [], team.project?.organisation?.team.members || []);
    let canRemoveMembers = false;
    if (team.organisation?.id) {
        canRemoveMembers = doesOrgMemberHaveAccess(
            OrganisationPermission.REMOVE_MEMBER,
            currMember?.organisationPermissions as OrganisationPermission[],
            currMember?.isOwner,
            userSession.role,
        );
    } else {
        canRemoveMembers = doesMemberHaveAccess(
            ProjectPermission.REMOVE_MEMBER,
            currMember?.permissions as ProjectPermission[],
            currMember?.isOwner,
            userSession.role,
        );
    }
    if (!canRemoveMembers) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to remove members");
    }

    const targetMember = team.members.find((member) => member.id === targetMemberId);
    if (!targetMember) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData("Member not found");
    }
    if (targetMember.isOwner === true) return invalidReqestResponseData("You can't remove the owner of the team");

    // Remove the member from the team
    await prisma.teamMember.delete({
        where: {
            id: targetMember.id,
        },
    });

    // If this is an organization team, remove the member from all the projects of the organization
    // For more info, check the comment in the leaveProjectTeam function
    if (team.organisation?.id && targetMember.accepted === true) {
        await removeMemberFromAllOrgProjects(team.organisation.id, targetMember.userId);
    }

    return { data: { success: true }, status: HTTP_STATUS.OK };
}

export async function changeTeamOwner(ctx: Context, userSession: ContextUserData, teamId: string, targetUserId: string) {
    const team = await prisma.team.findUnique({
        where: {
            id: teamId,
        },
        select: {
            id: true,
            members: true,
        },
    });
    if (!team) return notFoundResponseData();

    const targetMember = team.members.find((member) => member.userId === targetUserId);
    if (!targetMember || !targetMember.accepted) return notFoundResponseData("Member not found");

    const currOwner = team.members.find((member) => member.isOwner);
    if (!currOwner) return invalidReqestResponseData("For some unknown reason the owner of the team was not found");

    const currMember = team.members.find((member) => member.userId === userSession.id);
    if (!hasRootAccess(currMember?.isOwner, userSession.role)) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to change the team owner");
    }

    if (currOwner?.id === targetMember.id) return invalidReqestResponseData("The target member is already the owner of the team");

    await Promise.all([
        // Give ownership to the target member
        await prisma.teamMember.update({
            where: {
                id: targetMember.id,
            },
            data: {
                isOwner: true,
                role: "Owner",
                permissions: [],
                organisationPermissions: [],
            },
        }),

        // Remove ownership from the current owner
        await prisma.teamMember.update({
            where: {
                id: currOwner.id,
            },
            data: {
                isOwner: false,
                role: "Member",
                permissions: [],
                organisationPermissions: [],
            },
        }),
    ]);

    return { data: { success: true, message: "Team owner changed" }, status: HTTP_STATUS.OK };
}

async function removeMemberFromAllOrgProjects(orgId: string, userId: string) {
    const orgProjects = await prisma.project.findMany({
        where: {
            organisationId: orgId,
            team: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
        },
        select: {
            team: {
                select: {
                    id: true,
                },
            },
        },
    });

    const teamIds = orgProjects.map((project) => project.team.id);

    await prisma.teamMember.deleteMany({
        where: {
            teamId: {
                in: teamIds,
            },
            userId: userId,
        },
    });
}
