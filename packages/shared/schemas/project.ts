import { z } from "zod";
import {
    MAX_OPTIONAL_FILES,
    MAX_PROJECT_ICON_SIZE,
    MAX_PROJECT_NAME_LENGTH,
    MAX_PROJECT_SUMMARY_LENGTH,
    MAX_VERSION_CHANGELOG_LENGTH,
    MAX_VERSION_FILE_SIZE,
    MAX_VERSION_NUMBER_LENGTH,
    MAX_VERSION_TITLE_LENGTH,
    MIN_PROJECT_NAME_LENGTH,
    MIN_VERSION_TITLE_LENGTH,
} from "../config/forms";
import GAME_VERSIONS from "../config/game-versions";
import { loaders } from "../config/project";
import { createURLSafeSlug } from "../lib/utils";
import { getFileType } from "../lib/utils/convertors";
import { DependencyType, FileType, ProjectSupport, ProjectVisibility, VersionReleaseChannel } from "../types";

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

export const newVersionFormSchema = z.object({
    title: z.string().min(MIN_VERSION_TITLE_LENGTH).max(MAX_VERSION_TITLE_LENGTH),
    changelog: z.string().max(MAX_VERSION_CHANGELOG_LENGTH).optional(),
    releaseChannel: z.nativeEnum(VersionReleaseChannel).default(VersionReleaseChannel.RELEASE),
    versionNumber: z
        .string()
        .min(1)
        .max(MAX_VERSION_NUMBER_LENGTH)
        .refine(
            (val) => {
                return val === createURLSafeSlug(val, "+").value;
            },
            { message: "Version number must be a URL safe string" },
        ),
    loaders: z
        .string()
        .array()
        .refine(
            (values) => {
                const loaderNamesList = loaders.map((loader) => loader.name);
                for (const value of values) {
                    if (!loaderNamesList.includes(value)) return false;
                }
                return true;
            },
            { message: "Invalid loader" },
        ),
    gameVersions: z
        .string()
        .array()
        .refine(
            (values) => {
                const gameVersionNumbersList = GAME_VERSIONS.map((version) => version.version);
                for (const value of values) {
                    if (!gameVersionNumbersList.includes(value)) return false;
                }
                return true;
            },
            { message: "Invalid game version" },
        ),

    dependencies: z
        .object({
            projectId: z.number(),
            versionId: z.number().optional(),
            dependencyType: z.nativeEnum(DependencyType),
        })
        .array()
        .max(64)
        .optional(),

    primaryFile: z
        .instanceof(File)
        .or(
            z.object({
                name: z.string().min(1).max(64),
                size: z.number().min(1),
                type: z.string().min(1).max(32),
            }),
        )
        .optional()
        .refine(
            (file) => {
                if (!file || file.size > MAX_VERSION_FILE_SIZE) return false;
                return true;
            },
            { message: `You can upload files of size up to ${MAX_VERSION_FILE_SIZE / (1024 * 1024)} MiB only` },
        ),

    additionalFiles: z
        .instanceof(File)
        .or(
            z.object({
                name: z.string().min(1).max(64),
                size: z.number().min(1),
                type: z.string().min(1).max(32),
            }),
        )
        .array()
        .max(MAX_OPTIONAL_FILES)
        .optional()
        .refine(
            (files) => {
                const fileNamesList: string[] = [];
                for (const file of files || []) {
                    if (file.size > MAX_VERSION_FILE_SIZE) {
                        return false;
                    }
                    if (!fileNamesList.includes(file.name.toLowerCase())) {
                        fileNamesList.push(file.name.toLowerCase());
                    } else {
                        return false;
                    }
                }

                return true;
            },
            {
                message: `Error in additional files, Only .jar, .zip, .png and .jpeg file types are allowed. Max size (${MAX_VERSION_FILE_SIZE / (1024 * 1024)} MiB)`,
            },
        ),
});

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
            (file) => {
                if (file instanceof File) {
                    const type = getFileType(file.type);
                    if (type !== FileType.JPEG && type !== FileType.PNG) {
                        return false;
                    }
                }

                return true;
            },
            { message: "Invalid file type only jpg and png files allowed" },
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
    visibility: z.nativeEnum(ProjectVisibility),
    clientSide: z.nativeEnum(ProjectSupport),
    serverSide: z.nativeEnum(ProjectSupport),
    summary: z.string().min(1).max(MAX_PROJECT_SUMMARY_LENGTH),
});
