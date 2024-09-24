import { z } from "zod";
import { ProjectSlugField, ProjectTypeField } from "..";
import { MAX_PROJECT_ICON_SIZE, MAX_PROJECT_NAME_LENGTH, MAX_PROJECT_SUMMARY_LENGTH, MIN_PROJECT_NAME_LENGTH } from "../../../config/forms";
import { getFileType } from "../../../lib/utils/convertors";
import { isImageFile } from "../../../lib/validation";
import { ProjectSupport, ProjectVisibility } from "../../../types";

export const generalProjectSettingsFormSchema = z.object({
    icon: z
        .instanceof(File)
        .refine(
            (file) => {
                if (file instanceof File) {
                    if (file.size > MAX_PROJECT_ICON_SIZE) return false;
                }
                return true;
            },
            { message: `Icon can only be a maximum of ${MAX_PROJECT_ICON_SIZE / 1024} KiB` },
        )
        .refine(
            async (file) => {
                if (file instanceof File) {
                    const type = await getFileType(file);
                    if (!type || !isImageFile(type)) {
                        return false;
                    }
                }

                return true;
            },
            { message: "Invalid file type, only image files allowed" },
        )
        .or(z.string())
        .optional(),

    name: z.string().min(MIN_PROJECT_NAME_LENGTH).max(MAX_PROJECT_NAME_LENGTH),
    slug: ProjectSlugField,
    type: ProjectTypeField,
    visibility: z.nativeEnum(ProjectVisibility),
    clientSide: z.nativeEnum(ProjectSupport),
    serverSide: z.nativeEnum(ProjectSupport),
    summary: z.string().min(1).max(MAX_PROJECT_SUMMARY_LENGTH),
});
