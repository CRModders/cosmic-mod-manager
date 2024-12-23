import { type DependencyType, ProjectVisibility, type VersionReleaseChannel } from "@app/utils/types";
import type { ProjectVersionData, VersionFile } from "@app/utils/types/api";
import prisma from "~/services/prisma";
import { userIconUrl, versionFileUrl } from "~/utils/urls";

import { gameVersionsList } from "@app/utils/config/game-versions";
import { combineProjectMembers, sortVersionsWithReference } from "@app/utils/project";
import type { Prisma } from "@prisma/client";
import { getFilesFromId } from "~/src/project/queries/file";
import { formatTeamMemberData, projectMembersSelect } from "~/src/project/queries/project";
import { isProjectAccessible } from "~/src/project/utils";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, notFoundResponseData } from "~/utils/http";

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
    where?: Prisma.VersionWhereInput,
) {
    const whereSelect: Prisma.VersionWhereInput = where || {};
    if (featuredOnly) whereSelect.featured = true;

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
                where: whereSelect,
                select: versionFields,
                orderBy: { datePublished: "desc" },
            },
        },
    });

    if (!project?.id) return notFoundResponseData("Project not found");

    const projectAccessible = isProjectAccessible({
        visibility: project.visibility,
        publishingStatus: project.status,
        userId: userSession?.id,
        teamMembers: project.team.members,
        orgMembers: project.organisation?.team.members || [],
        sessionUserRole: userSession?.role,
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

    for (let i = 0; i < project.versions.length; i++) {
        const version = project.versions[i];
        const nextVersion = project.versions[i + 1];

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
                // ? Don't use cache cdn for primary files or private project files
                url: versionFileUrl(project.id, version.id, fileData.name, useDirectCacheCdnUrl) || "",
                sha1_hash: fileData.sha1_hash,
                sha512_hash: fileData.sha512_hash,
            };

            files.push(formattedFile);
            if (formattedFile.isPrimary === true) {
                primaryFile = formattedFile;
            }
        }

        const allMembers = combineProjectMembers(project.team.members, project.organisation?.team.members || []);
        const authorData = allMembers.get(version.author.id);
        const formattedAuthor = authorData ? formatTeamMemberData(authorData) : null;
        const isDuplicate = nextVersion?.changelog && nextVersion.changelog.length > 0 && nextVersion?.changelog === version.changelog;

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
            gameVersions: sortVersionsWithReference(version.gameVersions, gameVersionsList),
            loaders: version.loaders,
            primaryFile: primaryFile?.id ? primaryFile : null,
            files: files,
            author: {
                id: version.author.id,
                userName: version.author.userName,
                name: version.author.name,
                avatar: userIconUrl(version.author.id, version.author.avatar),
                role: formattedAuthor?.role || "",
            },
            dependencies: version.dependencies.map((dependency) => ({
                id: dependency.id,
                projectId: dependency.projectId,
                versionId: dependency.versionId,
                dependencyType: dependency.dependencyType as DependencyType,
            })),
            isDuplicate: isDuplicate === true,
        });
    }

    return { data: { success: true, data: versionsList }, status: HTTP_STATUS.OK };
}

export async function getProjectVersionData(projectSlug: string, versionId: string, userSession: ContextUserData | undefined) {
    const res = await getAllProjectVersions(projectSlug, userSession, false, {
        id: versionId,
    });
    // @ts-ignore
    const list = res.data?.data as ProjectVersionData[];
    if (Array.isArray(list)) {
        if (!list.length) return notFoundResponseData(`Version "${versionId}" not found`);

        return { data: { success: true, data: list[0] }, status: res.status };
    }

    return res;
}

interface GetLatestVersionFilters {
    releaseChannel?: string;
    gameVersion?: string;
    loader?: string;
}

export async function getLatestVersion(projectSlug: string, userSession: ContextUserData | undefined, filters: GetLatestVersionFilters) {
    const whereInput: Prisma.VersionWhereInput = {};
    if (filters.releaseChannel?.length) whereInput.releaseChannel = filters.releaseChannel;
    if (filters.gameVersion?.length) whereInput.gameVersions = { has: filters.gameVersion };
    if (filters.loader?.length) whereInput.loaders = { has: filters.loader };

    // @ts-ignore
    const res = await getAllProjectVersions(projectSlug, userSession, false, whereInput);
    // @ts-ignore
    const list = res.data?.data as ProjectVersionData[];
    if (Array.isArray(list)) {
        if (!list.length) return notFoundResponseData("No version found for your query!");

        return { data: { success: true, data: list[0] }, status: res.status };
    }

    return res;
}
