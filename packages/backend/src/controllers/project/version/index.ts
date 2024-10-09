import { type ContextUserSession, FILE_STORAGE_SERVICE } from "@/../types";
import { addToUsedApiRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { aggregateProjectLoaderNames, aggregateVersions, isProjectAccessibleToCurrSession } from "@/utils";
import { status } from "@/utils/http";
import { versionFileUrl } from "@/utils/urls";
import type { File as DBFile, Dependency } from "@prisma/client";
import { STRING_ID_LENGTH } from "@shared/config";
import { CHARGE_FOR_SENDING_INVALID_DATA, UNAUTHORIZED_ACCESS_ATTEMPT_CHARGE } from "@shared/config/rate-limit-charges";
import { RESERVED_VERSION_SLUGS } from "@shared/config/reserved";
import { doesMemberHaveAccess, getLoadersByProjectType } from "@shared/lib/utils";
import { getFileType } from "@shared/lib/utils/convertors";
import { isVersionPrimaryFileValid } from "@shared/lib/validation";
import type { VersionDependencies, newVersionFormSchema, updateVersionFormSchema } from "@shared/schemas/project/version";
import { type DependencyType, ProjectPermission, type ProjectType, ProjectVisibility, type VersionReleaseChannel } from "@shared/types";
import type { ProjectVersionData, TeamMember, VersionFile } from "@shared/types/api";
import type { Context } from "hono";
import { nanoid } from "nanoid";
import type { z } from "zod";
import { getFormattedTeamMember, requiredProjectMemberFields } from "./../";
import { createVersionFiles, deleteVersionFiles, deleteVersionStoreDirectory, getFilesFromId, isAnyDuplicateFile } from "./../utils";

export const requiredVersionFields = {
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

const requiredProjectFields = {
    id: true,
    slug: true,
    status: true,
    visibility: true,
    team: {
        select: {
            members: {
                select: requiredProjectMemberFields,
            },
        },
    },
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
};

export const createNewVersion = async (
    ctx: Context,
    userSession: ContextUserSession,
    projectSlug: string,
    formData: z.infer<typeof newVersionFormSchema>,
) => {
    if (!formData?.primaryFile?.name || !(formData.primaryFile instanceof File)) {
        await addToUsedApiRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
        return ctx.json({ success: false, message: "Primary version file is required" });
    }

    const project = await prisma.project.findUnique({
        where: {
            slug: projectSlug,
        },
        select: {
            id: true,
            loaders: true,
            type: true,
            gameVersions: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: requiredProjectMemberFields,
                    },
                },
            },
            organisation: {
                select: {
                    team: {
                        select: {
                            members: {
                                where: { userId: userSession.id },
                                select: requiredProjectMemberFields,
                            },
                        },
                    },
                },
            },
            versions: {
                where: { slug: formData.versionNumber },
                select: {
                    id: true,
                    slug: true,
                },
            },
        },
    });
    const memberObj = project?.team.members?.[0];
    if (!project?.id || !memberObj) return ctx.json({ success: false }, status.NOT_FOUND);

    const canUploadVersion = doesMemberHaveAccess(
        ProjectPermission.UPLOAD_VERSION,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    // Check if the user has permission to upload a version
    if (!canUploadVersion) {
        await addToUsedApiRateLimit(ctx, UNAUTHORIZED_ACCESS_ATTEMPT_CHARGE);
        return ctx.json({ success: false }, status.NOT_FOUND);
    }

    // Check if the uploaded file is of valid type
    const primaryFileType = await getFileType(formData.primaryFile);
    if (!primaryFileType || !isVersionPrimaryFileValid(project.type as ProjectType[], primaryFileType)) {
        await addToUsedApiRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
        return ctx.json({ success: false, message: "Invalid primary file type" });
    }

    // Check the validity of loaders
    const allowedLoaders = getLoadersByProjectType(project.type as ProjectType[]).map((loader) => loader.name);
    for (const loader of formData.loaders || []) {
        if (!allowedLoaders.includes(loader)) {
            return ctx.json({ success: false, message: `Loader ${loader} not supported by current project type.` }, status.BAD_REQUEST);
        }
    }

    // Check if duplicate files are not being uploaded
    const duplicateFiles = await isAnyDuplicateFile({
        projectId: project.id,
        files: [
            formData.primaryFile,
            ...(formData.additionalFiles || []).filter((file) => {
                if (file instanceof File) return file;
            }),
        ],
    });

    if (duplicateFiles === true) {
        return ctx.json({ success: false, message: "We do not allow upload of duplicate files" }, status.BAD_REQUEST);
    }

    // Just to make sure that no version already exists with the same urlSlug or the urlSlug is a reserved slug
    const newUrlSlug =
        project.versions?.[0]?.id || RESERVED_VERSION_SLUGS.includes(formData.versionNumber.toLowerCase()) ? null : formData.versionNumber;

    let newVersion = await prisma.version.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            projectId: project.id,
            authorId: userSession.id,
            title: formData.title,
            versionNumber: formData.versionNumber,
            changelog: formData.changelog,
            slug: newUrlSlug || "",
            featured: formData.featured,
            releaseChannel: formData.releaseChannel,
            gameVersions: formData.gameVersions,
            loaders: formData.loaders || [],
        },
    });

    // If there was a version with the urlSlug same as this version's versionNumber newUrlSlug will be null, in that case
    // gotta update the urlSlug to use newVersion's id
    if (!newUrlSlug) {
        newVersion = await prisma.version.update({
            where: {
                id: newVersion.id,
            },
            data: {
                slug: newVersion.id,
            },
        });
    }

    // Add dependencies
    await createVersionDependencies(newVersion.id, formData.dependencies || []);

    const projectLoaders = aggregateProjectLoaderNames([...project.loaders, ...(formData.loaders || [])]);
    const sortedUniqueGameVersions = aggregateVersions([...project.gameVersions, ...formData.gameVersions]);

    // Save all the files
    await createVersionFiles({
        versionId: newVersion.id,
        projectId: project.id,
        files: [
            ...(formData.additionalFiles || []).map((file) => ({
                file: file,
                isPrimary: false,
                storageService: FILE_STORAGE_SERVICE.LOCAL,
            })),
            {
                file: formData.primaryFile,
                isPrimary: true,
                storageService: FILE_STORAGE_SERVICE.LOCAL,
            },
        ],
    });

    // Update project loaders list and supported game versions
    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            gameVersions: sortedUniqueGameVersions,
            loaders: projectLoaders,
            dateUpdated: new Date(),
        },
    });

    return ctx.json(
        {
            success: true,
            message: "Successfully created new version",
            slug: newVersion.slug,
        },
        status.OK,
    );
};

export const updateVersionData = async (
    ctx: Context,
    projectSlug: string,
    versionSlug: string,
    userSession: ContextUserSession,
    formData: z.infer<typeof updateVersionFormSchema>,
) => {
    const project = await prisma.project.findUnique({
        where: { slug: projectSlug },
        select: {
            id: true,
            loaders: true,
            type: true,
            gameVersions: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: requiredProjectMemberFields,
                    },
                },
            },
            versions: {
                select: {
                    id: true,
                    loaders: true,
                    gameVersions: true,
                    slug: true,
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
        },
    });

    let targetVersion = null;
    for (const version of project?.versions || []) {
        if (version.slug === versionSlug) {
            targetVersion = version;
            break;
        }
    }

    // Return if project or target version not found
    const memberObj = project?.team.members?.[0];
    if (!project?.id || !targetVersion?.id || !memberObj) return ctx.json({ success: false }, status.NOT_FOUND);

    // Check if the user has permission to edit a version
    const canUpdateVersion = doesMemberHaveAccess(
        ProjectPermission.UPLOAD_VERSION,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!canUpdateVersion) {
        await addToUsedApiRateLimit(ctx, UNAUTHORIZED_ACCESS_ATTEMPT_CHARGE);
        return ctx.json({ success: false }, status.NOT_FOUND);
    }

    // Check the validity of loaders
    const allowedLoaders = getLoadersByProjectType(project.type as ProjectType[]).map((loader) => loader.name);
    for (const loader of formData.loaders || []) {
        if (!allowedLoaders.includes(loader)) {
            return ctx.json({ success: false, message: `Loader ${loader} not supported by current project type.` }, status.BAD_REQUEST);
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
            return ctx.json({ success: false, message: "We do not allow upload of duplicate files" }, status.BAD_REQUEST);
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

    // Check it the slug is updated and if it is, check if the new slug is available
    let updatedSlug = formData.versionNumber;
    if (updatedSlug !== targetVersion.slug) {
        let newSlugAvailable = true;
        for (const version of project.versions) {
            if (version.slug === formData.versionNumber) {
                newSlugAvailable = false;
                break;
            }
        }

        if (newSlugAvailable !== true) {
            updatedSlug = targetVersion.id;
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
            slug: updatedSlug,
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

    return ctx.json(
        {
            success: true,
            message: "Version updated successfully",
            data: {
                slug: updatedSlug,
                projectLoadersChanged,
                gameVersionsChanged,
            },
        },
        status.OK,
    );
};

const createVersionDependencies = async (dependentVersionId: string, list: z.infer<typeof VersionDependencies>) => {
    if (!list?.length) return [];

    const projectIds = new Set<string>();
    const versionIds = new Set<string>();

    for (const dependency of list) {
        projectIds.add(dependency.projectId);
        if (dependency.versionId) versionIds.add(dependency.versionId);
    }

    // Get all the projects and versions from database
    const [dependencyProjects, dependencyVersions] = await Promise.all([
        prisma.project.findMany({
            where: {
                id: {
                    in: Array.from(projectIds),
                },
            },
        }),

        prisma.version.findMany({
            where: {
                id: {
                    in: Array.from(versionIds),
                },
            },
        }),
    ]);

    const projectMap = new Map<string, string>();
    const versionMap = new Map<string, string>();
    for (const project of dependencyProjects) {
        // TODO: Add check for projectPublishingStatus after that is implemented
        if (project.visibility === ProjectVisibility.PRIVATE) continue;
        projectMap.set(project.id, project.slug);
    }
    for (const version of dependencyVersions) {
        versionMap.set(version.id, version.slug);
    }

    const addedDependencies: string[] = [];
    const validProjectLevelDependencies: Dependency[] = [];
    const validVersionLevelDependencies: Dependency[] = [];

    for (const dependency of list) {
        if (addedDependencies.includes(dependency.projectId)) continue;
        addedDependencies.push(dependency.projectId);

        if (projectMap.has(dependency.projectId)) {
            // If the dependency is a version level dependency, check if the version exists
            if (dependency.versionId && versionMap.has(dependency.versionId)) {
                validVersionLevelDependencies.push({
                    id: nanoid(STRING_ID_LENGTH),
                    projectId: dependency.projectId,
                    versionId: dependency.versionId,
                    dependencyType: dependency.dependencyType,
                    dependentVersionId,
                });
            }
            // If the dependency is a project level dependency
            else {
                validProjectLevelDependencies.push({
                    id: nanoid(STRING_ID_LENGTH),
                    projectId: dependency.projectId,
                    versionId: null,
                    dependencyType: dependency.dependencyType,
                    dependentVersionId,
                });
            }
        }
    }

    const allDependencies = validProjectLevelDependencies.concat(validVersionLevelDependencies);
    if (allDependencies.length) {
        return await prisma.dependency.createMany({
            data: allDependencies,
        });
    }

    return [];
};

export const getAllProjectVersions = async (
    ctx: Context,
    slug: string,
    userSession: ContextUserSession | undefined,
    featuredOnly = false,
) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
        select: {
            ...requiredProjectFields,
            versions: {
                where: featuredOnly ? { featured: true } : {},
                select: requiredVersionFields,
                orderBy: { datePublished: "desc" },
            },
        },
    });

    if (!project?.id) return ctx.json({ success: false, message: "Project not found" }, status.NOT_FOUND);

    const projectMembersList = [
        ...(project?.team.members || []).map((member) => getFormattedTeamMember(member)),
        // ...(project.organisation?.team.members || []).map((member) => getFormattedTeamMember(member)),
    ];

    if (!isProjectAccessibleToCurrSession(project.visibility, project.status, userSession?.id, projectMembersList)) {
        return ctx.json({ success: false, message: "Project not found" }, status.NOT_FOUND);
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
                url: versionFileUrl(project.slug, version.slug, fileData.name, useDirectCacheCdnUrl, !isProjectPrivate) || "",
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

    return ctx.json({ success: true, data: versionsList }, status.OK);
};

export const getProjectVersionData = async (ctx: Context, projectSlug: string, versionSlug: string, userSession: ContextUserSession) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: projectSlug }, { id: projectSlug }],
        },
        select: {
            ...requiredProjectFields,
            versions: {
                where: {
                    OR: [{ slug: versionSlug }, { id: versionSlug }],
                },
                select: requiredVersionFields,
            },
        },
    });

    const version = project?.versions?.[0];
    if (!project?.id || !version?.id) return ctx.json({ success: false, message: "Project or version not found" }, status.NOT_FOUND);

    const projectMembersList = [
        ...(project?.team.members || []).map((member) => getFormattedTeamMember(member)),
        ...(project.organisation?.team.members || []).map((member) => getFormattedTeamMember(member)),
    ];

    // Check if the project is publically available or is the user a member in the project
    if (!isProjectAccessibleToCurrSession(project.visibility, project.status, userSession?.id, projectMembersList)) {
        return ctx.json({ success: false, message: "Project not found" }, status.NOT_FOUND);
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
            url: versionFileUrl(project.slug, version.slug, fileData.name, useDirectCacheCdnUrl, !isProjectPrivate) || "",
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

    return ctx.json({ success: true, data: versionData }, status.OK);
};

export const deleteProjectVersion = async (ctx: Context, projectSlug: string, versionSlug: string, userSession: ContextUserSession) => {
    const project = await prisma.project.findUnique({
        where: {
            slug: projectSlug,
        },
        select: {
            id: true,
            loaders: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession.id },
                        select: requiredProjectMemberFields,
                    },
                },
            },
            versions: {
                select: {
                    id: true,
                    slug: true,
                    files: true,
                    loaders: true,
                    gameVersions: true,
                },
            },
        },
    });
    let targetVersion = null;
    for (const version of project?.versions || []) {
        if (version.slug === versionSlug || version.id === versionSlug) {
            targetVersion = version;
            break;
        }
    }

    const memberObj = project?.team.members?.[0];
    if (!project?.id || !targetVersion?.id || !memberObj) return ctx.json({ success: false }, status.NOT_FOUND);

    // Check if the user has permission to upload a version
    const canDeleteVersion = doesMemberHaveAccess(
        ProjectPermission.DELETE_VERSION,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!canDeleteVersion) {
        await addToUsedApiRateLimit(ctx, UNAUTHORIZED_ACCESS_ATTEMPT_CHARGE);
        return ctx.json({ success: false }, status.NOT_FOUND);
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
    await deleteVersionStoreDirectory(project.id, targetVersion.id);

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

    return ctx.json({ success: true, message: `Version "${deletedVersion.title}" deleted successfully.` }, status.OK);
};
