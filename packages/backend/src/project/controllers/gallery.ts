import prisma from "@/services/prisma";
import { deleteProjectGalleryFile, saveProjectGalleryFile } from "@/services/storage";
import { type ContextUserData, FILE_STORAGE_SERVICE } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import {
    HTTP_STATUS,
    invalidReqestResponseData,
    notFoundResponseData,
    serverErrorResponseData,
    unauthorizedReqResponseData,
} from "@/utils/http";
import { STRING_ID_LENGTH } from "@shared/config";
import { doesMemberHaveAccess } from "@shared/lib/utils";
import { getFileType } from "@shared/lib/utils/convertors";
import type { addNewGalleryImageFormSchema, updateGalleryImageFormSchema } from "@shared/schemas/project/settings/gallery";
import { ProjectPermission } from "@shared/types";
import { nanoid } from "nanoid";
import type { z } from "zod";
import { projectMemberPermissionsSelect } from "../queries/project";

export async function addNewGalleryImage(
    slug: string,
    userSession: ContextUserData,
    formData: z.infer<typeof addNewGalleryImageFormSchema>,
): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            gallery: {
                select: {
                    id: true,
                    orderIndex: true,
                },
                orderBy: { orderIndex: "desc" },
            },
            ...projectMemberPermissionsSelect({ userId: userSession.id }),
        },
    });

    if (!project?.id) return notFoundResponseData();

    // Check if the order index is not already occupied
    for (const item of project.gallery) {
        if (item.orderIndex === formData.orderIndex) {
            return invalidReqestResponseData("An image with same order index already exists");
        }
    }

    // Check if the user has the required permissions
    const memberObj = project.team.members?.[0] || project.organisation?.team.members?.[0];
    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!memberObj || !hasEditAccess) {
        return { data: { success: false }, status: HTTP_STATUS.UNAUTHORIZED };
    }

    // Check if there's already a featured image
    if (formData.featured === true) {
        const existingFeaturedImage = await prisma.galleryItem.findFirst({
            where: {
                projectId: project.id,
                featured: true,
            },
        });

        if (existingFeaturedImage?.id) {
            return invalidReqestResponseData("A featured gallery image already exists");
        }
    }

    const fileType = await getFileType(formData.image);
    const fileName = `${nanoid(STRING_ID_LENGTH)}.${fileType}`;
    const fileUrl = await saveProjectGalleryFile(FILE_STORAGE_SERVICE.LOCAL, project.id, formData.image, fileName);

    if (!fileUrl) return serverErrorResponseData("Failed to upload the image");

    // Create the generic file entry in the database
    const dbFile = await prisma.file.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            name: fileName,
            size: formData.image.size,
            type: (await getFileType(formData.image)) || "",
            url: fileUrl || "",
            storageService: FILE_STORAGE_SERVICE.LOCAL,
        },
    });

    // Create the gallery item
    await prisma.galleryItem.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            projectId: project.id,
            name: formData.title,
            description: formData.description || "",
            featured: formData.featured,
            imageFileId: dbFile.id,
            orderIndex: formData.orderIndex || project.gallery?.[0]?.orderIndex + 1 || 1,
        },
    });

    return { data: { success: true, message: "Added the new gallery image" }, status: HTTP_STATUS.OK };
}

export async function removeGalleryImage(slug: string, userSession: ContextUserData, galleryItemId: string): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            gallery: {
                where: { id: galleryItemId },
                select: {
                    id: true,
                    imageFileId: true,
                },
            },
            ...projectMemberPermissionsSelect({ userId: userSession.id }),
        },
    });
    if (!project?.id || !project.gallery?.[0]?.id) return notFoundResponseData();

    const currMember = project.team.members?.[0] || project.organisation?.team.members?.[0];
    if (
        !currMember ||
        !doesMemberHaveAccess(ProjectPermission.EDIT_DETAILS, currMember.permissions as ProjectPermission[], currMember.isOwner)
    ) {
        return unauthorizedReqResponseData();
    }

    // Delete gallery item from database
    await prisma.galleryItem.delete({
        where: { id: galleryItemId },
    });

    // Delete the file from database
    const deletedDbFile = await prisma.file.delete({
        where: {
            id: project.gallery[0].imageFileId,
        },
    });

    // Delete the file from storage
    await deleteProjectGalleryFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, project.id, deletedDbFile.name);

    return { data: { success: true, message: "Gallery image deleted" }, status: HTTP_STATUS.OK };
}

export async function updateGalleryImage(
    slug: string,
    userSession: ContextUserData,
    galleryItemId: string,
    formData: z.infer<typeof updateGalleryImageFormSchema>,
): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findUnique({
        where: { slug: slug },
        select: {
            id: true,
            gallery: {
                select: {
                    id: true,
                    orderIndex: true,
                },
                orderBy: { orderIndex: "desc" },
            },
            ...projectMemberPermissionsSelect({ userId: userSession.id }),
        },
    });

    if (!project?.id) return notFoundResponseData();

    // Check if the order index is not already occupied
    for (const item of project.gallery) {
        if (item.id === galleryItemId) continue;
        if (item.id !== galleryItemId && item.orderIndex === formData.orderIndex) {
            return invalidReqestResponseData("An image with same order index already exists");
        }
    }

    const memberObj = project.team.members?.[0];
    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj.permissions as ProjectPermission[],
        memberObj.isOwner,
    );
    if (!memberObj || !hasEditAccess) {
        return notFoundResponseData();
    }

    // Check if there's already a featured image
    if (formData.featured === true) {
        const existingFeaturedImage = await prisma.galleryItem.findFirst({
            where: {
                projectId: project.id,
                featured: true,
                id: {
                    not: galleryItemId,
                },
            },
        });

        if (existingFeaturedImage?.id) return invalidReqestResponseData("A featured gallery image already exists");
    }

    await prisma.galleryItem.update({
        where: {
            id: galleryItemId,
            projectId: project.id,
        },
        data: {
            name: formData.title,
            description: formData.description || "",
            orderIndex: formData.orderIndex,
            featured: formData.featured,
        },
    });

    return { data: { success: true, message: "Image updated" }, status: HTTP_STATUS.OK };
}
