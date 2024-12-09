import { addInvalidAuthAttempt } from "@/middleware/rate-limit/invalid-auth-attempt";
import prisma from "@/services/prisma";
import { deleteOrgDirectory, deleteOrgFile, saveOrgFile } from "@/services/storage";
import { type ContextUserData, FILE_STORAGE_SERVICE } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import {
    HTTP_STATUS,
    invalidReqestResponseData,
    notFoundResponseData,
    serverErrorResponseData,
    unauthorizedReqResponseData,
} from "@/utils/http";
import { resizeImageToWebp } from "@/utils/images";
import { generateDbId } from "@/utils/str";
import { ICON_WIDTH } from "@shared/config/forms";
import { doesOrgMemberHaveAccess, getCurrMember } from "@shared/lib/utils";
import { getFileType } from "@shared/lib/utils/convertors";
import type { orgSettingsFormSchema } from "@shared/schemas/organisation/settings/general";
import { OrganisationPermission } from "@shared/types";
import type { Context } from "hono";
import type { z } from "zod";
import { orgMemberPermsSelect } from "../queries";

export async function updateOrg(
    ctx: Context,
    userSession: ContextUserData,
    orgId: string,
    formData: z.infer<typeof orgSettingsFormSchema>,
): Promise<RouteHandlerResponse> {
    const org = await prisma.organisation.findFirst({
        where: {
            OR: [{ id: orgId }, { slug: orgId }],
        },
        select: {
            id: true,
            iconFileId: true,
            slug: true,
            ...orgMemberPermsSelect({ userId: userSession.id, accepted: true }),
        },
    });
    if (!org) return notFoundResponseData();

    // Permission check
    const currMember = org.team.members?.[0];
    const canEditOrg = doesOrgMemberHaveAccess(
        OrganisationPermission.EDIT_DETAILS,
        currMember?.organisationPermissions as OrganisationPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canEditOrg) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData();
    }

    // Check slug validity if it's being updated
    if (formData.slug !== org.slug) {
        const existingOrg = await prisma.organisation.findUnique({
            where: {
                slug: formData.slug,
            },
        });

        if (existingOrg?.id) return invalidReqestResponseData(`The slug "${formData.slug}" is already taken`);
    }

    let icon = org.iconFileId;
    if (!formData.icon && org.iconFileId) {
        const deletedDbFile = await prisma.file.delete({ where: { id: org.iconFileId } });
        await deleteOrgFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, org.id, deletedDbFile.name);
        icon = null;
    }

    // Update the org icon
    if (formData.icon instanceof File) {
        // @ts-ignore
        icon = (await updateOrgIcon(ctx, userSession, orgId, formData.icon, true)).data?.newIcon || null;
    }

    const updatedOrg = await prisma.organisation.update({
        where: {
            id: org.id,
        },
        data: {
            iconFileId: icon,
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
        },
    });

    return { data: { success: true, message: "Organization updated", slug: updatedOrg.slug }, status: HTTP_STATUS.OK };
}

export async function updateOrgIcon(
    ctx: Context,
    userSession: ContextUserData,
    orgId: string,
    icon: File,
    dontUpdateOrg = false,
): Promise<RouteHandlerResponse> {
    const org = await prisma.organisation.findFirst({
        where: {
            OR: [{ id: orgId }, { slug: orgId }],
        },
        select: {
            id: true,
            slug: true,
            iconFileId: true,
            ...orgMemberPermsSelect({ userId: userSession.id, accepted: true }),
        },
    });
    if (!org) return notFoundResponseData("Organization not found");

    const currMember = org.team.members?.[0];
    const canUpdateIcon = doesOrgMemberHaveAccess(
        OrganisationPermission.EDIT_DETAILS,
        currMember?.organisationPermissions as OrganisationPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canUpdateIcon) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have the permission to update organization icon");
    }

    // Delete the previous icon if it exists
    if (org.iconFileId) {
        const deletedDbFile = await prisma.file.delete({ where: { id: org.iconFileId } });
        await deleteOrgFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, org.id, deletedDbFile.name);
    }

    const fileType = await getFileType(icon);
    if (!fileType) return invalidReqestResponseData("Invalid file type");

    const [saveIcon, saveIconFileType] = await resizeImageToWebp(icon, fileType, {
        width: ICON_WIDTH,
        height: ICON_WIDTH,
        fit: "cover",
    });

    const fileId = `${generateDbId()}_${ICON_WIDTH}.${saveIconFileType}`;
    const iconSaveUrl = await saveOrgFile(FILE_STORAGE_SERVICE.LOCAL, org.id, saveIcon, fileId);
    if (!iconSaveUrl) return { data: { success: false, message: "Failed to save the icon" }, status: HTTP_STATUS.SERVER_ERROR };

    await prisma.file.create({
        data: {
            id: fileId,
            name: fileId,
            size: icon.size,
            type: fileType,
            url: iconSaveUrl,
            storageService: FILE_STORAGE_SERVICE.LOCAL,
        },
    });

    if (dontUpdateOrg === false) {
        await prisma.organisation.update({
            where: {
                id: org.id,
            },
            data: {
                iconFileId: fileId,
            },
        });
    }

    return { data: { success: true, message: "Organization icon updated", newIcon: fileId }, status: HTTP_STATUS.OK };
}

export async function deleteOrgIcon(ctx: Context, userSession: ContextUserData, orgId: string): Promise<RouteHandlerResponse> {
    const org = await prisma.organisation.findFirst({
        where: {
            OR: [{ id: orgId }, { slug: orgId }],
        },
        select: {
            id: true,
            slug: true,
            iconFileId: true,
            ...orgMemberPermsSelect({ userId: userSession.id, accepted: true }),
        },
    });
    if (!org) return notFoundResponseData("Organization not found");
    if (!org.iconFileId) return invalidReqestResponseData("Org does not have any icon");

    const currMember = org.team.members?.[0];
    const canDeleteIcon = doesOrgMemberHaveAccess(
        OrganisationPermission.EDIT_DETAILS,
        currMember?.organisationPermissions as OrganisationPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canDeleteIcon) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have the permission to delete organization icon");
    }

    const deletedDbFile = await prisma.file.delete({ where: { id: org.iconFileId } });
    await deleteOrgFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, org.id, deletedDbFile.name);

    await prisma.organisation.update({
        where: {
            id: org.id,
        },
        data: {
            iconFileId: null,
        },
    });

    return { data: { success: true, message: "Organization icon deleted" }, status: HTTP_STATUS.OK };
}

export async function deleteOrg(ctx: Context, userSession: ContextUserData, orgId: string): Promise<RouteHandlerResponse> {
    const org = await prisma.organisation.findFirst({
        where: {
            OR: [{ id: orgId }, { slug: orgId }],
        },
        select: {
            id: true,
            iconFileId: true,
            projects: {
                select: {
                    id: true,
                    teamId: true,
                },
            },
            ...orgMemberPermsSelect({ accepted: true }),
        },
    });
    if (!org) {
        return notFoundResponseData();
    }

    // Check if the member has the required permission to delete the org
    const currMember = org.team.members?.find((member) => member.userId === userSession.id);
    const canDeleteOrg = doesOrgMemberHaveAccess(
        OrganisationPermission.DELETE_ORGANIZATION,
        currMember?.organisationPermissions as OrganisationPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canDeleteOrg) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData();
    }
    const orgOwner = org.team.members.find((member) => member.isOwner);
    if (!orgOwner) {
        return serverErrorResponseData();
    }

    // Delete icon
    if (org.iconFileId) {
        await prisma.file.delete({ where: { id: org.iconFileId } });
    }

    // Delete storate directory
    await deleteOrgDirectory(FILE_STORAGE_SERVICE.LOCAL, org.id);

    const orgProjectIds = org.projects.map((project) => project.id);
    const projectTeamIds = org.projects.map((project) => project.teamId);

    await prisma.$transaction([
        // Remove the organisation from all projects
        prisma.project.updateMany({
            where: {
                id: {
                    in: orgProjectIds,
                },
            },
            data: {
                organisationId: null,
            },
        }),

        // Reset the team members from all projects
        prisma.teamMember.deleteMany({
            where: {
                teamId: {
                    in: projectTeamIds,
                },
            },
        }),

        // Make the org owner the owner of all projects
        prisma.teamMember.createMany({
            data: projectTeamIds.map((teamId) => ({
                id: generateDbId(),
                teamId: teamId,
                userId: orgOwner.userId,
                role: "Inherited Owner",
                isOwner: true,
                permissions: [],
                organisationPermissions: [],
                accepted: true,
                dateAccepted: new Date(),
            })),
        }),

        // Delete the org
        prisma.organisation.delete({
            where: {
                id: org.id,
            },
        }),
    ]);

    return { data: { success: true, message: "Organization deleted" }, status: HTTP_STATUS.OK };
}

export async function addProjectToOrganisation(userSession: ContextUserData, orgId: string, projectId: string) {
    const org = await prisma.organisation.findUnique({
        where: {
            id: orgId,
        },
        select: {
            id: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id, accepted: true },
                        select: { id: true, userId: true, isOwner: true, organisationPermissions: true },
                    },
                },
            },
        },
    });
    if (!org) return notFoundResponseData("Organization not found");

    const currMember = getCurrMember(userSession.id, [], org.team.members);
    const canAddProjects = doesOrgMemberHaveAccess(
        OrganisationPermission.ADD_PROJECT,
        currMember?.organisationPermissions as OrganisationPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canAddProjects) return unauthorizedReqResponseData("You don't have the permission to add projects to the organization");

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            id: true,
            teamId: true,
            organisationId: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id, isOwner: true },
                        select: { id: true, userId: true, isOwner: true },
                    },
                },
            },
        },
    });
    if (!project) return notFoundResponseData("Project not found");
    if (project.organisationId) return invalidReqestResponseData("Project is already part of an organization");

    const projectOwner = project.team.members?.[0];
    if (projectOwner?.userId !== userSession.id) return unauthorizedReqResponseData("You are not the owner of the project");

    await Promise.all([
        // Delete the team members from the project's current team
        prisma.teamMember.deleteMany({
            where: {
                teamId: project.teamId,
            },
        }),

        // Update the project
        prisma.project.update({
            where: {
                id: project.id,
            },
            data: {
                organisationId: org.id,
            },
        }),
    ]);

    return { data: { success: true, message: "Project added to organization" }, status: HTTP_STATUS.OK };
}

export async function removeProjectFromOrg(ctx: Context, userSession: ContextUserData, orgId: string, projectId: string) {
    const org = await prisma.organisation.findUnique({
        where: {
            id: orgId,
        },
        select: {
            id: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id, accepted: true },
                        select: { id: true, userId: true, isOwner: true, organisationPermissions: true },
                    },
                },
            },
        },
    });
    if (!org) return notFoundResponseData("Organization not found");

    const currMember = getCurrMember(userSession.id, [], org.team.members);
    const canRemoveProjects = doesOrgMemberHaveAccess(
        OrganisationPermission.REMOVE_PROJECT,
        currMember?.organisationPermissions as OrganisationPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canRemoveProjects) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have the permission to remove projects from the organization");
    }

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            id: true,
            teamId: true,
            organisationId: true,
        },
    });
    if (!project) return notFoundResponseData("Project not found");

    await Promise.all([
        prisma.teamMember.deleteMany({
            where: {
                teamId: project.teamId,
            },
        }),

        prisma.teamMember.create({
            data: {
                id: generateDbId(),
                teamId: project.teamId,
                userId: userSession.id,
                role: "Inherited Owner",
                isOwner: true,
                permissions: [],
                organisationPermissions: [],
                accepted: true,
                dateAccepted: new Date(),
            },
        }),

        prisma.project.update({
            where: {
                id: project.id,
            },
            data: {
                organisationId: null,
            },
        }),
    ]);

    return { data: { success: true, message: "Project removed from organization" }, status: HTTP_STATUS.OK };
}
