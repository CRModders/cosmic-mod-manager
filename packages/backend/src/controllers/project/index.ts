import { type ContextUserSession, FILE_STORAGE_SERVICES } from "@/../types";
import prisma from "@/services/prisma";
import { createFilePathSafeString, saveProjectGalleryFile } from "@/services/storage";
import { inferProjectType, isProjectAccessibleToCurrSession } from "@/utils";
import httpCode, { defaultInvalidReqResponse } from "@/utils/http";
import { projectGalleryFileUrl, projectIconUrl } from "@/utils/urls";
import { STRING_ID_LENGTH } from "@shared/config";
import { ProjectPermissionsList } from "@shared/config/project";
import { getFileType } from "@shared/lib/utils/convertors";
import type { addNewGalleryImageFormSchema, newProjectFormSchema, updateGalleryImageFormSchema } from "@shared/schemas/project";
import {
    type OrganisationPermissions,
    ProjectPermissions,
    ProjectPublishingStatus,
    ProjectSupport,
    type ProjectVisibility,
} from "@shared/types";
import type { ProjectDetailsData } from "@shared/types/api";
import type { Context } from "hono";
import { nanoid } from "nanoid";
import { rsort } from "semver";
import type { z } from "zod";
import { getFilesFromId } from "./utils";

export const requiredProjectMemberFields = {
    id: true,
    teamId: true,
    role: true,
    isOwner: true,
    permissions: true,
    accepted: true,
    organisationPermissions: true,
    user: {
        select: {
            id: true,
            userName: true,
            avatarUrl: true,
        },
    },
};

export interface DBTeamMember {
    id: string;
    teamId: string;
    role: string;
    isOwner: boolean;
    permissions: string[];
    accepted: boolean;
    organisationPermissions: string[];
    user: {
        id: string;
        userName: string;
        avatarUrl: string | null;
    };
}

export const getFormattedTeamMember = (dbMember: DBTeamMember) => ({
    id: dbMember.id,
    userId: dbMember.user.id,
    teamId: dbMember.teamId,
    userName: dbMember.user.userName,
    avatarUrl: dbMember.user.avatarUrl,
    role: dbMember.role,
    isOwner: dbMember.isOwner,
    accepted: dbMember.accepted,
    permissions: dbMember.permissions as ProjectPermissions[],
    organisationPermissions: dbMember.organisationPermissions as OrganisationPermissions[],
});

export const createNewProject = async (ctx: Context, userSession: ContextUserSession, formData: z.infer<typeof newProjectFormSchema>) => {
    const existingProjectWithSameUrl = await prisma.project.findUnique({
        where: {
            slug: formData.slug,
        },
    });
    if (existingProjectWithSameUrl?.id) return defaultInvalidReqResponse(ctx, "Url slug already taken");

    const newTeam = await prisma.team.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
        },
    });

    await prisma.teamMember.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            teamId: newTeam.id,
            userId: userSession.id,
            role: "Owner",
            isOwner: true,
            permissions: ProjectPermissionsList,
            organisationPermissions: [],
            accepted: true,
            dateAccepted: new Date(),
        },
    });

    const newProject = await prisma.project.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            teamId: newTeam.id,
            name: formData.name,
            slug: formData.slug,
            summary: formData.summary,
            visibility: formData.visibility,
            status: ProjectPublishingStatus.DRAFT,
            clientSide: ProjectSupport.UNKNOWN,
            serverSide: ProjectSupport.UNKNOWN,
        },
    });

    return ctx.json(
        { success: true, message: "Successfully created new project", urlSlug: newProject.slug, type: inferProjectType([]) },
        httpCode("ok"),
    );
};

export const getProjectData = async (ctx: Context, slug: string, userSession: ContextUserSession | undefined) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
        select: {
            id: true,
            name: true,
            status: true,
            summary: true,
            description: true,
            categories: true,
            featuredCategories: true,
            licenseId: true,
            licenseName: true,
            licenseUrl: true,
            datePublished: true,
            dateUpdated: true,
            slug: true,
            visibility: true,
            downloads: true,
            followers: true,

            iconFileId: true,
            issueTrackerUrl: true,
            projectSourceUrl: true,
            projectWikiUrl: true,
            discordInviteUrl: true,

            clientSide: true,
            serverSide: true,
            loaders: true,
            gameVersions: true,

            gallery: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    featured: true,
                    imageFileId: true,
                    dateCreated: true,
                    orderIndex: true,
                },
                orderBy: { orderIndex: "desc" },
            },

            team: {
                select: {
                    id: true,
                    members: {
                        select: requiredProjectMemberFields,
                        orderBy: { dateAccepted: "desc" },
                    },
                },
            },
            organisation: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    icon: true,
                    team: {
                        select: {
                            members: {
                                select: requiredProjectMemberFields,
                            },
                        },
                    },
                },
            },
        },
    });

    if (!project?.id) {
        return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));
    }

    const projectMembersList = [
        ...project.team.members.map((member) => getFormattedTeamMember(member)),
        // ...(project.organisation?.team.members || []).map((member) => getFormattedTeamMember(member)),
    ];
    if (!isProjectAccessibleToCurrSession(project.visibility, project.status, userSession?.id, projectMembersList)) {
        return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));
    }
    const currSessionMember = projectMembersList.find((member) => member.userId === userSession?.id);

    const galleryFiles = await getFilesFromId(project.gallery.map((item) => item.imageFileId));

    const organisation = project.organisation;
    return ctx.json(
        {
            success: true,
            project: {
                id: project.id,
                teamId: project.team.id,
                orgId: project.organisation?.id || null,
                name: project.name,
                icon: projectIconUrl(project.slug, project.iconFileId || ""),
                status: project.status as ProjectPublishingStatus,
                summary: project.summary,
                description: project.description,
                type: inferProjectType(project.loaders),
                categories: project.categories,
                featuredCategories: project.featuredCategories,
                licenseId: project.licenseId,
                licenseName: project.licenseName,
                licenseUrl: project.licenseUrl,
                dateUpdated: project.dateUpdated,
                datePublished: project.datePublished,
                downloads: project.downloads,
                followers: project.followers,
                slug: project.slug,
                visibility: project.visibility as ProjectVisibility,
                issueTrackerUrl: project?.issueTrackerUrl,
                projectSourceUrl: project?.projectSourceUrl,
                projectWikiUrl: project?.projectWikiUrl,
                discordInviteUrl: project?.discordInviteUrl,
                clientSide: project.clientSide as ProjectSupport,
                serverSide: project.serverSide as ProjectSupport,
                loaders: project.loaders,
                gameVersions: rsort(project.gameVersions || []),
                gallery: project.gallery.map((galleryItem) => ({
                    id: galleryItem.id,
                    name: galleryItem.name,
                    description: galleryItem.description,
                    image: projectGalleryFileUrl(project.slug, galleryFiles.get(galleryItem.imageFileId)?.name || ""),
                    featured: galleryItem.featured,
                    dateCreated: galleryItem.dateCreated,
                    orderIndex: galleryItem.orderIndex,
                })),
                members: project.team.members.map((member) => ({
                    id: member.id,
                    userId: member.user.id,
                    teamId: member.teamId,
                    userName: member.user.userName,
                    avatarUrl: member.user.avatarUrl,
                    role: member.role,
                    isOwner: member.isOwner,
                    accepted: member.accepted,
                    permissions: currSessionMember?.id ? (member.permissions as ProjectPermissions[]) : [],
                    organisationPermissions: currSessionMember?.id ? (member.organisationPermissions as OrganisationPermissions[]) : [],
                })),
                organisation: organisation
                    ? {
                          id: organisation.id,
                          name: organisation.name,
                          slug: organisation.slug,
                          description: organisation.description,
                          icon: organisation.icon || "",
                          members: [],
                      }
                    : null,
            } satisfies ProjectDetailsData,
        },
        httpCode("ok"),
    );
};

export const addNewGalleryImage = async (
    ctx: Context,
    slug: string,
    userSession: ContextUserSession,
    formData: z.infer<typeof addNewGalleryImageFormSchema>,
) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            gallery: {
                select: {
                    id: true,
                    orderIndex: true,
                },
                orderBy: { orderIndex: "desc" },
            },
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            permissions: true,
                        },
                    },
                },
            },
        },
    });

    if (!project?.id) return ctx.json({ success: false }, httpCode("not_found"));

    // Check if the order index is not already occupied
    for (const item of project.gallery) {
        if (item.orderIndex === formData.orderIndex) {
            return ctx.json({ success: false, message: "An image with same order index already exists" }, httpCode("bad_request"));
        }
    }

    if (!project.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS)) {
        return ctx.json({ success: false }, httpCode("not_found"));
    }

    // Check if there's already a featured image
    if (formData.featured === true) {
        const existingFeaturedImage = await prisma.galleryItem.findFirst({
            where: {
                projectId: project.id,
                featured: true,
            },
        });

        if (existingFeaturedImage?.id) {
            return ctx.json({ success: false, message: "A featured gallery image already exists" }, httpCode("bad_request"));
        }
    }

    const fileName = createFilePathSafeString(formData.image.name);
    const fileUrl = await saveProjectGalleryFile(project.id, fileName, FILE_STORAGE_SERVICES.IMGBB, formData.image);

    // Create the generic file entry in the database
    const dbFile = await prisma.file.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            name: fileName,
            size: formData.image.size,
            type: getFileType(formData.image.type) || "",
            url: fileUrl?.path || "",
            storageService: FILE_STORAGE_SERVICES.IMGBB,
        },
    });

    // Create the gallery item
    await prisma.galleryItem.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            projectId: project.id,
            name: formData.title,
            description: formData.description || "",
            featured: formData.featured,
            imageFileId: dbFile.id,
            orderIndex: formData.orderIndex || project.gallery?.[0]?.orderIndex + 1 || 1,
        },
    });

    return ctx.json({ success: true, message: "Added the new gallery image" }, httpCode("ok"));
};

export const removeGalleryImage = async (ctx: Context, slug: string, userSession: ContextUserSession, galleryItemId: string) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            gallery: {
                where: { id: galleryItemId },
                select: {
                    id: true,
                    imageFileId: true,
                },
            },
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            permissions: true,
                        },
                    },
                },
            },
        },
    });

    if (!project?.id || !project.gallery?.[0]?.id) return ctx.json({ success: false }, httpCode("not_found"));

    if (!project.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS)) {
        return ctx.json({ success: false }, httpCode("not_found"));
    }

    // Delete gallery item from database
    await prisma.galleryItem.delete({
        where: { id: galleryItemId },
    });

    // Delete the file from database
    await prisma.file.delete({
        where: {
            id: project.gallery[0].imageFileId,
        },
    });

    return ctx.json({ success: true, message: "Gallery image deleted" }, httpCode("ok"));
};

export const updateGalleryImage = async (
    ctx: Context,
    slug: string,
    userSession: ContextUserSession,
    galleryItemId: string,
    formData: z.infer<typeof updateGalleryImageFormSchema>,
) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            gallery: {
                select: {
                    id: true,
                    orderIndex: true,
                },
                orderBy: { orderIndex: "desc" },
            },
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            permissions: true,
                        },
                    },
                },
            },
        },
    });

    if (!project?.id) return ctx.json({ success: false }, httpCode("not_found"));

    // Check if the order index is not already occupied
    let isGalleryItemIdValid = false;
    for (const item of project.gallery) {
        if (item.id === galleryItemId) isGalleryItemIdValid = true;
        if (item.id !== galleryItemId && item.orderIndex === formData.orderIndex) {
            return ctx.json({ success: false, message: "An image with same order index already exists" }, httpCode("bad_request"));
        }
    }

    if (!project.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS)) {
        return ctx.json({ success: false }, httpCode("not_found"));
    }

    // Check if there's already a featured image
    if (formData.featured === true) {
        const existingFeaturedImage = await prisma.galleryItem.findFirst({
            where: {
                projectId: project.id,
                featured: true,
                id: {
                    not: galleryItemId,
                },
            },
        });

        if (existingFeaturedImage?.id)
            return ctx.json({ success: false, message: "A featured gallery image already exists" }, httpCode("bad_request"));
    }

    try {
        await prisma.galleryItem.update({
            where: {
                id: galleryItemId,
                projectId: project.id,
            },
            data: {
                name: formData.title,
                description: formData.description || "",
                orderIndex: formData.orderIndex,
                featured: formData.featured,
            },
        });
    } catch (error) {
        return ctx.json({ success: false, message: "Something went wrong" }, httpCode("bad_request"));
    }

    return ctx.json({ success: true, message: "Image updated" }, httpCode("ok"));
};
