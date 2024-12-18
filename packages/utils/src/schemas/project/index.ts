import { z } from "zod";
import { MAX_PROJECT_NAME_LENGTH, MAX_PROJECT_SUMMARY_LENGTH, MIN_PROJECT_NAME_LENGTH } from "~/config/constants";
import { validateProjectTypesCompatibility } from "~/project";
import { createURLSafeSlug, isValidUrl } from "~/string";
import { ProjectType, ProjectVisibility } from "~/types";

export const formLink = z
    .string()
    .max(256)
    .refine(
        (value) => {
            if (!value) return true;
            return isValidUrl(value);
        },
        { message: "Invalid URL" },
    );

export const ProjectTypeField = z
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
    );

export const ProjectSlugField = z
    .string()
    .min(MIN_PROJECT_NAME_LENGTH)
    .max(MAX_PROJECT_NAME_LENGTH)
    .refine(
        (slug) => {
            if (slug !== createURLSafeSlug(slug).value) return false;
            return true;
        },
        { message: "Slug must be a URL safe string" },
    );

export type newProjectFormSchemaType = z.infer<typeof newProjectFormSchema>;

export const newProjectFormSchema = z.object({
    name: z.string().min(MIN_PROJECT_NAME_LENGTH).max(MAX_PROJECT_NAME_LENGTH),
    slug: ProjectSlugField,
    type: ProjectTypeField,
    visibility: z.nativeEnum(ProjectVisibility),
    summary: z.string().min(1).max(MAX_PROJECT_SUMMARY_LENGTH),
    orgId: z.string().max(32).optional(),
});
