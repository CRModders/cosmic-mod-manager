import { type ContextUserSession, FILE_STORAGE_SERVICES } from "@/../types";
import prisma from "@/services/prisma";
import { deleteProjectFile, saveProjectFile, saveProjectGalleryFile } from "@/services/storage";
import { isProjectAccessibleToCurrSession } from "@/utils";
import httpCode, { defaultInvalidReqResponse } from "@/utils/http";
import { STRING_ID_LENGTH } from "@shared/config";
import { ProjectTeamOwnerPermissionsList } from "@shared/config/project";
import { getFileType } from "@shared/lib/utils/convertors";
import type { addNewGalleryImageFromSchema, generalProjectSettingsFormSchema, newProjectFormSchema, updateDescriptionFormSchema } from "@shared/schemas/project";
import {
    type OrganisationPermissions,
    ProjectPermissions,
    ProjectPublishingStatus,
    ProjectSupport,
    type ProjectVisibility,
} from "@shared/types";
import type { ProjectDetailsData, ProjectsListData, TeamMember } from "@shared/types/api";
import type { Context } from "hono";
import { nanoid } from "nanoid";
import type { z } from "zod";

export const requiredProjectMemberFields = {
    id: true,
    role: true,
    isOwner: true,
    permissions: true,
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
    role: string;
    isOwner: boolean;
    permissions: string[];
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
    userName: dbMember.user.userName,
    avatarUrl: dbMember.user.avatarUrl,
    role: dbMember.role,
    isOwner: dbMember.isOwner,
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
            permissions: ProjectTeamOwnerPermissionsList,
            organisationPermissions: [],
            accepted: true,
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
            type: ["project"],
            clientSide: ProjectSupport.UNKNOWN,
            serverSide: ProjectSupport.UNKNOWN,
        },
    });

    return ctx.json(
        { success: true, message: "Successfully created new project", urlSlug: newProject.slug, type: newProject.type },
        httpCode("ok"),
    );
};

export const getAllUserProjects = async (ctx: Context, userId: string, userSession: ContextUserSession | undefined) => {
    const data = await prisma.teamMember.findMany({
        where: {
            userId: userId,
        },
        select: {
            team: {
                select: {
                    project: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            status: true,
                            icon: true,
                            type: true,
                            visibility: true,
                            organisation: {
                                select: {
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
                    },
                    members: {
                        select: requiredProjectMemberFields,
                    },
                },
            },
        },
    });

    const projectsList: ProjectsListData[] = [];

    const projectMembersList: TeamMember[] = [];
    for (const { team } of data) {
        for (const member of team.members) {
            projectMembersList.push(getFormattedTeamMember(member));
        }
        for (const member of team.project?.organisation?.team.members || []) {
            projectMembersList.push(getFormattedTeamMember(member));
        }
    }

    for (const {
        team: { project },
    } of data) {
        if (!project?.id || !isProjectAccessibleToCurrSession(project.visibility, project.status, userSession?.id, projectMembersList))
            continue;

        projectsList.push({
            id: project.id,
            name: project.name,
            slug: project.slug,
            status: project.status as ProjectPublishingStatus,
            icon: project.icon || "",
            type: project.type,
        });
    }

    return ctx.json({ success: true, projects: projectsList }, httpCode("ok"));
};

export const getProjectData = async (ctx: Context, slug: string, userSession: ContextUserSession | undefined) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
        select: {
            id: true,
            name: true,
            // org_id: true,
            status: true,
            summary: true,
            description: true,
            type: true,
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

            icon: true,
            issueTrackerUrl: true,
            projectSourceUrl: true,
            projectWikiUrl: true,
            discordInviteUrl: true,

            clientSide: true,
            serverSide: true,
            loaders: true,
            gameVersions: true,

            team: {
                select: {
                    members: {
                        select: requiredProjectMemberFields,
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
        ...(project.organisation?.team.members || []).map((member) => getFormattedTeamMember(member)),
    ];
    if (!isProjectAccessibleToCurrSession(project.visibility, project.status, userSession?.id, projectMembersList)) {
        return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));
    }

    const organisation = project.organisation;
    return ctx.json(
        {
            success: true,
            project: {
                id: project.id,
                name: project.name,
                icon: project.icon || "",
                status: project.status as ProjectPublishingStatus,
                summary: project.summary,
                description: project.description,
                type: project.type,
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
                gameVersions: project.gameVersions,
                members: project.team.members.map((member) => ({
                    id: member.id,
                    userId: member.user.id,
                    userName: member.user.userName,
                    avatarUrl: member.user.avatarUrl,
                    role: member.role,
                    isOwner: member.isOwner,
                    permissions: member.permissions as ProjectPermissions[],
                    organisationPermissions: member.organisationPermissions as OrganisationPermissions[],
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

export const updateProject = async (ctx: Context, slug: string, userSession: ContextUserSession, formData: z.infer<typeof generalProjectSettingsFormSchema>) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            permissions: true
                        }
                    }
                }
            },
            organisation: {
                select: {
                    team: {
                        select: {
                            members: {
                                where: {
                                    userId: userSession.id
                                },
                                select: {
                                    permissions: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!project?.id) return ctx.json({ success: false }, httpCode("not_found"));

    if (
        !project.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS) &&
        !project.organisation?.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS)
    ) {
        return ctx.json({ success: false }, httpCode("not_found"));
    }

    // Check if the slug is available
    if (formData.slug !== project.slug) {
        const existingProjectWithSameSlug = await prisma.project.findUnique({
            where: {
                slug: formData.slug
            }
        });

        if (existingProjectWithSameSlug?.id) return ctx.json({ success: false, message: `The slug "${formData.slug}" is already taken` });
    }

    let projectIcon = project.icon;
    // Check if the icon was updated
    if (formData.icon !== projectIcon && projectIcon) {
        try {
            await deleteProjectFile(project.id, projectIcon, FILE_STORAGE_SERVICES.LOCAL);
        } catch (error) { }
    }

    if (formData.icon instanceof File) {
        const fileName = `${FILE_STORAGE_SERVICES.LOCAL}_${nanoid(STRING_ID_LENGTH)}.${getFileType(formData.icon.type)}`;
        await saveProjectFile(project.id, fileName, FILE_STORAGE_SERVICES.LOCAL, formData.icon);
        projectIcon = fileName;
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
            icon: projectIcon,
            visibility: formData.visibility,
            clientSide: formData.clientSide,
            serverSide: formData.serverSide,
            summary: formData.summary
        }
    });

    return ctx.json({ success: true, message: "Project details updated", data: updatedProject }, httpCode("ok"))
}

export const updateProjectDescription = async (ctx: Context, slug: string, userSession: ContextUserSession, data: z.infer<typeof updateDescriptionFormSchema>) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            permissions: true
                        }
                    }
                }
            },
            organisation: {
                select: {
                    team: {
                        select: {
                            members: {
                                where: {
                                    userId: userSession.id
                                },
                                select: {
                                    permissions: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!project?.id) return ctx.json({ success: false }, httpCode("not_found"));

    if (
        !project.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DESCRIPTION) &&
        !project.organisation?.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DESCRIPTION)
    ) {
        return ctx.json({ success: false }, httpCode("not_found"));
    };

    await prisma.project.update({
        where: { id: project.id },
        data: {
            description: data.description || ""
        }
    });

    return ctx.json({ success: true, message: "Project description updated" }, httpCode("ok"));
};

export const addNewGalleryImage = async (ctx: Context, slug: string, userSession: ContextUserSession, formData: z.infer<typeof addNewGalleryImageFromSchema>) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: {
                            permissions: true
                        }
                    }
                }
            },
            organisation: {
                select: {
                    team: {
                        select: {
                            members: {
                                where: {
                                    userId: userSession.id
                                },
                                select: {
                                    permissions: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!project?.id) return ctx.json({ success: false }, httpCode("not_found"));

    if (
        !project.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS) &&
        !project.organisation?.team.members?.[0]?.permissions.includes(ProjectPermissions.EDIT_DETAILS)
    ) {
        return ctx.json({ success: false }, httpCode("not_found"));
    };

    // Check if there's already a featured image
    if (formData.featured === true) {
        const existingFeaturedImage = await prisma.galleryItem.findFirst({
            where: {
                projectId: project.id,
                featured: true
            }
        });

        if (existingFeaturedImage?.id) return ctx.json({ success: false, message: "A featured gallery image already exists" }, httpCode("bad_request"));
    }

    const fileName = `${FILE_STORAGE_SERVICES.LOCAL}-${nanoid(STRING_ID_LENGTH)}.${getFileType(formData.image.type)}`;
    await saveProjectGalleryFile(project.id, fileName, FILE_STORAGE_SERVICES.LOCAL, formData.image);

    await prisma.galleryItem.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            projectId: project.id,
            name: formData.title,
            description: formData.description || "",
            featured: formData.featured,
            image: fileName
        }
    });

    return ctx.json({ success: true, message: "Added the new gallery image" }, httpCode("ok"));
};