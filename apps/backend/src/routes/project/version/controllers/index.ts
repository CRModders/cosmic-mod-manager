import { gameVersionsList } from "@app/utils/config/game-versions";
import { combineProjectMembers, sortVersionsWithReference } from "@app/utils/project";
import { type DependencyType, ProjectVisibility, type VersionReleaseChannel } from "@app/utils/types";
import type { ProjectVersionData, VersionFile } from "@app/utils/types/api";
import type { Prisma } from "@prisma/client";
import { GetProject_Details } from "~/db/project_item";
import { GetVersions } from "~/db/version_item";
import { getFilesFromId } from "~/routes/project/queries/file";
import { formatTeamMemberData } from "~/routes/project/queries/project";
import { isProjectAccessible } from "~/routes/project/utils";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, notFoundResponseData } from "~/utils/http";
import { GetReleaseChannelFilter } from "~/utils/project";
import { userIconUrl, versionFileUrl } from "~/utils/urls";

export async function getAllProjectVersions(slug: string, userSession: ContextUserData | undefined, featuredOnly = false) {
    const [project, _projectVersions] = await Promise.all([GetProject_Details(slug, slug), GetVersions(slug, slug)]);
    if (!project) return notFoundResponseData("Project not found");

    const projectVersions = [];
    for (const version of _projectVersions?.versions || []) {
        if (!version?.id) continue;
        if (featuredOnly === true && version.featured !== true) continue;

        projectVersions.push(version);
    }

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
    for (const version of projectVersions) {
        for (const file of version.files) {
            idsList.push(file.fileId);
        }
    }
    const versionFilesMap = await getFilesFromId(idsList);

    const versionsList: ProjectVersionData[] = [];
    const isProjectPrivate = project.visibility === ProjectVisibility.PRIVATE;

    for (let i = 0; i < projectVersions.length; i++) {
        const version = projectVersions[i];
        const nextVersion = projectVersions[i + 1];

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
            projectId: project.id,
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
                avatar: userIconUrl(version.author.id, version.author.avatar),
                role: formattedAuthor?.role || "",
            },
            dependencies: version.dependencies.map((dependency) => ({
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
    const res = await getAllProjectVersions(projectSlug, userSession, false);
    // @ts-ignore
    const list = res.data?.data as ProjectVersionData[];
    if (Array.isArray(list)) {
        if (!list.length) return notFoundResponseData(`Version "${versionId}" not found`);

        const targetVersion = list.find((version) => version.id === versionId || version.slug === versionId);
        if (!targetVersion?.id) return notFoundResponseData(`Version "${versionId}" not found`);

        return { data: { success: true, data: targetVersion }, status: res.status };
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
    if (filters.releaseChannel?.length) whereInput.releaseChannel = { in: GetReleaseChannelFilter(filters.releaseChannel) };
    if (filters.gameVersion?.length) whereInput.gameVersions = { has: filters.gameVersion };
    if (filters.loader?.length) whereInput.loaders = { has: filters.loader };

    function filter(version: ProjectVersionData) {
        if (filters.releaseChannel?.length) {
            const channels = GetReleaseChannelFilter(filters.releaseChannel);
            if (!channels.includes(version.releaseChannel)) return false;
        }
        if (filters.gameVersion?.length) {
            if (!version.gameVersions.includes(filters.gameVersion)) return false;
        }
        if (filters.loader?.length) {
            if (!version.loaders.includes(filters.loader)) return false;
        }
        return true;
    }

    // @ts-ignore
    const res = await getAllProjectVersions(projectSlug, userSession, false);
    // @ts-ignore
    const list = res.data?.data as ProjectVersionData[];
    if (Array.isArray(list)) {
        if (!list.length) return notFoundResponseData("No version found for your query!");

        const latestVersion = list.find(filter);
        if (!latestVersion) return notFoundResponseData("No version found for your query!");

        return { data: { success: true, data: latestVersion }, status: res.status };
    }

    return res;
}