import prisma from "@/services/prisma";
import redis from "@/services/redis";
import type { ContextUserData } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { isNumber } from "@/utils";
import { HTTP_STATUS } from "@/utils/http";
import { tryJsonParse } from "@/utils/str";
import { getAppropriateGalleryFileUrl, getAppropriateProjectIconUrl, projectIconUrl } from "@/utils/urls";
import type {
    OrganisationPermission,
    ProjectPermission,
    ProjectPublishingStatus,
    ProjectSupport,
    ProjectType,
    ProjectVisibility,
} from "@shared/types";
import type { ProjectDetailsData, ProjectListItem } from "@shared/types/api";
import { rsort } from "semver";
import { getFilesFromId } from "../queries/file";
import { formatTeamMemberData, projectDetailsFields } from "../queries/project";
import { isProjectAccessible } from "../utils";

export async function getProjectData(slug: string, userSession: ContextUserData | undefined): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
        select: projectDetailsFields(),
    });

    if (!project?.id) {
        return { data: { success: false, message: "Project not found" }, status: HTTP_STATUS.NOT_FOUND };
    }

    const projectMembersList = [
        ...project.team.members.map((member) => formatTeamMemberData(member)),
        ...(project.organisation?.team.members || []).map((member) => formatTeamMemberData(member)),
    ];

    const projectAccessible = isProjectAccessible({
        visibility: project.visibility,
        publishingStatus: project.status,
        userId: userSession?.id,
        teamMembers: projectMembersList,
        orgMembers: [],
    });
    if (!projectAccessible) {
        return { data: { success: false, message: "Project not found" }, status: HTTP_STATUS.NOT_FOUND };
    }
    const currSessionMember = projectMembersList.find((member) => member.userId === userSession?.id);

    const galleryFileIds = project.gallery.map((item) => item.imageFileId);
    const filesMap = await getFilesFromId(galleryFileIds.concat(project.iconFileId || ""));

    // const organisation = project.organisation;
    const projectIconFile = filesMap.get(project.iconFileId || "");
    const projectIconUrl = getAppropriateProjectIconUrl(projectIconFile, project.slug);
    return {
        data: {
            success: true,
            project: {
                id: project.id,
                teamId: project.team.id,
                orgId: null,
                name: project.name,
                icon: projectIconUrl,
                status: project.status as ProjectPublishingStatus,
                summary: project.summary,
                description: project.description,
                type: project.type as ProjectType[],
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
                gallery: project.gallery
                    .map((galleryItem) => {
                        const galleryFileUrl = getAppropriateGalleryFileUrl(filesMap.get(galleryItem.imageFileId), project.slug);
                        if (!galleryFileUrl) return null;

                        return {
                            id: galleryItem.id,
                            name: galleryItem.name,
                            description: galleryItem.description,
                            image: galleryFileUrl,
                            featured: galleryItem.featured,
                            dateCreated: galleryItem.dateCreated,
                            orderIndex: galleryItem.orderIndex,
                        };
                    })
                    .filter((item) => item !== null),
                members: project.team.members.map((member) => ({
                    id: member.id,
                    userId: member.user.id,
                    teamId: member.teamId,
                    userName: member.user.userName,
                    avatarUrl: member.user.avatarUrl,
                    role: member.role,
                    isOwner: member.isOwner,
                    accepted: member.accepted,
                    permissions: currSessionMember?.id ? (member.permissions as ProjectPermission[]) : [],
                    organisationPermissions: currSessionMember?.id ? (member.organisationPermissions as OrganisationPermission[]) : [],
                })),
                organisation: null,
                // organisation
                //     ? {
                //           id: organisation.id,
                //           name: organisation.name,
                //           slug: organisation.slug,
                //           description: organisation.description,
                //           icon: organisation.icon || "",
                //           members: [],
                //       }
                //     : null,
            } satisfies ProjectDetailsData,
        },
        status: HTTP_STATUS.OK,
    };
}

export async function checkProjectSlugValidity(slug: string): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
    });

    if (!project) {
        return { data: { success: false, message: "Project not found" }, status: HTTP_STATUS.NOT_FOUND };
    }

    return { data: { id: project.id }, status: HTTP_STATUS.OK };
}

export async function getManyProjects(userSession: ContextUserData | undefined, projectIds: string[]): Promise<RouteHandlerResponse> {
    const list = await prisma.project.findMany({
        where: {
            id: {
                in: projectIds,
            },
        },
        include: {
            team: {
                include: {
                    members: true,
                },
            },
        },
    });

    const projectsList: ProjectListItem[] = [];

    for (const project of list) {
        const team = project.team;
        const members = team.members.map((member) => ({
            ...member,
            permissions: member.permissions as ProjectPermission[],
            organisationPermissions: member.permissions as OrganisationPermission[],
        }));

        const projectAccessible = isProjectAccessible({
            visibility: project.visibility,
            publishingStatus: project.status,
            userId: userSession?.id,
            teamMembers: members,
            orgMembers: [],
        });
        if (!projectAccessible) continue;

        projectsList.push({
            icon: projectIconUrl(project.slug, project.iconFileId),
            id: project.id,
            slug: project.slug,
            name: project.name,
            summary: project.summary,
            type: project.type,
            downloads: project.downloads,
            followers: project.followers,
            dateUpdated: project.dateUpdated,
            datePublished: project.datePublished,
            status: project.status as ProjectPublishingStatus,
            visibility: project.visibility as ProjectVisibility,
            clientSide: project.clientSide as ProjectSupport,
            serverSide: project.serverSide as ProjectSupport,
            featuredCategories: project.featuredCategories,
            categories: project.categories,
            gameVersions: project.gameVersions,
            loaders: project.loaders,
        });
    }

    return { data: projectsList, status: HTTP_STATUS.OK };
}

export async function getRandomProjects(
    userSession: ContextUserData | undefined,
    count: number,
    cached = false,
): Promise<RouteHandlerResponse> {
    let projectsCount = 20;
    if (isNumber(count) && count > 0 && count <= 100) {
        projectsCount = count;
    }

    if (cached) {
        const cachedData = tryJsonParse((await redis.get(`random-projects-cache:${count}`)) || "");
        if (cachedData) {
            return { data: cachedData, status: HTTP_STATUS.OK };
        }
    }

    const randomProjects: { id: string }[] =
        await prisma.$queryRaw`SELECT id FROM "Project" TABLESAMPLE SYSTEM_ROWS(${projectsCount}) WHERE "visibility" = 'listed' AND "downloads" > 0;`;

    const idsArray = randomProjects?.map((project) => project.id);
    const res = await getManyProjects(userSession, idsArray);

    if (cached) await redis.set(`random-projects-cache:${count}`, JSON.stringify(res.data), "EX", 300);
    return res;
}
