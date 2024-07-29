import {
    LoaderSupportedFields,
    MemberPermissionsInProject,
    ProjectType,
    ProjectVisibility,
    ReleaseChannels,
    TagHeaderTypes,
} from "@root/types";

export const ProjectTypes = [
    ProjectType.MOD,
    ProjectType.PLUGIN,
    ProjectType.MODPACK,
    ProjectType.DATA_PACK,
    ProjectType.RESOURCE_PACK,
    ProjectType.SHADER,
];

export const ReleaseChannelsList = [ReleaseChannels.RELEASE, ReleaseChannels.BETA, ReleaseChannels.ALPHA];

export const ProjectVisibilityOptions = [
    ProjectVisibility.PUBLIC,
    ProjectVisibility.PRIVATE,
    ProjectVisibility.LISTED,
    ProjectVisibility.UNLISTED,
    ProjectVisibility.ARCHIVED,
];

export const MemberPermissionsInProjectList = [
    MemberPermissionsInProject.UPLOAD_VERSION,
    MemberPermissionsInProject.DELETE_VERSION,
    MemberPermissionsInProject.EDIT_DETAILS,
    MemberPermissionsInProject.EDIT_DESCRIPTION,
    MemberPermissionsInProject.MANAGE_INVITES,
    MemberPermissionsInProject.REMOVE_MEMBER,
    MemberPermissionsInProject.EDIT_MEMBER,
    MemberPermissionsInProject.DELETE_PROJECT,
    MemberPermissionsInProject.VIEW_ANALYTICS,
    MemberPermissionsInProject.VIEW_REVENUE,
];

export type LoaderType = {
    icon: string;
    name: string;
    supported_project_types: ProjectType[];
    supported_fields: LoaderSupportedFields[];
    metadata: {
        [key: string]: string | boolean;
    };
};

export type CategoryType = {
    icon: string;
    name: string;
    project_types: ProjectType[];
    header: TagHeaderTypes;
    isDisplayed?: boolean;
};

export type LicenseDataType = {
    name?: string;
    id: string;
    requiresOnlyOrLater?: boolean;
};

export const Loaders: LoaderType[] = [
    {
        icon: "quilt_icon",
        name: "QUILT",
        supported_project_types: [ProjectType.MOD],
        supported_fields: [
            LoaderSupportedFields.CLIENT_AND_SERVER,
            LoaderSupportedFields.SERVER_ONLY,
            LoaderSupportedFields.CLIENT_ONLY,
            LoaderSupportedFields.SINGLEPLAYER,
            LoaderSupportedFields.GAME_VERSIONS,
        ],
        metadata: {},
    },
    {
        icon: "puzzle_loader_icon",
        name: "PUZZLE_LOADER",
        supported_project_types: [ProjectType.MOD],
        supported_fields: [
            LoaderSupportedFields.CLIENT_AND_SERVER,
            LoaderSupportedFields.SERVER_ONLY,
            LoaderSupportedFields.CLIENT_ONLY,
            LoaderSupportedFields.SINGLEPLAYER,
            LoaderSupportedFields.GAME_VERSIONS,
        ],
        metadata: {},
    },
    {
        icon: "",
        name: "DATA_PACK",
        supported_project_types: [ProjectType.DATA_PACK],
        supported_fields: [LoaderSupportedFields.GAME_VERSIONS],
        metadata: {
            visible_in_version_list: false,
        },
    },
    {
        icon: "",
        name: "RESOURCE_PACK",
        supported_project_types: [ProjectType.RESOURCE_PACK],
        supported_fields: [LoaderSupportedFields.GAME_VERSIONS],
        metadata: {
            visible_in_version_list: false,
        },
    },
];

export const Categories: CategoryType[] = [
    {
        icon: "",
        name: "8x-",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        icon: "",
        name: "16x",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        icon: "",
        name: "32x",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        icon: "",
        name: "48x",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        icon: "",
        name: "64x",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        icon: "",
        name: "128x",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        icon: "",
        name: "256x",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        icon: "",
        name: "512x+",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        icon: "adventure_icon",
        name: "adventure",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN, ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "atmosphere_icon",
        name: "atmosphere",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "audio_icon",
        name: "audio",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "blocks_icon",
        name: "blocks",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "bloom_icon",
        name: "bloom",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "cartoon_icon",
        name: "cartoon",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "challenging_icon",
        name: "challenging",
        project_types: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "colored-lighting_icon",
        name: "colored-lighting",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "combat_icon",
        name: "combat",
        project_types: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "combat_icon",
        name: "combat",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "core-shaders_icon",
        name: "core-shaders",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "cursed_icon",
        name: "cursed",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "cursed_icon",
        name: "cursed",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "cursed_icon",
        name: "cursed",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "decoration_icon",
        name: "decoration",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "decoration_icon",
        name: "decoration",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "economy_icon",
        name: "economy",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "entities_icon",
        name: "entities",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "environment_icon",
        name: "environment",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "equipment_icon",
        name: "equipment",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "equipment_icon",
        name: "equipment",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "fantasy_icon",
        name: "fantasy",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "foliage_icon",
        name: "foliage",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "fonts_icon",
        name: "fonts",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "food_icon",
        name: "food",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "game-mechanics_icon",
        name: "game-mechanics",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "gui_icon",
        name: "gui",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "items_icon",
        name: "items",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "kitchen-sink_icon",
        name: "kitchen-sink",
        project_types: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "library_icon",
        name: "library",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "lightweight_icon",
        name: "lightweight",
        project_types: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "locale_icon",
        name: "locale",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "magic_icon",
        name: "magic",
        project_types: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "magic_icon",
        name: "magic",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "management_icon",
        name: "management",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "minigame_icon",
        name: "minigame",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "mobs_icon",
        name: "mobs",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "modded_icon",
        name: "modded",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "models_icon",
        name: "models",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "multiplayer_icon",
        name: "multiplayer",
        project_types: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "optimization_icon",
        name: "optimization",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "optimization_icon",
        name: "optimization",
        project_types: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "path-tracing_icon",
        name: "path-tracing",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "pbr_icon",
        name: "pbr",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "potato_icon",
        name: "potato",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.PERFORMANCE_IMPACT,
    },
    {
        icon: "low_icon",
        name: "low",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.PERFORMANCE_IMPACT,
    },
    {
        icon: "medium_icon",
        name: "medium",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.PERFORMANCE_IMPACT,
    },
    {
        icon: "high_icon",
        name: "high",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.PERFORMANCE_IMPACT,
    },
    {
        icon: "screenshot_icon",
        name: "screenshot",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.PERFORMANCE_IMPACT,
    },
    {
        icon: "quests_icon",
        name: "quests",
        project_types: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "realistic_icon",
        name: "realistic",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "realistic_icon",
        name: "realistic",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "reflections_icon",
        name: "reflections",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "semi-realistic_icon",
        name: "semi-realistic",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "shadows_icon",
        name: "shadows",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        icon: "simplistic_icon",
        name: "simplistic",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "social_icon",
        name: "social",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "storage_icon",
        name: "storage",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "technology_icon",
        name: "technology",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "technology_icon",
        name: "technology",
        project_types: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "themed_icon",
        name: "themed",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "transportation_icon",
        name: "transportation",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "tweaks_icon",
        name: "tweaks",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "utility_icon",
        name: "utility",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "utility_icon",
        name: "utility",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "vanilla-like_icon",
        name: "vanilla-like",
        project_types: [ProjectType.SHADER],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "vanilla-like_icon",
        name: "vanilla-like",
        project_types: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        icon: "worldgen_icon",
        name: "worldgen",
        project_types: [ProjectType.MOD, ProjectType.DATA_PACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
];

export const GameVersions = [
    { version: "0.1.43", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.42", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.41", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.40", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.39", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.38", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.37", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.36", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.35", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.34", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.33", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.32", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.31", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.30", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.29", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.28", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.27", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.26", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.25", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.24", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.23", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.22", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.21", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.20", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.19", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.18", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.17", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.16", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.15", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.14", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.13", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.12", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.11", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.10", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.9", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.8", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.7", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.6", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.5", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.4", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.3", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.2", releaseType: ReleaseChannels.RELEASE },
    { version: "0.1.1", releaseType: ReleaseChannels.RELEASE },
];

export const LicensesList = [
    { name: "Custom", id: "CUSTOM" },
    {
        name: "All Rights Reserved/No License",
        id: "All-Rights-Reserved",
    },
    { name: "Apache License 2.0", id: "Apache-2.0" },
    {
        name: 'BSD 2-Clause "Simplified" License',
        id: "BSD-2-Clause",
    },
    {
        name: 'BSD 3-Clause "New" or "Revised" License',
        id: "BSD-3-Clause",
    },
    {
        name: "CC Zero (Public Domain equivalent)",
        id: "CC0-1.0",
    },
    { name: "CC-BY 4.0", id: "CC-BY-4.0" },
    {
        name: "CC-BY-SA 4.0",
        id: "CC-BY-SA-4.0",
    },
    {
        name: "CC-BY-NC 4.0",
        id: "CC-BY-NC-4.0",
    },
    {
        name: "CC-BY-NC-SA 4.0",
        id: "CC-BY-NC-SA-4.0",
    },
    {
        name: "CC-BY-ND 4.0",
        id: "CC-BY-ND-4.0",
    },
    {
        name: "CC-BY-NC-ND 4.0",
        id: "CC-BY-NC-ND-4.0",
    },
    {
        name: "GNU Affero General Public License v3",
        id: "AGPL-3.0",
        requiresOnlyOrLater: true,
    },
    {
        name: "GNU Lesser General Public License v2.1",
        id: "LGPL-2.1",
        requiresOnlyOrLater: true,
    },
    {
        name: "GNU Lesser General Public License v3",
        id: "LGPL-3.0",
        requiresOnlyOrLater: true,
    },
    {
        name: "GNU General Public License v2",
        id: "GPL-2.0",
        requiresOnlyOrLater: true,
    },
    {
        name: "GNU General Public License v3",
        id: "GPL-3.0",
        requiresOnlyOrLater: true,
    },
    { name: "ISC License", id: "ISC" },
    { name: "MIT License", id: "MIT" },
    { name: "Mozilla Public License 2.0", id: "MPL-2.0" },
    { name: "zlib License", id: "Zlib" },
];
