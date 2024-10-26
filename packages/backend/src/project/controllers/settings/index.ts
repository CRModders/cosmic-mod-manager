import prisma from "@/services/prisma";
import { deleteDirectory, deleteProjectFile, saveProjectFile } from "@/services/storage";
import { projectFileStoragePath } from "@/services/storage/utils";
import { type ContextUserData, FILE_STORAGE_SERVICE } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData } from "@/utils/http";
import { generateRandomId } from "@/utils/str";
import { STRING_ID_LENGTH } from "@shared/config";
import { doesMemberHaveAccess } from "@shared/lib/utils";
import { getFileType } from "@shared/lib/utils/convertors";
import type { generalProjectSettingsFormSchema } from "@shared/schemas/project/settings/general";
import { ProjectPermission } from "@shared/types";
import { nanoid } from "nanoid";
import type { z } from "zod";
import { projectMemberPermissionsSelect } from "../../queries/project";

export async function updateProject(
    slug: string,
    userSession: ContextUserData,
    formData: z.infer<typeof generalProjectSettingsFormSchema>,
): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            name: true,
            slug: true,
            iconFileId: true,
            ...projectMemberPermissionsSelect({ userId: userSession.id }),
        },
    });
    const currMember = project?.team.members?.[0] || project?.organisation?.team.members?.[0];
    if (!project?.id || !currMember) return { data: { success: false }, status: HTTP_STATUS.NOT_FOUND };

    if (!doesMemberHaveAccess(ProjectPermission.EDIT_DETAILS, currMember.permissions as ProjectPermission[], currMember.isOwner)) {
        return {
            data: { success: false, message: "You don't have the permission to update project details" },
            status: HTTP_STATUS.UNAUTHORIZED,
        };
    }

    // If the project slug has been updated
    if (formData.slug !== project.slug) {
        // Check if the slug is available
        const existingProjectWithSameSlug = await prisma.project.findUnique({
            where: {
                slug: formData.slug,
            },
        });

        if (existingProjectWithSameSlug?.id) return invalidReqestResponseData(`The slug "${formData.slug}" is status: already taken`);
    }

    // Check if the icon was updated
    // If the formdata icon is empty and the project has an icon, delete the icon
    if (!formData.icon && project.iconFileId) {
        await deleteProjectIcon(userSession, project.slug);
    }

    // If the formdata icon is a file, update the project icon
    if (formData.icon instanceof File) {
        await updateProjectIcon(userSession, project.slug, formData.icon);
    }

    const updatedProject = await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            name: formData.name,
            slug: formData.slug,
            type: formData.type,
            visibility: formData.visibility,
            clientSide: formData.clientSide,
            serverSide: formData.serverSide,
            summary: formData.summary,
        },
    });

    return { data: { success: true, message: "Project details updated", slug: updatedProject.slug }, status: HTTP_STATUS.OK };
}

export async function deleteProject(userSession: ContextUserData, slug: string): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
        select: {
            id: true,
            iconFileId: true,
            gallery: true,
            ...projectMemberPermissionsSelect({ userId: userSession.id }),
        },
    });
    const memberObj = project?.team.members?.[0];
    if (!project?.id || !memberObj) return { data: { success: false }, status: HTTP_STATUS.NOT_FOUND };

    // Check if the user has the permission to delete the project
    const hasDeleteAccess = doesMemberHaveAccess(
        ProjectPermission.DELETE_PROJECT,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!hasDeleteAccess) {
        return {
            data: { success: false, message: "You don't have the permission to delete the project" },
            status: HTTP_STATUS.UNAUTHORIZED,
        };
    }

    // Get all the project versions
    const versions = await prisma.version.findMany({
        where: { projectId: project.id },
        include: {
            files: true,
        },
    });
    const versionIds = versions.map((version) => version.id);
    const dbFileIds = versions.flatMap((version) => version.files.map((file) => file.fileId));

    // Delete all the dbFiles
    await prisma.file.deleteMany({
        where: {
            id: {
                in: dbFileIds,
            },
        },
    });

    // ? No need to manually delete the versionFile tables as the version deletion will automatically delete the versionFile tables
    // ? Same for version dependencies

    // Delete all the project versions
    await prisma.version.deleteMany({
        where: {
            id: {
                in: versionIds,
            },
        },
    });

    // Delete the project gallery
    const galleryFileIds = project.gallery.map((file) => file.imageFileId);

    // Delete all the image files
    if (galleryFileIds.length > 0) {
        await prisma.file.deleteMany({
            where: {
                id: {
                    in: galleryFileIds,
                },
            },
        });
    }

    // Delete project icon file
    if (project.iconFileId) {
        await prisma.file.delete({
            where: {
                id: project.iconFileId,
            },
        });
    }

    // Delete the project
    await prisma.project.delete({
        where: {
            id: project.id,
        },
    });

    // Delete the project associated team
    await prisma.team.delete({
        where: {
            id: project.team.id,
        },
    });
    // ? All the teamMember tables will be automatically deleted

    // Delete the project's storage folder
    await deleteDirectory(FILE_STORAGE_SERVICE.LOCAL, projectFileStoragePath(project.id));

    return {
        data: {
            success: true,
            message: "Project deleted",
        },
        status: HTTP_STATUS.OK,
    };
}

export async function updateProjectIcon(userSession: ContextUserData, slug: string, icon: File): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
        select: {
            id: true,
            iconFileId: true,
            ...projectMemberPermissionsSelect({ userId: userSession.id }),
        },
    });
    const memberObj = project?.team.members?.[0];
    if (!project || !memberObj) return { data: { success: false, message: "Project not found" }, status: HTTP_STATUS.NOT_FOUND };

    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!hasEditAccess) {
        return {
            data: { success: false, message: "You don't have the permission to update project icon" },
            status: HTTP_STATUS.UNAUTHORIZED,
        };
    }

    // Delete the previous icon if it exists
    if (project.iconFileId) {
        const deletedDbFile = await prisma.file.delete({ where: { id: project.iconFileId } });
        await deleteProjectFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, project.id, deletedDbFile.name);
    }

    const fileType = await getFileType(icon);
    if (!fileType) return { data: { success: false, message: "Invalid file type" }, status: HTTP_STATUS.BAD_REQUEST };

    const fileName = `${generateRandomId()}.${fileType}`;
    const newFileUrl = await saveProjectFile(FILE_STORAGE_SERVICE.LOCAL, project.id, icon, fileName);

    if (!newFileUrl) return { data: { success: false, message: "Failed to save the icon" }, status: HTTP_STATUS.SERVER_ERROR };
    const newDbFile = await prisma.file.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            name: fileName,
            size: icon.size,
            type: fileType,
            url: newFileUrl,
            storageService: FILE_STORAGE_SERVICE.LOCAL,
        },
    });

    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            iconFileId: newDbFile.id,
        },
    });

    return { data: { success: true, message: "Project icon updated" }, status: HTTP_STATUS.OK };
}

export async function deleteProjectIcon(userSession: ContextUserData, slug: string): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
        select: {
            id: true,
            iconFileId: true,
            ...projectMemberPermissionsSelect({ userId: userSession.id }),
        },
    });
    const memberObj = project?.team.members?.[0];
    if (!project || !memberObj) return notFoundResponseData("Project not found");

    if (!project.iconFileId) return invalidReqestResponseData("Project does not have any icon");

    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!hasEditAccess) {
        return {
            data: { success: false, message: "You don't have the permission to delete project icon" },
            status: HTTP_STATUS.UNAUTHORIZED,
        };
    }

    const deletedDbFile = await prisma.file.delete({ where: { id: project.iconFileId } });
    await deleteProjectFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, project.id, deletedDbFile.name);

    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            iconFileId: null,
        },
    });

    return { data: { success: true, message: "Project icon deleted" }, status: HTTP_STATUS.OK };
}
