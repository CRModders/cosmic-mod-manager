import { GALLERY_IMG_THUMBNAIL_WIDTH, MAX_PROJECT_GALLERY_IMAGES_COUNT } from "@app/utils/config/constants";
import { getFileType } from "@app/utils/convertors";
import { doesMemberHaveAccess, getCurrMember } from "@app/utils/project";
import type { addNewGalleryImageFormSchema, updateGalleryImageFormSchema } from "@app/utils/schemas/project/settings/gallery";
import { FileType, ProjectPermission } from "@app/utils/types";
import type { z } from "zod";
import { CreateManyFiles, DeleteFile_ByID } from "~/db/file_item";
import { CreateGalleryItem, DeleteGalleryItem, UpdateGalleryItem } from "~/db/gallery_item";
import { GetProject_Details } from "~/db/project_item";
import { deleteProjectGalleryFile, saveProjectGalleryFile } from "~/services/storage";
import { type ContextUserData, FILE_STORAGE_SERVICE } from "~/types";
import {
    HTTP_STATUS,
    invalidReqestResponseData,
    notFoundResponseData,
    serverErrorResponseData,
    unauthorizedReqResponseData,
} from "~/utils/http";
import { ConvertToWebp, resizeImageToWebp } from "~/utils/images";
import { generateDbId } from "~/utils/str";

export async function addNewGalleryImage(
    slug: string,
    userSession: ContextUserData,
    formData: z.infer<typeof addNewGalleryImageFormSchema>,
) {
    const Project = await GetProject_Details(slug, slug);
    if (!Project?.id) return notFoundResponseData();
    if (Project.gallery.length >= MAX_PROJECT_GALLERY_IMAGES_COUNT)
        return invalidReqestResponseData(`Maximum of ${MAX_PROJECT_GALLERY_IMAGES_COUNT} gallery images allowed!`);

    // Check if the order index is not already occupied
    for (const item of Project.gallery) {
        if (item.orderIndex === formData.orderIndex) {
            return invalidReqestResponseData("An image with same order index already exists");
        }
    }

    // Check if the user has the required permissions
    const memberObj = getCurrMember(userSession.id, Project.team.members, Project.organisation?.team?.members || []);
    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj?.permissions as ProjectPermission[],
        memberObj?.isOwner,
        userSession.role,
    );
    if (!hasEditAccess) {
        return unauthorizedReqResponseData();
    }

    // Check if there's already a featured image
    if (formData.featured === true) {
        const ExistingFeaturedImage = Project.gallery.some((item) => item.featured === true);
        if (ExistingFeaturedImage) return invalidReqestResponseData("A featured gallery image already exists");
    }

    const storageService = FILE_STORAGE_SERVICE.LOCAL;
    const rawFile_Type = (await getFileType(formData.image)) || FileType.PNG;

    // Save the thumbnail image
    const thumbnailFileType = FileType.WEBP;
    const thumbnailImg = await resizeImageToWebp(formData.image, rawFile_Type, {
        width: GALLERY_IMG_THUMBNAIL_WIDTH,
        fit: "contain",
        withoutEnlargement: true,
    });
    const thumbnailFileId = `${generateDbId()}_${GALLERY_IMG_THUMBNAIL_WIDTH}.${thumbnailFileType}`;
    const thumbnailFile_Url = await saveProjectGalleryFile(storageService, Project.id, thumbnailImg, thumbnailFileId);

    // Save the raw gallery file
    const savedRawFile_Type = FileType.WEBP;
    const rawFile_webp = await ConvertToWebp(formData.image, rawFile_Type);

    const rawFile_Id = `${generateDbId()}.${savedRawFile_Type}`;
    const rawFile_Url = await saveProjectGalleryFile(storageService, Project.id, rawFile_webp, rawFile_Id);

    if (!rawFile_Url || !thumbnailFile_Url) return serverErrorResponseData("Failed to upload the image");

    const imageFiles = [
        {
            id: rawFile_Id,
            name: rawFile_Id,
            size: rawFile_webp.size,
            type: savedRawFile_Type,
            url: rawFile_Url,
            storageService: storageService,
        },
        {
            id: thumbnailFileId,
            name: thumbnailFileId,
            size: thumbnailImg.size,
            type: thumbnailFileType,
            url: thumbnailFile_Url,
            storageService: storageService,
        },
    ];

    await CreateManyFiles({
        data: imageFiles,
    });

    // Create the gallery item
    await CreateGalleryItem({
        data: {
            id: generateDbId(),
            projectId: Project.id,
            name: formData.title,
            description: formData.description || "",
            featured: formData.featured,
            imageFileId: rawFile_Id,
            thumbnailFileId: thumbnailFileId,
            orderIndex: formData.orderIndex || (Project.gallery?.[0]?.orderIndex || 0) + 1,
        },
    });

    return { data: { success: true, message: "Added the new gallery image" }, status: HTTP_STATUS.OK };
}

export async function removeGalleryImage(slug: string, userSession: ContextUserData, galleryItemId: string) {
    const project = await GetProject_Details(slug, slug);
    if (!project?.id) return notFoundResponseData();

    const galleryItem = project.gallery.find((item) => item.id === galleryItemId);
    if (!galleryItem) return notFoundResponseData();

    const currMember = getCurrMember(userSession.id, project.team.members, project.organisation?.team.members || []);
    if (
        !doesMemberHaveAccess(
            ProjectPermission.EDIT_DETAILS,
            currMember?.permissions as ProjectPermission[],
            currMember?.isOwner,
            userSession.role,
        )
    ) {
        return unauthorizedReqResponseData();
    }

    // Delete gallery item from database
    await DeleteGalleryItem({
        where: { id: galleryItemId },
    });

    const filesToDelete = [galleryItem.imageFileId];
    if (galleryItem.thumbnailFileId) filesToDelete.push(galleryItem.thumbnailFileId);

    for (const fileId of filesToDelete) {
        // Delete the file from database
        const deletedDbFile = await DeleteFile_ByID(fileId);

        // Delete the file from storage
        await deleteProjectGalleryFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, project.id, deletedDbFile.name);
    }

    return { data: { success: true, message: "Gallery image deleted" }, status: HTTP_STATUS.OK };
}

export async function updateGalleryImage(
    slug: string,
    userSession: ContextUserData,
    galleryItemId: string,
    formData: z.infer<typeof updateGalleryImageFormSchema>,
) {
    const project = await GetProject_Details(slug, slug);
    if (!project?.id) return notFoundResponseData();

    // Check if the order index is not already occupied
    for (const item of project.gallery) {
        if (item.id === galleryItemId) continue;
        if (item.id !== galleryItemId && item.orderIndex === formData.orderIndex) {
            return invalidReqestResponseData("An image with same order index already exists");
        }
    }

    const memberObj = getCurrMember(userSession.id, project.team.members, project.organisation?.team.members || []);
    if (
        !doesMemberHaveAccess(
            ProjectPermission.EDIT_DETAILS,
            memberObj?.permissions as ProjectPermission[],
            memberObj?.isOwner,
            userSession.role,
        )
    ) {
        return notFoundResponseData();
    }

    // Check if there's already a featured image
    if (formData.featured === true) {
        const ExistingFeaturedImage = project.gallery.some((item) => item.featured === true && item.id !== galleryItemId);
        if (ExistingFeaturedImage) return invalidReqestResponseData("A featured gallery image already exists");
    }

    await UpdateGalleryItem({
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
