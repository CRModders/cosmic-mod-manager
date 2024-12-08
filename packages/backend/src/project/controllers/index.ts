import prisma from "@/services/prisma";
import redis from "@/services/redis";
import type { ContextUserData } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { isNumber } from "@/utils";
import { HTTP_STATUS } from "@/utils/http";
import { tryJsonParse } from "@/utils/str";
import { orgIconUrl, projectGalleryFileUrl, projectIconUrl } from "@/utils/urls";
import type { TeamMember as DBTeamMember } from "@prisma/client";
import { gameVersionsList } from "@shared/config/game-versions";
import { combineProjectMembers, sortVersionsWithReference } from "@shared/lib/utils/project";
import type {
    OrganisationPermission,
    ProjectPermission,
    ProjectPublishingStatus,
    ProjectSupport,
    ProjectType,
    ProjectVisibility,
} from "@shared/types";
import type { ProjectDetailsData, ProjectListItem } from "@shared/types/api";
import { projectDetailsFields, projectMemberPermissionsSelect } from "../queries/project";
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

    const allMembers = combineProjectMembers(project.team.members, project.organisation?.team.members || []);

    const projectAccessible = isProjectAccessible({
        visibility: project.visibility,
        publishingStatus: project.status,
        userId: userSession?.id,
        teamMembers: project.team.members,
        orgMembers: project.organisation?.team.members || [],
    });
    if (!projectAccessible) {
        return { data: { success: false, message: "Project not found" }, status: HTTP_STATUS.NOT_FOUND };
    }
    const currSessionMember = allMembers.get(userSession?.id || "");
    const org = project.organisation;

    return {
        data: {
            success: true,
            project: {
                id: project.id,
                teamId: project.team.id,
                orgId: null,
                name: project.name,
                icon: projectIconUrl(project.id, project.iconFileId),
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
                gameVersions: sortVersionsWithReference(project.gameVersions || [], gameVersionsList),
                gallery: project.gallery
                    .map((galleryItem) => {
                        const rawImage = projectGalleryFileUrl(project.id, galleryItem.imageFileId);
                        const imageThumbnail = projectGalleryFileUrl(project.id, galleryItem.thumbnailFileId);
                        if (!rawImage || !imageThumbnail) return null;

                        return {
                            id: galleryItem.id,
                            name: galleryItem.name,
                            description: galleryItem.description,
                            image: rawImage,
                            imageThumbnail: imageThumbnail,
                            featured: galleryItem.featured,
                            dateCreated: galleryItem.dateCreated,
                            orderIndex: galleryItem.orderIndex,
                        };
                    })
                    .filter((item) => item !== null),
                members: project.team.members.map((member) => formatProjectMember(member, currSessionMember)),
                organisation: org
                    ? {
                          id: org.id,
                          name: org.name,
                          slug: org.slug,
                          description: org.description,
                          icon: orgIconUrl(org.id, org.iconFileId),
                          members: org.team.members.map((member) => formatProjectMember(member, currSessionMember)),
                      }
                    : null,
            } satisfies ProjectDetailsData,
        },
        status: HTTP_STATUS.OK,
    };
}

interface FormatMemberProps extends DBTeamMember {
    user: {
        id: string;
        userName: string;
        avatarUrl: string | null;
    };
}

function formatProjectMember<T extends FormatMemberProps>(member: T, currMember?: { id?: string }) {
    return {
        id: member.id,
        userId: member.user.id,
        teamId: member.teamId,
        userName: member.user.userName,
        avatarUrl: member.user.avatarUrl,
        role: member.role,
        isOwner: member.isOwner,
        accepted: member.accepted,
        permissions: currMember?.id ? (member.permissions as ProjectPermission[]) : [],
        organisationPermissions: currMember?.id ? (member.organisationPermissions as OrganisationPermission[]) : [],
    };
}

export async function checkProjectSlugValidity(slug: string): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findUnique({
        where: {
            slug: slug,
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
            ...projectMemberPermissionsSelect(),
        },
    });

    const projectsList: ProjectListItem[] = [];

    for (const project of list) {
        const projectAccessible = isProjectAccessible({
            visibility: project.visibility,
            publishingStatus: project.status,
            userId: userSession?.id,
            teamMembers: project.team.members,
            orgMembers: project.organisation?.team.members || [],
        });
        if (!projectAccessible) continue;

        projectsList.push({
            icon: projectIconUrl(project.id, project.iconFileId),
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
            featured_gallery: null,
            color: project.color,
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
