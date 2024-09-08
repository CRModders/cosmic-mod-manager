import { type ContextUserSession, FILE_STORAGE_SERVICES } from "@/../types";
import prisma from "@/services/prisma";
import { createFilePathSafeString, deleteProjectFile, saveProjectFile } from "@/services/storage";
import { inferProjectType } from "@/utils";
import httpCode from "@/utils/http";
import { STRING_ID_LENGTH } from "@shared/config";
import { getValidProjectCategories } from "@shared/lib/utils";
import { getFileType } from "@shared/lib/utils/convertors";
import type {
    generalProjectSettingsFormSchema,
    updateDescriptionFormSchema,
    updateExternalLinksFormSchema,
    updateProjectTagsFormSchema,
} from "@shared/schemas/project";
import { ProjectPermissions } from "@shared/types";
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
                            permissions: true,
                        },
                    },
                },
            },
            organisation: {
                select: {
                    team: {
                        select: {
                            members: {
                                where: {
                                    userId: userSession.id,
                                },
                                select: {
                                    permissions: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!project?.id) return ctx.json({ success: false }, httpCode("not_found"));

    if (
        !project.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS) &&
        !project.organisation?.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS)
    ) {
        return ctx.json({ success: false }, httpCode("not_found"));
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
            await deleteProjectFile(project.id, projectIcon, FILE_STORAGE_SERVICES.LOCAL);
            await prisma.file.delete({ where: { id: projectIcon } });
        } catch (error) {}
    }

    if (formData.icon instanceof File) {
        const fileName = createFilePathSafeString(formData.icon.name);

        const newFile = await saveProjectFile(project.id, fileName, FILE_STORAGE_SERVICES.IMGBB, formData.icon);
        if (newFile) {
            const newDbFile = await prisma.file.create({
                data: {
                    id: nanoid(STRING_ID_LENGTH),
                    name: fileName,
                    size: formData.icon.size,
                    type: getFileType(formData.icon.type) || "",
                    storageService: FILE_STORAGE_SERVICES.IMGBB,
                    url: newFile.path,
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
            visibility: formData.visibility,
            clientSide: formData.clientSide,
            serverSide: formData.serverSide,
            summary: formData.summary,
        },
    });

    return ctx.json({ success: true, message: "Project details updated", data: updatedProject }, httpCode("ok"));
};

export const updateProjectDescription = async (
    ctx: Context,
    slug: string,
    userSession: ContextUserSession,
    data: z.infer<typeof updateDescriptionFormSchema>,
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
                            permissions: true,
                        },
                    },
                },
            },
            organisation: {
                select: {
                    team: {
                        select: {
                            members: {
                                where: {
                                    userId: userSession.id,
                                },
                                select: {
                                    permissions: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!project?.id) return ctx.json({ success: false }, httpCode("not_found"));

    if (
        !project.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DESCRIPTION) &&
        !project.organisation?.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DESCRIPTION)
    ) {
        return ctx.json({ success: false }, httpCode("not_found"));
    }

    await prisma.project.update({
        where: { id: project.id },
        data: {
            description: data.description || "",
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
            organisation: {
                select: {
                    team: {
                        select: {
                            members: {
                                where: {
                                    userId: userSession.id,
                                },
                                select: {
                                    permissions: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!project?.id) return ctx.json({ success: false }, httpCode("not_found"));

    if (
        !project.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS) &&
        !project.organisation?.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS)
    ) {
        return ctx.json({ success: false }, httpCode("not_found"));
    }

    const projectType = inferProjectType(project.loaders);
    const availableCategories = getValidProjectCategories(projectType).map((category) => category.name);

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
                            permissions: true,
                        },
                    },
                },
            },
            organisation: {
                select: {
                    team: {
                        select: {
                            members: {
                                where: {
                                    userId: userSession.id,
                                },
                                select: {
                                    permissions: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!project?.id) return ctx.json({ success: false }, httpCode("not_found"));

    if (
        !project.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS) &&
        !project.organisation?.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS)
    ) {
        return ctx.json({ success: false }, httpCode("not_found"));
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
