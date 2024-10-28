import prisma from "@/services/prisma";
import { versionFileUrl } from "@/utils/urls";
import { type DependencyType, ProjectVisibility, type VersionReleaseChannel } from "@shared/types";
import type { ProjectVersionData, TeamMember, VersionFile } from "@shared/types/api";

import type { ContextUserData } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS, notFoundResponseData } from "@/utils/http";
import { getFilesFromId } from "@src/project/queries/file";
import { formatTeamMemberData, projectMembersSelect } from "@src/project/queries/project";
import { isProjectAccessible } from "@src/project/utils";

export const versionFields = {
    id: true,
    title: true,
    versionNumber: true,
    slug: true,
    datePublished: true,
    featured: true,
    downloads: true,
    changelog: true,
    releaseChannel: true,
    gameVersions: true,
    loaders: true,
    files: true,
    author: true,
    dependencies: true,
};

export async function getAllProjectVersions(
    slug: string,
    userSession: ContextUserData | undefined,
    featuredOnly = false,
): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
        select: {
            id: true,
            slug: true,
            status: true,
            visibility: true,
            ...projectMembersSelect(),
            versions: {
                where: featuredOnly ? { featured: true } : {},
                select: versionFields,
                orderBy: { datePublished: "desc" },
            },
        },
    });

    if (!project?.id) return notFoundResponseData("Project not found");

    const projectMembersList = [
        ...(project?.team.members || []).map((member) => formatTeamMemberData(member)),
        ...(project.organisation?.team.members || []).map((member) => formatTeamMemberData(member)),
    ];

    const projectAccessible = isProjectAccessible({
        visibility: project.visibility,
        publishingStatus: project.status,
        userId: userSession?.id,
        teamMembers: project.team.members,
        orgMembers: [],
    });
    if (!projectAccessible) {
        return notFoundResponseData("Project not found");
    }

    // Get all the filesData for each version
    const idsList = [];
    for (const version of project.versions) {
        for (const file of version.files) {
            idsList.push(file.fileId);
        }
    }
    const versionFilesMap = await getFilesFromId(idsList);

    const versionsList: ProjectVersionData[] = [];
    const isProjectPrivate = project.visibility === ProjectVisibility.PRIVATE;
    for (const version of project.versions) {
        let primaryFile: VersionFile | null = null;
        const files: VersionFile[] = [];

        for (const file of version.files) {
            const fileData = versionFilesMap.get(file.fileId);
            if (!fileData?.id) continue;
            const useDirectCacheCdnUrl = !isProjectPrivate && !file.isPrimary;

            const formattedFile = {
                id: file.id,
                isPrimary: file.isPrimary,
                name: fileData.name,
                size: fileData.size,
                type: fileData.type,
                // ? Don't use cache cdn for primary files
                url: versionFileUrl(project.slug, version.slug, fileData.name, useDirectCacheCdnUrl) || "",
                sha1_hash: fileData.sha1_hash,
                sha512_hash: fileData.sha512_hash,
            };

            files.push(formattedFile);
            if (formattedFile.isPrimary === true) {
                primaryFile = formattedFile;
            }
        }

        let authorsMembership: TeamMember | null = null;
        for (const member of projectMembersList) {
            if (member.userId === version.author.id) {
                authorsMembership = member;
                break;
            }
        }

        versionsList.push({
            id: version.id,
            title: version.title,
            versionNumber: version.versionNumber,
            slug: version.slug,
            datePublished: version.datePublished,
            featured: version.featured,
            downloads: version.downloads,
            changelog: version.changelog,
            releaseChannel: version.releaseChannel as VersionReleaseChannel,
            gameVersions: version.gameVersions,
            loaders: version.loaders,
            primaryFile: primaryFile?.id ? primaryFile : null,
            files: files,
            author: {
                id: version.author.id,
                userName: version.author.userName,
                name: version.author.name,
                avatarUrl: version.author.avatarUrl,
                role: authorsMembership?.role || "",
            },
            dependencies: version.dependencies.map((dependency) => ({
                id: dependency.id,
                projectId: dependency.projectId,
                versionId: dependency.versionId,
                dependencyType: dependency.dependencyType as DependencyType,
            })),
        });
    }

    return { data: { success: true, data: versionsList }, status: HTTP_STATUS.OK };
}

export async function getProjectVersionData(
    projectSlug: string,
    versionSlug: string,
    userSession: ContextUserData,
): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: projectSlug }, { id: projectSlug }],
        },
        select: {
            id: true,
            slug: true,
            status: true,
            visibility: true,
            ...projectMembersSelect(),
            versions: {
                where: {
                    OR: [{ slug: versionSlug }, { id: versionSlug }],
                },
                select: versionFields,
            },
        },
    });

    const version = project?.versions?.[0];
    if (!project?.id || !version?.id) return notFoundResponseData("Project not found");

    const projectMembersList = [
        ...(project?.team.members || []).map((member) => formatTeamMemberData(member)),
        ...(project.organisation?.team.members || []).map((member) => formatTeamMemberData(member)),
    ];

    const projectAccessible = isProjectAccessible({
        visibility: project.visibility,
        publishingStatus: project.status,
        userId: userSession?.id,
        teamMembers: project.team.members,
        orgMembers: [],
    });
    // Check if the project is publically available or is the user a member in the project
    if (!projectAccessible) {
        return notFoundResponseData("Project not found");
    }

    // Get all the filesData for each version
    const idsList = [];
    for (const file of version.files) {
        idsList.push(file.fileId);
    }
    const versionFilesMap = await getFilesFromId(idsList);

    // Format the data
    let primaryFile: VersionFile | null = null;
    const files: VersionFile[] = [];
    const isProjectPrivate = project.visibility === ProjectVisibility.PRIVATE;

    // Get formatted files data
    for (const file of version.files) {
        const fileData = versionFilesMap.get(file.fileId);
        if (!fileData?.id) continue;
        const useDirectCacheCdnUrl = !file.isPrimary && !isProjectPrivate;

        const formattedFile = {
            id: file.id,
            isPrimary: file.isPrimary,
            name: fileData.name,
            size: fileData.size,
            type: fileData.type,
            // ? Don't use cache cdn for primary files
            url: versionFileUrl(project.slug, version.slug, fileData.name, useDirectCacheCdnUrl) || "",
            sha1_hash: fileData.sha1_hash,
            sha512_hash: fileData.sha512_hash,
        };

        files.push(formattedFile);
        if (formattedFile.isPrimary === true) {
            primaryFile = formattedFile;
        }
    }

    let authorsMembership: TeamMember | null = null;
    for (const member of projectMembersList) {
        if (member.userId === version.author.id) {
            authorsMembership = member;
            break;
        }
    }

    // Compose the version object
    const versionData = {
        id: version.id,
        title: version.title,
        versionNumber: version.versionNumber,
        slug: version.slug,
        datePublished: version.datePublished,
        featured: version.featured,
        downloads: version.downloads,
        changelog: version.changelog,
        releaseChannel: version.releaseChannel as VersionReleaseChannel,
        gameVersions: version.gameVersions,
        loaders: version.loaders,
        primaryFile: primaryFile?.id ? primaryFile : null,
        files: files,
        author: {
            id: version.author.id,
            userName: version.author.userName,
            name: version.author.name,
            avatarUrl: version.author.avatarUrl,
            role: authorsMembership?.role || "",
        },
        dependencies: version.dependencies.map((dependency) => ({
            id: dependency.id,
            projectId: dependency.projectId,
            versionId: dependency.versionId,
            dependencyType: dependency.dependencyType as DependencyType,
        })),
    } satisfies ProjectVersionData;

    return { data: { success: true, data: versionData }, status: HTTP_STATUS.OK };
}
