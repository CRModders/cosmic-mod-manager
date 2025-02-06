import type { DependencyType, VersionReleaseChannel } from "@app/utils/types";
import type { ProjectVersionData, VersionFile } from "@app/utils/types/api";
import type { Prisma } from "@prisma/client";
import { GetManyFiles } from "~/db/file_item";
import { GetMany_ProjectsVersions } from "~/db/version_item";
import { getFilesFromId } from "~/routes/project/queries/file";
import prisma from "~/services/prisma";
import { HashAlgorithms } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData } from "~/utils/http";
import { GetReleaseChannelFilter } from "~/utils/project";
import { userIconUrl, versionFileUrl } from "~/utils/urls";

export async function GetVersionFromFileHash(hash: string, algorithm: HashAlgorithms) {
    const res = await GetVersionsFromFileHashes([hash], algorithm);

    if ("success" in res.data && res.data.success === false) return res;
    if (Array.isArray(res.data)) {
        return {
            data: res.data[0],
            status: res.status,
        };
    }

    return res;
}

export async function GetVersionsFromFileHashes(hashes: string[], algorithm: HashAlgorithms) {
    const hashList = hashes.filter((hash) => !!hash.length && typeof hash === "string");
    if (hashList.length > 50) return invalidReqestResponseData("Maximum of 50 versions can be retrieved from hashes at once!");

    let FilesWhere: Prisma.FileWhereInput = {
        sha512_hash: {
            in: hashList,
        },
    };

    if (algorithm === HashAlgorithms.SHA1) {
        FilesWhere = {
            sha1_hash: {
                in: hashList,
            },
        };
    }

    const files = await GetManyFiles({
        where: FilesWhere,
    });
    if (!files.length) return notFoundResponseData("No versions found from the provided hashes!");

    const versionFiles = await prisma.versionFile.findMany({
        where: {
            fileId: {
                in: files.map((f) => f.id),
            },
        },
        include: {
            version: {
                include: {
                    dependencies: true,
                    files: true,
                    author: true,
                },
            },
        },
    });
    if (!versionFiles.length) return notFoundResponseData("No versions found from the provided hashes!");

    const fileIds = [];
    for (const item of versionFiles) {
        for (const file of item.version.files) {
            fileIds.push(file.fileId);
        }
    }

    const filesDataMap = await getFilesFromId(fileIds);
    const versionDataList: ProjectVersionData[] = [];

    for (const item of versionFiles) {
        const version = item.version;

        const files: VersionFile[] = [];
        for (const versionFile of version.files) {
            const fileData = filesDataMap.get(versionFile.fileId);
            if (!fileData) continue;

            files.push({
                id: versionFile.id,
                isPrimary: versionFile.isPrimary,
                name: fileData.name,
                url: versionFileUrl(version.projectId, version.id, fileData.name),
                size: fileData.size,
                type: fileData.type,
                sha1_hash: fileData.sha1_hash,
                sha512_hash: fileData.sha512_hash,
            });
        }

        versionDataList.push({
            id: version.id,
            projectId: version.projectId,
            title: version.title,
            versionNumber: version.versionNumber,
            changelog: version.changelog,
            slug: version.slug,
            datePublished: version.datePublished,
            featured: version.featured,
            downloads: version.downloads,
            releaseChannel: version.releaseChannel as VersionReleaseChannel,
            gameVersions: version.gameVersions,
            loaders: version.loaders,
            primaryFile: files.find((f) => f.isPrimary) as VersionFile,
            files: files,
            author: {
                id: version.author.id,
                userName: version.author.userName,
                avatar: userIconUrl(version.author.id, version.author.avatar),
                role: "",
            },
            dependencies: version.dependencies.map((dependency) => ({
                id: dependency.id,
                projectId: dependency.projectId,
                versionId: dependency.versionId,
                dependencyType: dependency.dependencyType as DependencyType,
            })),
        } satisfies ProjectVersionData);
    }

    return {
        data: versionDataList,
        status: HTTP_STATUS.OK,
    };
}

interface VersionFilter {
    gameVersions?: string[];
    loader?: string;
    releaseChannel?: string;
}

export async function GetLatestProjectVersionFromHash(hash: string, algorithm: HashAlgorithms, filter: VersionFilter) {
    const res = await GetLatestProjectVersionsFromHashes([hash], algorithm, filter);

    if (res.data.success === false) return res;

    if (typeof res.data === "object") {
        return {
            data: res.data[hash as keyof typeof res.data],
            status: res.status,
        };
    }

    return res;
}

export async function GetLatestProjectVersionsFromHashes(hashes: string[], algorithm: HashAlgorithms, filter: VersionFilter) {
    const hashList = hashes.filter((hash) => !!hash.length && typeof hash === "string");
    if (hashList.length > 50) return invalidReqestResponseData("Maximum of 50 versions can be retrieved from hashes at once!");

    let FilesWhereInput: Prisma.FileWhereInput = {
        sha512_hash: {
            in: hashList,
        },
    };

    if (algorithm === HashAlgorithms.SHA1) {
        FilesWhereInput = {
            sha1_hash: {
                in: hashList,
            },
        };
    }

    const files = await GetManyFiles({
        where: FilesWhereInput,
    });
    if (!files.length) return notFoundResponseData("No versions found from the provided hashes!");

    // A map of file ids to their respective input hash
    const FileIdToInputHashMap = new Map<string, string>();
    for (const file of files) {
        const matchingHash = hashList.find((h) => h === file.sha1_hash || h === file.sha512_hash);

        if (matchingHash) {
            FileIdToInputHashMap.set(file.id, matchingHash);
        }
    }

    const versionFiles = await prisma.versionFile.findMany({
        where: {
            fileId: {
                in: files.map((f) => f.id),
            },
        },
        select: {
            fileId: true,
            version: {
                select: {
                    projectId: true,
                },
            },
        },
    });
    if (!versionFiles.length) return notFoundResponseData("No versions found from the provided hashes!");

    const ProjectIdToInputHashMap = new Map<string, string>();
    const projectIds = [];
    for (const item of versionFiles) {
        projectIds.push(item.version.projectId);

        const relatedInputHash = FileIdToInputHashMap.get(item.fileId);
        if (relatedInputHash) ProjectIdToInputHashMap.set(item.version.projectId, relatedInputHash);
    }

    const projectVersionWhereInput: Prisma.VersionWhereInput = {};
    if (filter.gameVersions?.length) {
        projectVersionWhereInput.gameVersions = {
            hasSome: filter.gameVersions,
        };
    }
    if (filter.loader) projectVersionWhereInput.loaders = { has: filter.loader };
    if (filter.releaseChannel) {
        projectVersionWhereInput.releaseChannel = {
            in: GetReleaseChannelFilter(filter.releaseChannel),
        };
    }

    const _Projects = await GetMany_ProjectsVersions(projectIds);
    const Projects_Filtered = [];
    for (const project of _Projects) {
        const Versions = [];

        for (const version of project.versions) {
            if (!version) continue;

            if (filter.gameVersions?.length && !version.gameVersions.some((gv) => filter.gameVersions?.includes(gv))) continue;
            if (filter.loader && !version.loaders.includes(filter.loader)) continue;
            if (filter.releaseChannel && !GetReleaseChannelFilter(filter.releaseChannel).includes(version.releaseChannel)) continue;

            Versions.push(version);
        }

        if (Versions.length) {
            Projects_Filtered.push({
                id: project.id,
                versions: Versions,
            });
        }
    }

    const versionFileIds = [];
    for (const project of Projects_Filtered) {
        for (const version of project.versions) {
            for (const file of version.files) {
                versionFileIds.push(file.fileId);
            }
        }
    }

    const VersionFilesDataMap = await getFilesFromId(versionFileIds);
    // Input has to latest version data map
    const LatestProjectVersionMap: Record<string, ProjectUpdateVersionData> = {};
    for (const project of Projects_Filtered) {
        const version = project.versions[0];
        if (!version?.id) continue;

        const files: VersionFile[] = [];
        for (const versionFile of version.files) {
            const fileData = VersionFilesDataMap.get(versionFile.fileId);
            if (!fileData) continue;

            files.push({
                id: versionFile.id,
                isPrimary: versionFile.isPrimary,
                name: fileData.name,
                url: versionFileUrl(version.projectId, version.id, fileData.name),
                size: fileData.size,
                type: fileData.type,
                sha1_hash: fileData.sha1_hash,
                sha512_hash: fileData.sha512_hash,
            });
        }

        let relatedInputHash = ProjectIdToInputHashMap.get(project.id);
        if (!relatedInputHash) {
            if (algorithm === HashAlgorithms.SHA1) relatedInputHash = files[0].sha1_hash || "";
            else relatedInputHash = files[0].sha512_hash || "";
        }

        LatestProjectVersionMap[relatedInputHash] = {
            id: version.id,
            projectId: version.projectId,
            title: version.title,
            versionNumber: version.versionNumber,
            changelog: version.changelog,
            slug: version.slug,
            datePublished: version.datePublished,
            featured: version.featured,
            downloads: version.downloads,
            releaseChannel: version.releaseChannel as VersionReleaseChannel,
            gameVersions: version.gameVersions,
            loaders: version.loaders,
            primaryFile: files.find((f) => f.isPrimary) as VersionFile,
            files: files,
            authorId: version.authorId,
            dependencies: version.dependencies.map((dependency) => ({
                id: dependency.id,
                projectId: dependency.projectId,
                versionId: dependency.versionId,
                dependencyType: dependency.dependencyType as DependencyType,
            })),
        } satisfies ProjectUpdateVersionData;
    }

    return {
        data: LatestProjectVersionMap,
        status: HTTP_STATUS.OK,
    };
}

interface ProjectUpdateVersionData extends Omit<ProjectVersionData, "author"> {
    authorId: string;
}
