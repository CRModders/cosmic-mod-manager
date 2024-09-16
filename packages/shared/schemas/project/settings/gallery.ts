import { z } from "zod";
import { MAX_PROJECT_GALLERY_IMAGE_SIZE } from "../../../config/forms";
import { getFileType } from "../../../lib/utils/convertors";
import { FileType } from "../../../types";

export const addNewGalleryImageFormSchema = z.object({
    image: z
        .instanceof(File)
        .refine(
            (file) => {
                if (file instanceof File) {
                    if (file.size > MAX_PROJECT_GALLERY_IMAGE_SIZE) return false;
                }
                return true;
            },
            { message: `Gallery image can only be a maximum of ${MAX_PROJECT_GALLERY_IMAGE_SIZE / 1024} KiB` },
        )
        .refine(
            async (file) => {
                if (file instanceof File) {
                    const type = await getFileType(file);
                    if (!type || ![FileType.JPEG, FileType.PNG, FileType.WEBP].includes(type)) {
                        return false;
                    }
                }

                return true;
            },
            { message: "Invalid file type! Only jpeg, webp and png files allowed" },
        ),

    title: z.string().min(2).max(32),
    description: z.string().max(256).optional(),
    orderIndex: z.number().min(0),
    featured: z.boolean(),
});

export const updateGalleryImageFormSchema = z.object({
    title: z.string().min(2).max(32),
    description: z.string().max(256).optional(),
    orderIndex: z.number().min(0),
    featured: z.boolean(),
});
