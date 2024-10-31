import { addInvalidAuthAttempt } from "@/middleware/rate-limit/invalid-auth-attempt";
import prisma from "@/services/prisma";
import { type ContextUserData, FILE_STORAGE_SERVICE } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData } from "@/utils/http";
import { generateDbId } from "@/utils/str";
import type { Dependency } from "@prisma/client";
import { RESERVED_VERSION_SLUGS } from "@shared/config/reserved";
import { doesMemberHaveAccess, getCurrMember, getLoadersByProjectType } from "@shared/lib/utils";
import { getFileType } from "@shared/lib/utils/convertors";
import { isVersionPrimaryFileValid } from "@shared/lib/validation";
import type { VersionDependencies, newVersionFormSchema } from "@shared/schemas/project/version";
import { ProjectPermission, type ProjectType, ProjectVisibility } from "@shared/types";
import { projectMemberPermissionsSelect } from "@src/project/queries/project";
import { aggregateProjectLoaderNames, aggregateVersions, createVersionFiles, isAnyDuplicateFile } from "@src/project/utils";
import type { Context } from "hono";
import type { z } from "zod";

export async function createNewVersion(
    ctx: Context,
    userSession: ContextUserData,
    projectSlug: string,
    formData: z.infer<typeof newVersionFormSchema>,
): Promise<RouteHandlerResponse> {
    if (!formData?.primaryFile?.name || !(formData.primaryFile instanceof File)) {
        return invalidReqestResponseData("Primary version file is required");
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
            versions: {
                where: { slug: formData.versionNumber },
                select: {
                    id: true,
                    slug: true,
                },
            },
            ...projectMemberPermissionsSelect({ userId: userSession.id }),
        },
    });
    const memberObj = getCurrMember(userSession.id, project?.team.members || [], project?.organisation?.team.members || []);
    if (!project?.id || !memberObj) return notFoundResponseData("Project not found");

    const canUploadVersion = doesMemberHaveAccess(
        ProjectPermission.UPLOAD_VERSION,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    // Check if the user has permission to upload a version
    if (!canUploadVersion) {
        await addInvalidAuthAttempt(ctx);
        return notFoundResponseData("Project not found");
    }

    // Check if the uploaded file is of valid type
    const primaryFileType = await getFileType(formData.primaryFile);
    if (!primaryFileType || !isVersionPrimaryFileValid(project.type as ProjectType[], primaryFileType)) {
        return invalidReqestResponseData("Invalid primary file type");
    }

    // Check the validity of loaders
    const allowedLoaders = getLoadersByProjectType(project.type as ProjectType[]).map((loader) => loader.name);
    for (const loader of formData.loaders || []) {
        if (!allowedLoaders.includes(loader)) {
            return invalidReqestResponseData(`Loader ${loader} not supported by current project type.`);
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
        return invalidReqestResponseData("Duplicate files are not allowed");
    }

    // Just to make sure that no version already exists with the same urlSlug or the urlSlug is a reserved slug
    const newUrlSlug =
        project.versions?.[0]?.id || RESERVED_VERSION_SLUGS.includes(formData.versionNumber.toLowerCase()) ? null : formData.versionNumber;

    let newVersion = await prisma.version.create({
        data: {
            id: generateDbId(),
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

    return {
        data: {
            success: true,
            message: "Successfully created new version",
            slug: newVersion.slug,
        },
        status: HTTP_STATUS.OK,
    };
}

export const createVersionDependencies = async (dependentVersionId: string, list: z.infer<typeof VersionDependencies>) => {
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
        if (
            project.visibility === ProjectVisibility.PRIVATE
            // TODO: Add check for projectPublishingStatus after that is implemented
            // || project.status !== ProjectPublishingStatus.PUBLISHED
        )
            continue;
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
                    id: generateDbId(),
                    projectId: dependency.projectId,
                    versionId: dependency.versionId,
                    dependencyType: dependency.dependencyType,
                    dependentVersionId,
                });
            }
            // If the dependency is a project level dependency
            else {
                validProjectLevelDependencies.push({
                    id: generateDbId(),
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
