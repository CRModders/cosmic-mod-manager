import { z } from "zod";
import { MAX_ICON_SIZE, MAX_PROJECT_NAME_LENGTH, MAX_PROJECT_SUMMARY_LENGTH, MIN_PROJECT_NAME_LENGTH } from "~/constants";
import { getFileType } from "~/convertors";
import { isImageFile } from "~/schemas/validation";
import { EnvironmentSupport, ProjectVisibility } from "~/types";
import { ProjectSlugField, ProjectTypeField } from "..";

export const iconFieldSchema = z
    .instanceof(File)
    .refine(
        (file) => {
            if (file instanceof File) {
                if (file.size > MAX_ICON_SIZE) return false;
            }
            return true;
        },
        { message: `Icon can only be a maximum of ${MAX_ICON_SIZE / 1024} KiB` },
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
    );

export const generalProjectSettingsFormSchema = z.object({
    icon: iconFieldSchema.or(z.string()).optional(),
    name: z.string().min(MIN_PROJECT_NAME_LENGTH).max(MAX_PROJECT_NAME_LENGTH),
    slug: ProjectSlugField,
    type: ProjectTypeField,
    visibility: z.nativeEnum(ProjectVisibility),
    clientSide: z.nativeEnum(EnvironmentSupport),
    serverSide: z.nativeEnum(EnvironmentSupport),
    summary: z.string().min(1).max(MAX_PROJECT_SUMMARY_LENGTH),
});
