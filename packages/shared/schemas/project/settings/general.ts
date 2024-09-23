import { z } from "zod";
import { MAX_PROJECT_ICON_SIZE, MAX_PROJECT_NAME_LENGTH, MAX_PROJECT_SUMMARY_LENGTH, MIN_PROJECT_NAME_LENGTH } from "../../../config/forms";
import { createURLSafeSlug, validateProjectTypesCompatibility } from "../../../lib/utils";
import { getFileType } from "../../../lib/utils/convertors";
import { isImageFile } from "../../../lib/validation";
import { ProjectSupport, ProjectType, ProjectVisibility } from "../../../types";

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
    slug: z
        .string()
        .min(MIN_PROJECT_NAME_LENGTH)
        .max(MAX_PROJECT_NAME_LENGTH)
        .refine(
            (slug) => {
                if (slug !== createURLSafeSlug(slug).value) return false;
                return true;
            },
            { message: "Slug must be a URL safe string" },
        ),
    type: z
        .nativeEnum(ProjectType)
        .array()
        .min(1)
        .refine(
            (values) => {
                const filteredTypes = validateProjectTypesCompatibility(values);
                for (const value of values) {
                    if (!filteredTypes.includes(value)) return false;
                }

                return true;
            },
            { message: "Invalid project types combination" },
        ),
    visibility: z.nativeEnum(ProjectVisibility),
    clientSide: z.nativeEnum(ProjectSupport),
    serverSide: z.nativeEnum(ProjectSupport),
    summary: z.string().min(1).max(MAX_PROJECT_SUMMARY_LENGTH),
});
