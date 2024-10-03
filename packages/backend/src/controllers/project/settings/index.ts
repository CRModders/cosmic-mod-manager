import { type ContextUserSession, FILE_STORAGE_SERVICE } from "@/../types";
import prisma from "@/services/prisma";
import { deleteDirectory, deleteProjectFile, saveProjectFile } from "@/services/storage";
import { projectFileStoragePath } from "@/services/storage/utils";
import { generateRandomString } from "@/utils";
import httpCode from "@/utils/http";
import { STRING_ID_LENGTH } from "@shared/config";
import SPDX_LICENSE_LIST, { type SPDX_LICENSE } from "@shared/config/license-list";
import { doesMemberHaveAccess, getValidProjectCategories } from "@shared/lib/utils";
import { getFileType } from "@shared/lib/utils/convertors";
import type { updateProjectTagsFormSchema } from "@shared/schemas/project/settings/categories";
import type { updateDescriptionFormSchema } from "@shared/schemas/project/settings/description";
import type { generalProjectSettingsFormSchema } from "@shared/schemas/project/settings/general";
import type { updateProjectLicenseFormSchema } from "@shared/schemas/project/settings/license";
import type { updateExternalLinksFormSchema } from "@shared/schemas/project/settings/links";

import { ProjectPermission } from "@shared/types";
import type { Context } from "hono";
import { nanoid } from "nanoid";
import type { z } from "zod";

export const updateProject = async (
    ctx: Context,
    slug: string,
    userSession: ContextUserSession,
    formData: z.infer<typeof generalProjectSettingsFormSchema>,
) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            name: true,
            slug: true,
            iconFileId: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            isOwner: true,
                            permissions: true,
                        },
                    },
                },
            },
        },
    });
    const currMember = project?.team.members?.[0];
    if (!project?.id || !currMember) return ctx.json({ success: false }, httpCode("not_found"));

    if (!doesMemberHaveAccess(ProjectPermission.EDIT_DETAILS, currMember.permissions as ProjectPermission[], currMember.isOwner)) {
        return ctx.json({ success: false, message: "You don't have the permission to update project details" }, httpCode("unauthorized"));
    }

    // If the project slug has been updated
    if (formData.slug !== project.slug) {
        // Check if the slug is available
        const existingProjectWithSameSlug = await prisma.project.findUnique({
            where: {
                slug: formData.slug,
            },
        });

        if (existingProjectWithSameSlug?.id) return ctx.json({ success: false, message: `The slug "${formData.slug}" is already taken` });
    }

    let projectIcon = project.iconFileId;
    // Check if the icon was updated
    // if the icon is an instanceof File that means a its a new icon so delete the old one
    // if the icon is empty that means the icon is removed so delete the file also
    if ((formData.icon instanceof File || !formData.icon) && projectIcon) {
        try {
            const deletedDbFile = await prisma.file.delete({ where: { id: projectIcon } });
            await deleteProjectFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, project.id, deletedDbFile.name);
        } catch (error) {}
    }

    if (formData.icon instanceof File) {
        const fileExtension = await getFileType(formData.icon);
        const fileName = `${generateRandomString(16)}.${fileExtension}`;

        const newFile = await saveProjectFile(FILE_STORAGE_SERVICE.LOCAL, project.id, formData.icon, fileName);
        if (newFile) {
            const newDbFile = await prisma.file.create({
                data: {
                    id: nanoid(STRING_ID_LENGTH),
                    name: fileName,
                    size: formData.icon.size,
                    type: (await getFileType(formData.icon)) || "",
                    storageService: FILE_STORAGE_SERVICE.LOCAL,
                    url: newFile,
                },
            });

            projectIcon = newDbFile.id;
        } else {
            projectIcon = "";
        }
    } else if (!formData.icon) {
        projectIcon = "";
    }

    const updatedProject = await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            name: formData.name,
            slug: formData.slug,
            iconFileId: projectIcon,
            type: formData.type,
            visibility: formData.visibility,
            clientSide: formData.clientSide,
            serverSide: formData.serverSide,
            summary: formData.summary,
        },
    });

    return ctx.json({ success: true, message: "Project details updated", slug: updatedProject.slug }, httpCode("ok"));
};

export const updateProjectDescription = async (
    ctx: Context,
    slug: string,
    userSession: ContextUserSession,
    form: z.infer<typeof updateDescriptionFormSchema>,
) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            isOwner: true,
                            permissions: true,
                        },
                    },
                },
            },
        },
    });

    const memberObj = project?.team.members?.[0];
    if (!project?.id || !memberObj) return ctx.json({ success: false }, httpCode("not_found"));

    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DESCRIPTION,
        memberObj?.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!hasEditAccess) {
        return ctx.json(
            { success: false, message: "You don't have the permission to update project description" },
            httpCode("unauthorized"),
        );
    }

    await prisma.project.update({
        where: { id: project.id },
        data: {
            description: form.description || "",
        },
    });

    return ctx.json({ success: true, message: "Project description updated" }, httpCode("ok"));
};

export const updateProjectTags = async (
    ctx: Context,
    slug: string,
    userSession: ContextUserSession,
    formData: z.infer<typeof updateProjectTagsFormSchema>,
) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            loaders: true,
            type: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            isOwner: true,
                            permissions: true,
                        },
                    },
                },
            },
        },
    });
    const memberObj = project?.team.members?.[0];
    if (!project?.id || !memberObj) return ctx.json({ success: false }, httpCode("not_found"));

    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!hasEditAccess) {
        return ctx.json({ success: false, message: "You don't have the permission to update project tags" }, httpCode("unauthorized"));
    }

    const availableCategories = getValidProjectCategories(project.type).map((category) => category.name);
    const validatedTags = formData.categories.filter((tag) => availableCategories.includes(tag));
    const validatedFeaturedTags = formData.featuredCategories.filter((tag) => validatedTags.includes(tag));

    await prisma.project.update({
        where: { id: project.id },
        data: {
            categories: validatedTags,
            featuredCategories: validatedFeaturedTags,
        },
    });

    return ctx.json({ success: true, message: "Project tags updated" }, httpCode("ok"));
};

export const updateProjectExternalLinks = async (
    ctx: Context,
    userSession: ContextUserSession,
    slug: string,
    formData: z.infer<typeof updateExternalLinksFormSchema>,
) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            isOwner: true,
                            permissions: true,
                        },
                    },
                },
            },
        },
    });
    const memberObj = project?.team.members?.[0];
    if (!project?.id || !memberObj) return ctx.json({ success: false }, httpCode("not_found"));

    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!hasEditAccess) {
        return ctx.json({ success: false, message: "You don't the permission to update links" }, httpCode("unauthorized"));
    }

    await prisma.project.update({
        where: { id: project.id },
        data: {
            issueTrackerUrl: formData.issueTracker || "",
            projectSourceUrl: formData.sourceCode || "",
            projectWikiUrl: formData.wikiPage || "",
            discordInviteUrl: formData.discordServer || "",
        },
    });

    return ctx.json({ success: true, message: "External links updated" }, httpCode("ok"));
};

export const updateProjectLicense = async (
    ctx: Context,
    userSession: ContextUserSession,
    slug: string,
    formData: z.infer<typeof updateProjectLicenseFormSchema>,
) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            isOwner: true,
                            permissions: true,
                        },
                    },
                },
            },
        },
    });
    const memberObj = project?.team.members?.[0];
    if (!project?.id || !memberObj) return ctx.json({ success: false }, httpCode("not_found"));

    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!hasEditAccess) {
        return ctx.json({ success: false, message: "You don't have the permission to update project license" }, httpCode("unauthorized"));
    }

    if (!formData.name && !formData.id) {
        return ctx.json({ success: false, message: "Either license name of a valid ID is required" }, httpCode("bad_request"));
    }

    let validSpdxData: SPDX_LICENSE | null = null;
    for (const license of SPDX_LICENSE_LIST) {
        if (license.licenseId === formData.id) {
            validSpdxData = license;
            break;
        }
    }

    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            licenseName: validSpdxData?.name || formData.name,
            licenseId: formData.id,
            licenseUrl: !formData.name && !formData.id ? "" : formData.url,
        },
    });

    return ctx.json({ success: true, message: "Project license updated" }, httpCode("ok"));
};

export const deleteProject = async (ctx: Context, userSession: ContextUserSession, slug: string) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
        select: {
            id: true,
            iconFileId: true,
            team: {
                select: {
                    id: true,
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            isOwner: true,
                            permissions: true,
                        },
                    },
                },
            },
            gallery: true,
        },
    });
    const memberObj = project?.team.members?.[0];
    if (!project?.id || !memberObj) return ctx.json({ success: false }, httpCode("not_found"));

    // Check if the user has the permission to delete the project
    const hasDeleteAccess = doesMemberHaveAccess(
        ProjectPermission.DELETE_PROJECT,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!hasDeleteAccess) {
        return ctx.json({ success: false, message: "You don't have the permission to delete the project" }, httpCode("unauthorized"));
    }

    // Get all the project versions
    const versions = await prisma.version.findMany({
        where: { projectId: project.id },
        include: {
            files: true,
        },
    });
    const versionIds = versions.map((version) => version.id);
    const dbFileIds = versions.flatMap((version) => version.files.map((file) => file.fileId));

    // Delete all the dbFiles
    await prisma.file.deleteMany({
        where: {
            id: {
                in: dbFileIds,
            },
        },
    });

    // ? No need to manually delete the versionFile tables as the version deletion will automatically delete the versionFile tables
    // ? Same for version dependencies

    // Delete all the project versions
    await prisma.version.deleteMany({
        where: {
            id: {
                in: versionIds,
            },
        },
    });

    // Delete the project gallery
    const galleryFileIds = project.gallery.map((file) => file.imageFileId);

    // Delete all the image files
    if (galleryFileIds.length > 0) {
        await prisma.file.deleteMany({
            where: {
                id: {
                    in: galleryFileIds,
                },
            },
        });
    }

    // Delete project icon file
    if (project.iconFileId) {
        await prisma.file.delete({
            where: {
                id: project.iconFileId,
            },
        });
    }

    // Delete the project
    await prisma.project.delete({
        where: {
            id: project.id,
        },
    });

    // Delete the project associated team
    await prisma.team.delete({
        where: {
            id: project.team.id,
        },
    });
    // ? All the teamMember tables will be automatically deleted

    // Delete the project's storage folder
    await deleteDirectory(FILE_STORAGE_SERVICE.LOCAL, projectFileStoragePath(project.id));

    return ctx.json(
        {
            success: true,
            message: "Project deleted",
        },
        httpCode("ok"),
    );
};

export const updateProjectIcon = async (ctx: Context, userSession: ContextUserSession, slug: string, icon: File) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
        select: {
            id: true,
            iconFileId: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            isOwner: true,
                            permissions: true,
                        },
                    },
                },
            },
        },
    });
    const memberObj = project?.team.members?.[0];
    if (!project || !memberObj) return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));

    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!hasEditAccess) {
        return ctx.json({ success: false, message: "You don't have the permission to update project icon" }, httpCode("unauthorized"));
    }

    // Delete the previous icon if it exists
    if (project.iconFileId) {
        const deletedDbFile = await prisma.file.delete({ where: { id: project.iconFileId } });
        await deleteProjectFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, project.id, deletedDbFile.name);
    }

    const fileType = await getFileType(icon);
    if (!fileType) return ctx.json({ success: false, message: "Invalid file type" }, httpCode("bad_request"));

    const fileName = `${generateRandomString(16)}.${fileType}`;
    const newFileUrl = await saveProjectFile(FILE_STORAGE_SERVICE.LOCAL, project.id, icon, fileName);

    if (!newFileUrl) return ctx.json({ success: false, message: "Failed to save the icon" }, httpCode("server_error"));
    const newDbFile = await prisma.file.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            name: fileName,
            size: icon.size,
            type: fileType,
            url: newFileUrl,
            storageService: FILE_STORAGE_SERVICE.LOCAL,
        },
    });

    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            iconFileId: newDbFile.id,
        },
    });

    return ctx.json({ success: true, message: "Project icon updated" }, httpCode("ok"));
};

export const deleteProjectIcon = async (ctx: Context, userSession: ContextUserSession, slug: string) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
        select: {
            id: true,
            iconFileId: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            isOwner: true,
                            permissions: true,
                        },
                    },
                },
            },
        },
    });
    const memberObj = project?.team.members?.[0];
    if (!project || !memberObj) return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));

    if (!project.iconFileId) return ctx.json({ success: false, message: "Project does not have any icon" }, httpCode("bad_request"));

    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!hasEditAccess) {
        return ctx.json({ success: false, message: "You don't have the permission to delete project icon" }, httpCode("unauthorized"));
    }

    const deletedDbFile = await prisma.file.delete({ where: { id: project.iconFileId } });
    await deleteProjectFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, project.id, deletedDbFile.name);

    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            iconFileId: null,
        },
    });

    return ctx.json({ success: true, message: "Project icon deleted" }, httpCode("ok"));
};
