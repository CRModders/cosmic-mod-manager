import { type ContextUserSession, FILE_STORAGE_SERVICES } from "@/../types";
import { addToUsedRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { deleteFile, getProjectVersionStoragePath } from "@/services/storage";
import { aggregateProjectLoaderNames, aggregateVersions, inferProjectType, isProjectAccessibleToCurrSession } from "@/utils";
import httpCode from "@/utils/http";
import { versionFileUrl } from "@/utils/urls";
import type { File as DBFile } from "@prisma/client";
import { STRING_ID_LENGTH } from "@shared/config";
import { CHARGE_FOR_SENDING_INVALID_DATA, UNAUTHORIZED_ACCESS_ATTEMPT_CHARGE } from "@shared/config/rate-limit-charges";
import { RESERVED_VERSION_SLUGS } from "@shared/config/reserved";
import { getFileType } from "@shared/lib/utils/convertors";
import { isVersionPrimaryFileValid } from "@shared/lib/validation";
import type { newVersionFormSchema, updateVersionFormSchema } from "@shared/schemas/project";
import { type DependencyType, ProjectPermissions, type ProjectType, type VersionReleaseChannel } from "@shared/types";
import type { ProjectVersionData, TeamMember, VersionFile } from "@shared/types/api";
import type { Context } from "hono";
import { nanoid } from "nanoid";
import type { z } from "zod";
import { getFormattedTeamMember, requiredProjectMemberFields } from "./project";
import { createVersionFile, createVersionFiles, deleteVersionFiles, deleteVersionStoreDirectory, retrieveVersionFilesData } from "./utils";

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
    dependencies: {
        select: {
            id: true,
            dependencyType: true,
            dependencyProject: {
                select: {
                    id: true,
                    name: true,
                    icon: true,
                    slug: true,
                    loaders: true,
                    gameVersions: true,
                },
            },
            dependencyVersion: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    versionNumber: true,
                    loaders: true,
                    gameVersions: true,
                },
            },
        },
    },
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
        await addToUsedRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
        return ctx.json({ success: false, message: "Primary version file is required" });
    }

    const project = await prisma.project.findUnique({
        where: {
            slug: projectSlug,
        },
        select: {
            id: true,
            loaders: true,
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
    if (!project?.id) return ctx.json({ success: false }, httpCode("not_found"));

    // Check if the user has permission to upload a version
    if (
        !project.team.members?.[0]?.permissions?.includes(ProjectPermissions.UPLOAD_VERSION) &&
        !project.organisation?.team?.members?.[0]?.permissions?.includes(ProjectPermissions.UPLOAD_VERSION)
    ) {
        await addToUsedRateLimit(ctx, UNAUTHORIZED_ACCESS_ATTEMPT_CHARGE);
        return ctx.json({ success: false }, httpCode("not_found"));
    }

    // Check if the uploaded file is of valid type
    const primaryFileType = getFileType(formData.primaryFile.type);
    if (!primaryFileType || !isVersionPrimaryFileValid(primaryFileType, inferProjectType([...project.loaders, ...formData.loaders]))) {
        await addToUsedRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
        return ctx.json({ success: false, message: "Invalid primary file type" });
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
            loaders: formData.loaders,
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

    const projectLoaders = aggregateProjectLoaderNames([...project.loaders, ...formData.loaders]);
    const sortedUniqueGameVersions = aggregateVersions([...project.gameVersions, ...formData.gameVersions]);

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

    // Save all the files
    const savedPrimaryFile = createVersionFile(formData.primaryFile, newVersion.id, project.id, FILE_STORAGE_SERVICES.LOCAL, true);

    const savedAdditionalFiles = createVersionFiles({
        files: formData.additionalFiles || [],
        versionId: newVersion.id,
        projectId: project.id,
        storageService: FILE_STORAGE_SERVICES.LOCAL,
    });

    await Promise.all([savedPrimaryFile, savedAdditionalFiles]);

    return ctx.json(
        {
            success: true,
            message: "Successfully created new version",
            slug: newVersion.slug,
        },
        httpCode("ok"),
    );
};

export const updateVersionData = async (ctx: Context, projectSlug: string, versionSlug: string, userSession: ContextUserSession, formData: z.infer<typeof updateVersionFormSchema>) => {
    const project = await prisma.project.findUnique({
        where: { slug: projectSlug },
        select: {
            id: true,
            loaders: true,
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
                        }
                    }
                }
            }
        }
    });

    let targetVersion = null;
    for (const version of (project?.versions || [])) {
        if (version.slug === versionSlug) {
            targetVersion = version;
            break;
        }
    };

    // Return if project or target version not found
    if (!project?.id || !targetVersion?.id) return ctx.json({ success: false }, httpCode("not_found"));

    // Check if the user has permission to edit a version
    if (
        !project.team.members?.[0]?.permissions?.includes(ProjectPermissions.UPLOAD_VERSION) &&
        !project.organisation?.team?.members?.[0]?.permissions?.includes(ProjectPermissions.UPLOAD_VERSION)
    ) {
        await addToUsedRateLimit(ctx, UNAUTHORIZED_ACCESS_ATTEMPT_CHARGE);
        return ctx.json({ success: false }, httpCode("not_found"));
    };

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
        };

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
            const dbFiles = await retrieveVersionFilesData(deletedFileList);
            const deletedFilesData: DBFile[] = [];
            for (const deletedFile of deletedFileList) {
                const dbFile = dbFiles.get(deletedFile);
                if (dbFile) deletedFilesData.push(dbFile);
            }

            await deleteVersionFiles(project.id, targetVersion.id, deletedFilesData);
        };

        // Save the new files
        if (newAdditionalFiles.length) {
            await createVersionFiles({
                files: newAdditionalFiles,
                versionId: targetVersion.id,
                projectId: project.id,
                storageService: FILE_STORAGE_SERVICES.LOCAL,
            });
        }
    };

    // Check it the slug is updated and if it is, check if the new slug is available
    let updatedSlug = formData.versionNumber;
    if (updatedSlug !== targetVersion.slug) {
        let newSlugAvailable = true;
        for (const version of project.versions) {
            if (version.slug === formData.versionNumber) {
                newSlugAvailable = false;
                break;
            }
        };

        if (newSlugAvailable !== true) {
            updatedSlug = targetVersion.id;
        }
    };

    // Re evaluate the project loaders list and supported game versions
    const projectLoaders: string[] = [];
    const projectGameVersions: string[] = [];

    for (const version of project.versions) {
        // Exclude the target version from the list, instead use the new data
        if (version.id === targetVersion.id) {
            projectLoaders.push(...formData.loaders);
            projectGameVersions.push(...formData.gameVersions);
            continue;
        };
        projectLoaders.push(...version.loaders);
        projectGameVersions.push(...version.gameVersions);
    };

    const aggregatedLoaderNames = aggregateProjectLoaderNames(projectLoaders);
    const aggregatedGameVersions = aggregateVersions(projectGameVersions);


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
            loaders: formData.loaders,
        },
    });

    // Update project loaders list and supported game versions
    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            gameVersions: aggregatedGameVersions,
            loaders: aggregatedLoaderNames
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
    };

    for (const gameVersion of project.gameVersions) {
        if (!aggregatedGameVersions.includes(gameVersion)) {
            gameVersionsChanged = true;
            break;
        }
    };

    return ctx.json({
        success: true, message: "Version updated successfully", data: {
            slug: updatedSlug,
            projectLoadersChanged,
            gameVersionsChanged
        }
    }, httpCode("ok"));
}

export const getAllProjectVersions = async (
    ctx: Context,
    slug: string,
    userSession: ContextUserSession | undefined,
    featuredOnly = false,
) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            ...requiredProjectFields,
            versions: {
                where: featuredOnly ? { featured: true } : {},
                select: requiredVersionFields,
                orderBy: { datePublished: "desc" },
            },
        },
    });

    if (!project?.id) return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));

    const projectMembersList = [
        ...(project?.team.members || []).map((member) => getFormattedTeamMember(member)),
        ...(project.organisation?.team.members || []).map((member) => getFormattedTeamMember(member)),
    ];

    if (!isProjectAccessibleToCurrSession(project.visibility, project.status, userSession?.id, projectMembersList)) {
        return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));
    }

    // Get all the filesData for each version
    const idsList = [];
    for (const version of project.versions) {
        for (const file of version.files) {
            idsList.push(file.fileId);
        }
    }
    const versionFilesMap = await retrieveVersionFilesData(idsList);

    const versionsList: ProjectVersionData[] = [];
    for (const version of project.versions) {
        let primaryFile: VersionFile | null = null;
        const files: VersionFile[] = [];

        for (const file of version.files) {
            const fileData = versionFilesMap.get(file.fileId);
            if (!fileData?.id) continue;

            const formattedFile = {
                id: file.id,
                isPrimary: file.isPrimary,
                name: fileData.name,
                size: fileData.size,
                type: fileData.type,
                url: versionFileUrl(project.slug, version.slug, fileData.name),
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
            datePublished: version.datePublished.toString(),
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
                dependencyType: dependency.dependencyType as DependencyType,
                project: {
                    id: dependency.dependencyProject.id,
                    name: dependency.dependencyProject.name,
                    slug: dependency.dependencyProject.slug,
                    type: inferProjectType(dependency.dependencyProject.loaders) as ProjectType[],
                    loaders: dependency.dependencyProject.loaders,
                    gameVersions: dependency.dependencyProject.gameVersions,
                },
                version: dependency.dependencyVersion?.id
                    ? {
                        id: dependency.dependencyVersion.id,
                        title: dependency.dependencyVersion.title,
                        versionNumber: dependency.dependencyVersion.versionNumber,
                        slug: dependency.dependencyVersion.slug,
                        loaders: dependency.dependencyVersion.loaders,
                        gameVersions: dependency.dependencyVersion.gameVersions,
                    }
                    : null,
            })),
        });
    }

    return ctx.json({ success: true, data: versionsList }, httpCode("ok"));
};


export const getProjectVersionData = async (ctx: Context, projectSlug: string, versionSlug: string, userSession: ContextUserSession) => {
    const project = await prisma.project.findUnique({
        where: {
            slug: projectSlug,
        },
        select: {
            ...requiredProjectFields,
            versions: {
                where: { slug: versionSlug },
                select: requiredVersionFields,
            },
        },
    });

    const version = project?.versions?.[0];
    if (!project?.id || !version?.id) return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));

    const projectMembersList = [
        ...(project?.team.members || []).map((member) => getFormattedTeamMember(member)),
        ...(project.organisation?.team.members || []).map((member) => getFormattedTeamMember(member)),
    ];

    // Check if the project is publically available or is the user a member in the project
    if (!isProjectAccessibleToCurrSession(project.visibility, project.status, userSession?.id, projectMembersList)) {
        return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));
    }

    // Get all the filesData for each version
    const idsList = [];
    for (const file of version.files) {
        idsList.push(file.fileId);
    }
    const versionFilesMap = await retrieveVersionFilesData(idsList);

    // Format the data
    let primaryFile: VersionFile | null = null;
    const files: VersionFile[] = [];

    // Get formatted files data
    for (const file of version.files) {
        const fileData = versionFilesMap.get(file.fileId);
        if (!fileData?.id) continue;

        const formattedFile = {
            id: file.id,
            isPrimary: file.isPrimary,
            name: fileData.name,
            size: fileData.size,
            type: fileData.type,
            url: versionFileUrl(project.slug, version.slug, fileData.name),
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
        datePublished: version.datePublished.toString(),
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
            dependencyType: dependency.dependencyType as DependencyType,
            project: {
                id: dependency.dependencyProject.id,
                name: dependency.dependencyProject.name,
                slug: dependency.dependencyProject.slug,
                type: inferProjectType(dependency.dependencyProject.loaders) as ProjectType[],
                loaders: dependency.dependencyProject.loaders,
                gameVersions: dependency.dependencyProject.gameVersions,
            },
            version: dependency.dependencyVersion?.id
                ? {
                    id: dependency.dependencyVersion.id,
                    title: dependency.dependencyVersion.title,
                    versionNumber: dependency.dependencyVersion.versionNumber,
                    slug: dependency.dependencyVersion.slug,
                    loaders: dependency.dependencyVersion.loaders,
                    gameVersions: dependency.dependencyVersion.gameVersions,
                }
                : null,
        })),
    };

    return ctx.json({ success: true, data: versionData }, httpCode("ok"));
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
                where: { slug: versionSlug },
                select: {
                    id: true,
                    files: true,
                },
            },
        },
    });
    if (!project?.id || !project.versions?.[0]?.id) return ctx.json({ success: false }, httpCode("not_found"));

    // Check if the user has permission to upload a version
    if (
        !project.team.members?.[0]?.permissions?.includes(ProjectPermissions.DELETE_VERSION) &&
        !project.organisation?.team?.members?.[0]?.permissions?.includes(ProjectPermissions.DELETE_VERSION)
    ) {
        await addToUsedRateLimit(ctx, UNAUTHORIZED_ACCESS_ATTEMPT_CHARGE);
        return ctx.json({ success: false }, httpCode("not_found"));
    }

    const version = project.versions[0];
    const filesData = await prisma.file.findMany({
        where: {
            OR: version.files.map((file) => ({ id: file.fileId })),
        },
    });

    // Delete all the files
    for (const file of filesData) {
        const filePath = `${getProjectVersionStoragePath(project.id, version.id)}/${file.name}`;
        await deleteFile(filePath, file.storageService as FILE_STORAGE_SERVICES);
    };

    // Delete the version directory
    await deleteVersionStoreDirectory(project.id, version.id);

    const deletedVersion = await prisma.version.delete({
        where: {
            id: version.id,
        },
    });

    return ctx.json({ success: true, message: `Version "${deletedVersion.title}" deleted successfully.` }, httpCode("ok"));
};
