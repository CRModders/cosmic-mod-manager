import type { DependencyType, VersionReleaseChannel } from "@app/utils/types";
import type { ProjectVersionData, VersionFile } from "@app/utils/types/api";
import type { Prisma } from "@prisma/client";
import prisma from "~/services/prisma";
import { getFilesFromId } from "~/src/project/queries/file";
import { HashAlgorithms } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData } from "~/utils/http";
import { GetReleaseChannelFilter } from "~/utils/project";
import { userIconUrl } from "~/utils/urls";

export async function GetVersionFromFileHash(hash: string, algorithm: HashAlgorithms) {
    const data = await GetVersionsFromFileHashes([hash], algorithm);

    // @ts-ignore
    if (data?.success === false) return data;

    // @ts-ignore
    const version = data.data[0] as ProjectVersionData;

    return {
        data: version,
        status: data.status,
    };
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

    const files = await prisma.file.findMany({
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
                url: fileData.url,
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
                name: version.author.name,
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

    // @ts-ignore
    if (res.success === false) return res;

    // @ts-ignore
    const versionData = res.data[hash];

    return {
        data: versionData,
        status: res.status,
    };
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

    const files = await prisma.file.findMany({
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
    if (filter.releaseChannel)
        projectVersionWhereInput.releaseChannel = {
            in: GetReleaseChannelFilter(filter.releaseChannel),
        };

    const projects = await prisma.project.findMany({
        where: {
            id: {
                in: projectIds,
            },
        },
        select: {
            id: true,
            versions: {
                where: projectVersionWhereInput,
                include: {
                    dependencies: true,
                    files: true,
                },
                orderBy: { datePublished: "desc" },
            },
        },
    });

    const versionFileIds = [];
    for (const project of projects) {
        for (const version of project.versions) {
            for (const file of version.files) {
                versionFileIds.push(file.fileId);
            }
        }
    }

    const VersionFilesDataMap = await getFilesFromId(versionFileIds);
    // Input has to latest version data map
    const LatestProjectVersionMap: Record<string, ProjectUpdateVersionData> = {};
    for (const project of projects) {
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
                url: fileData.url,
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
