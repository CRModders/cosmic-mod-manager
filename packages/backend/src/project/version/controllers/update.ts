import { addInvalidAuthAttempt } from "@/middleware/rate-limit/invalid-auth-attempt";
import prisma from "@/services/prisma";
import { deleteProjectVersionDirectory } from "@/services/storage";
import { type ContextUserData, FILE_STORAGE_SERVICE } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData } from "@/utils/http";
import type { File as DBFile } from "@prisma/client";
import { doesMemberHaveAccess, getCurrMember, getLoadersByProjectType } from "@shared/lib/utils";
import type { VersionDependencies, updateVersionFormSchema } from "@shared/schemas/project/version";
import { ProjectPermission, type ProjectType, VersionReleaseChannel } from "@shared/types";
import { getFilesFromId } from "@src/project/queries/file";
import { projectMemberPermissionsSelect } from "@src/project/queries/project";
import {
    aggregateProjectLoaderNames,
    aggregateVersions,
    createVersionFiles,
    deleteVersionFiles,
    isAnyDuplicateFile,
} from "@src/project/utils";
import type { Context } from "hono";
import type { z } from "zod";
import { createVersionDependencies, deleteExcessDevReleases } from "./new-version";

export const updateVersionData = async (
    ctx: Context,
    projectSlug: string,
    versionSlug: string,
    userSession: ContextUserData,
    formData: z.infer<typeof updateVersionFormSchema>,
): Promise<RouteHandlerResponse> => {
    const project = await prisma.project.findUnique({
        where: { slug: projectSlug },
        select: {
            id: true,
            loaders: true,
            type: true,
            gameVersions: true,
            versions: {
                select: {
                    id: true,
                    slug: true,
                    releaseChannel: true,
                    loaders: true,
                    gameVersions: true,
                    datePublished: true,
                    files: {
                        where: { isPrimary: false },
                        select: {
                            id: true,
                            fileId: true,
                        },
                    },
                    dependencies: true,
                },
            },
            ...projectMemberPermissionsSelect({ userId: userSession.id }),
        },
    });

    const targetVersion = project?.versions?.find((version) => version.slug === versionSlug || version.id === versionSlug);

    // Return if project or target version not found
    const memberObj = getCurrMember(userSession.id, project?.team.members || [], project?.organisation?.team.members || []);
    if (!project?.id || !targetVersion?.id || !memberObj) return notFoundResponseData("Project not found");

    // Check if the user has permission to edit a version
    const canUpdateVersion = doesMemberHaveAccess(
        ProjectPermission.UPLOAD_VERSION,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!canUpdateVersion) {
        await addInvalidAuthAttempt(ctx);
        return notFoundResponseData("Project not found");
    }

    // Check the validity of loaders
    const allowedLoaders = getLoadersByProjectType(project.type as ProjectType[]).map((loader) => loader.name);
    for (const loader of formData.loaders || []) {
        if (!allowedLoaders.includes(loader)) {
            return invalidReqestResponseData(`Loader ${loader} not supported by current project type.`);
        }
    }

    // Delete removed files and add if there are new files uploaded
    const additionalFiles = formData.additionalFiles || [];
    if (additionalFiles?.length || targetVersion?.files?.length) {
        const newAdditionalFiles: File[] = [];
        const deletedFileList: string[] = [];

        // Get all the uploaded files
        for (const file of additionalFiles) {
            if (file instanceof File) {
                newAdditionalFiles.push(file);
            }
        }

        const nonNewAdditionalFileIds: string[] = [];
        for (const file of additionalFiles) {
            if (file instanceof File) continue;
            nonNewAdditionalFileIds.push(file.id);
        }

        // Get all the deleted files
        for (const file of targetVersion.files) {
            if (!nonNewAdditionalFileIds.includes(file.id)) {
                deletedFileList.push(file.fileId);
            }
        }

        // Delete the files that are not in the new list (means the user removed them)
        if (deletedFileList.length) {
            const dbFiles = await getFilesFromId(deletedFileList);
            const deletedFilesData: DBFile[] = [];
            for (const deletedFile of deletedFileList) {
                const dbFile = dbFiles.get(deletedFile);
                if (dbFile) deletedFilesData.push(dbFile);
            }

            await deleteVersionFiles(project.id, targetVersion.id, deletedFilesData);
        }

        // Check if duplicate files are not being uploaded
        const isDuplicate = await isAnyDuplicateFile({
            projectId: project.id,
            files: newAdditionalFiles,
        });

        if (isDuplicate === true) {
            return invalidReqestResponseData("Duplicate files are not allowed");
        }

        // Save the new files
        if (newAdditionalFiles.length) {
            await createVersionFiles({
                versionId: targetVersion.id,
                projectId: project.id,
                files: newAdditionalFiles.map((file) => ({
                    file: file,
                    isPrimary: false,
                    storageService: FILE_STORAGE_SERVICE.LOCAL,
                })),
            });
        }
    }

    // Re evaluate the project loaders list and supported game versions
    const projectLoaders: string[] = [];
    const projectGameVersions: string[] = [];

    for (const version of project.versions) {
        // Exclude the target version from the list, instead use the new data
        if (version.id === targetVersion.id) {
            projectLoaders.push(...(formData.loaders || []));
            projectGameVersions.push(...formData.gameVersions);
            continue;
        }
        projectLoaders.push(...version.loaders);
        projectGameVersions.push(...version.gameVersions);
    }

    const aggregatedLoaderNames = aggregateProjectLoaderNames(projectLoaders);
    const aggregatedGameVersions = aggregateVersions(projectGameVersions);

    // Delete removed dependencies and add new ones
    const dependenciesList = formData.dependencies || [];
    if (targetVersion.dependencies.length || dependenciesList?.length) {
        const newDependencies: z.infer<typeof VersionDependencies> = [];
        // List of ids of deleted dependencies
        const deletedDependencies: string[] = [];

        for (const dependency of dependenciesList) {
            if (dependency.projectId === project.id) continue;

            let isNewDependency = true;
            for (const existingDependency of targetVersion.dependencies) {
                if (existingDependency.projectId === dependency.projectId && existingDependency.versionId === dependency.versionId) {
                    isNewDependency = false;
                    break;
                }
            }

            if (isNewDependency === true) newDependencies.push(dependency);
        }

        for (const existingDependency of targetVersion.dependencies) {
            let isDeletedDependency = true;
            for (const dependency of dependenciesList) {
                if (existingDependency.projectId === dependency.projectId && existingDependency.versionId === dependency.versionId) {
                    isDeletedDependency = false;
                    break;
                }
            }

            if (isDeletedDependency === true) deletedDependencies.push(existingDependency.id);
        }

        // Delete deleted dependencies
        if (deletedDependencies.length) {
            await prisma.dependency.deleteMany({
                where: {
                    id: {
                        in: deletedDependencies,
                    },
                },
            });
        }

        // Create new dependencies
        await createVersionDependencies(targetVersion.id, newDependencies);
    }

    // Finally update the version data
    await prisma.version.update({
        where: {
            id: targetVersion.id,
        },
        data: {
            title: formData.title,
            versionNumber: formData.versionNumber,
            changelog: formData.changelog,
            featured: formData.featured,
            releaseChannel: formData.releaseChannel,
            gameVersions: formData.gameVersions,
            loaders: formData.loaders || [],
        },
    });

    // Update project loaders list and supported game versions
    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            gameVersions: aggregatedGameVersions,
            loaders: aggregatedLoaderNames,
        },
    });

    // Check if project loaders or game versions were affected by the version update
    let projectLoadersChanged = false;
    let gameVersionsChanged = false;

    for (const loader of project.loaders) {
        if (!aggregatedLoaderNames.includes(loader)) {
            projectLoadersChanged = true;
            break;
        }
    }

    for (const gameVersion of project.gameVersions) {
        if (!aggregatedGameVersions.includes(gameVersion)) {
            gameVersionsChanged = true;
            break;
        }
    }

    // Only update dev releases if the release channel is changed
    if (formData.releaseChannel === VersionReleaseChannel.DEV && formData.releaseChannel !== targetVersion.releaseChannel) {
        await deleteExcessDevReleases({
            projectId: project.id,
            versions: project.versions,
        });
    }

    return {
        data: {
            success: true,
            message: "Version updated successfully",
            data: {
                slug: targetVersion.slug,
                projectLoadersChanged,
                gameVersionsChanged,
            },
        },
        status: HTTP_STATUS.OK,
    };
};

export const deleteProjectVersion = async (ctx: Context, projectSlug: string, versionSlug: string, userSession: ContextUserData) => {
    const project = await prisma.project.findUnique({
        where: {
            slug: projectSlug,
        },
        select: {
            id: true,
            loaders: true,
            versions: {
                select: {
                    id: true,
                    slug: true,
                    files: true,
                    loaders: true,
                    gameVersions: true,
                },
            },
            ...projectMemberPermissionsSelect({ userId: userSession.id }),
        },
    });
    let targetVersion = null;
    for (const version of project?.versions || []) {
        if (version.slug === versionSlug || version.id === versionSlug) {
            targetVersion = version;
            break;
        }
    }

    const memberObj = getCurrMember(userSession.id, project?.team.members || [], project?.organisation?.team.members || []);
    if (!project?.id || !targetVersion?.id || !memberObj) return notFoundResponseData("Project not found");

    // Check if the user has permission to upload a version
    const canDeleteVersion = doesMemberHaveAccess(
        ProjectPermission.DELETE_VERSION,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!canDeleteVersion) {
        await addInvalidAuthAttempt(ctx);
        return notFoundResponseData("Project not found");
    }

    const filesData = await prisma.file.findMany({
        where: {
            id: {
                in: targetVersion.files.map((file) => file.fileId),
            },
        },
    });

    // Delete all the files
    await deleteVersionFiles(project.id, targetVersion.id, filesData);

    // Delete the version directory
    await deleteProjectVersionDirectory(FILE_STORAGE_SERVICE.LOCAL, project.id, targetVersion.id);

    const deletedVersion = await prisma.version.delete({
        where: {
            id: targetVersion.id,
        },
    });

    // Re evaluate the project loaders list and supported game versions
    const projectLoaders: string[] = [];
    const projectGameVersions: string[] = [];

    for (const version of project.versions) {
        // Exclude the target version from the list, instead use the new data
        if (version.id === deletedVersion.id) continue;
        projectLoaders.push(...version.loaders);
        projectGameVersions.push(...version.gameVersions);
    }

    const aggregatedLoaderNames = aggregateProjectLoaderNames(projectLoaders);
    const aggregatedGameVersions = aggregateVersions(projectGameVersions);

    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            gameVersions: aggregatedGameVersions,
            loaders: aggregatedLoaderNames,
        },
    });

    return { data: { success: true, message: `Version "${deletedVersion.title}" deleted successfully.` }, status: HTTP_STATUS.OK };
};
