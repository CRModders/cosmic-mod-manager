import type { ContextUserSession } from "@/../types";
import { addToUsedRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { isProjectAccessibleToCurrSession } from "@/utils";
import httpCode, { defaultInvalidReqResponse } from "@/utils/http";
import { STRING_ID_LENGTH } from "@shared/config";
import { ProjectTeamOwnerPermissionsList } from "@shared/config/project";
import { CHARGE_FOR_SENDING_INVALID_DATA } from "@shared/config/rate-limit-charges";
import { createURLSafeSlug } from "@shared/lib/utils";
import type { newProjectFormSchema } from "@shared/schemas/project";
import {
    type OrganisationPermissions,
    ProjectClientSideEnv,
    type ProjectPermissions,
    ProjectPublishingStatus,
    ProjectServerSideEnv,
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
    if (formData.slug !== createURLSafeSlug(formData.slug).value) {
        await addToUsedRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
        return defaultInvalidReqResponse(ctx, "urlSlug must be a URL safe string");
    }

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
            clientSide: ProjectClientSideEnv.UNKNOWN,
            serverSide: ProjectServerSideEnv.UNKNOWN,
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
            icon: project.icon,
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
                clientSide: project.clientSide as ProjectClientSideEnv,
                serverSide: project.serverSide as ProjectServerSideEnv,
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
