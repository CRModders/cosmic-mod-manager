import { type ContextUserSession, FILE_STORAGE_SERVICES } from "@/../types";
import { addToUsedRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { saveProjectVersionFile } from "@/services/storage";
import { isProjectAccessibleToCurrSession } from "@/utils";
import httpCode from "@/utils/http";
import { STRING_ID_LENGTH } from "@shared/config";
import { CHARGE_FOR_SENDING_INVALID_DATA, UNAUTHORIZED_ACCESS_ATTEMPT_CHARGE } from "@shared/config/rate-limit-charges";
import { RESERVED_VERSION_SLUGS } from "@shared/config/reserved";
import { getFileType } from "@shared/lib/utils/convertors";
import { isVersionPrimaryFileValid } from "@shared/lib/validation";
import type { newVersionFormSchema } from "@shared/schemas/project";
import { type DependencyType, ProjectPermissions, type ProjectType } from "@shared/types";
import type { DBFileData, ProjectVersionData, TeamMember, VersionFile } from "@shared/types/api";
import type { Context } from "hono";
import { nanoid } from "nanoid";
import type { z } from "zod";
import { getFormattedTeamMember, requiredProjectMemberFields } from "./project";

const requiredVersionFields = {
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
                    type: true,
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
            type: true,
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
            versions: {
                where: {
                    slug: formData.versionNumber,
                },
                select: {
                    id: true,
                },
            },
        },
    });
    if (!project?.id) return ctx.json({ success: false }, httpCode("not_found"));

    // Check if the user has permission to uplaod a version
    const organisationMembers = project.organisation?.team?.members;
    let hasPermissionToUploadVersion = false;

    // Check for permission in the organisation
    if (organisationMembers && (organisationMembers?.length || 0) > 0) {
        for (const member of organisationMembers) {
            if (member.user.id === userSession.id) {
                if (member.permissions.includes(ProjectPermissions.UPLOAD_VERSION)) {
                    hasPermissionToUploadVersion = true;
                    break;
                }
            }
        }
    }

    // Check for permission on project level
    if (!hasPermissionToUploadVersion && project.team.members) {
        for (const member of project.team.members) {
            if (member.user.id === userSession.id) {
                if (member.permissions.includes(ProjectPermissions.UPLOAD_VERSION)) {
                    hasPermissionToUploadVersion = true;
                    break;
                }
            }
        }
    }

    if (!hasPermissionToUploadVersion) {
        await addToUsedRateLimit(ctx, UNAUTHORIZED_ACCESS_ATTEMPT_CHARGE);
        return ctx.json({ success: false, message: "You don't have the permission to upload a version in this project" });
    }

    const primaryFileType = getFileType(formData.primaryFile.type);
    if (!primaryFileType || !isVersionPrimaryFileValid(primaryFileType, project.type)) {
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
            featured: false,
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

    // Save all the files

    const savedPrimaryFile = createVersionFile(formData.primaryFile, newVersion.id, project.id, FILE_STORAGE_SERVICES.LOCAL, true);

    const additionalFiles: File[] = [];
    for (const additionalFile of formData?.additionalFiles || []) {
        if (additionalFile instanceof File) {
            additionalFiles.push(additionalFile);
        }
    }
    const savedAdditionalFiles = createVersionFiles({
        files: additionalFiles,
        versionId: newVersion.id,
        projectId: project.id,
        storageService: FILE_STORAGE_SERVICES.LOCAL,
    });

    await Promise.all([savedPrimaryFile, savedAdditionalFiles]);

    return ctx.json(
        {
            success: true,
            message: "Successfully created new version",
            urlSlug: newVersion.slug,
        },
        httpCode("ok"),
    );
};

interface CreateVersionFileProps {
    files: File[];
    versionId: string;
    projectId: string;
    storageService: FILE_STORAGE_SERVICES;
    isPrimary?: boolean;
}

const createVersionFiles = async ({ files, versionId, projectId, storageService, isPrimary }: CreateVersionFileProps) => {
    const promises = [];
    for (const file of files) {
        promises.push(createVersionFile(file, versionId, projectId, storageService, isPrimary === true));
    }

    return await Promise.all(promises);
};

const createVersionFile = async (
    file: File,
    versionId: string,
    projectId: string,
    storageService: FILE_STORAGE_SERVICES,
    isPrimaryFile = false,
) => {
    const fileType = getFileType(file.type);
    if (!fileType) return null;

    const savedPath = await saveProjectVersionFile(projectId, versionId, file.name, storageService, file);
    if (!savedPath?.path) return null;

    const dbFile = await prisma.file.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            name: file.name,
            type: fileType,
            size: file.size,
            storageService: storageService,
            url: savedPath.path,
        },
    });

    await prisma.versionFile.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            versionId: versionId,
            isPrimary: isPrimaryFile,
            fileId: dbFile.id,
        },
    });
};

export const getAllProjectVersions = async (
    ctx: Context,
    slug: string,
    userSession: ContextUserSession | undefined,
    featuredOnly = false,
) => {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
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
    const versionFilesMap = await getVersionFilesData(idsList);

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
            releaseChannel: version.releaseChannel,
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
                    type: dependency.dependencyProject.type as ProjectType[],
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

const getVersionFilesData = async (idsList: string[]) => {
    const files = await prisma.file.findMany({
        where: {
            OR: idsList.map((id) => ({ id })),
        },
    });

    const map = new Map<string, DBFileData>();
    for (const file of files) {
        map.set(file.id, file);
    }

    return map;
};
