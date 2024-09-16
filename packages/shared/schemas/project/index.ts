import { z } from "zod";
import { MAX_PROJECT_NAME_LENGTH, MAX_PROJECT_SUMMARY_LENGTH, MIN_PROJECT_NAME_LENGTH } from "../../config/forms";
import { createURLSafeSlug, isValidUrl } from "../../lib/utils";
import { ProjectVisibility } from "../../types";

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

export const newProjectFormSchema = z.object({
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
    visibility: z.nativeEnum(ProjectVisibility),
    summary: z.string().min(1).max(MAX_PROJECT_SUMMARY_LENGTH),
});
