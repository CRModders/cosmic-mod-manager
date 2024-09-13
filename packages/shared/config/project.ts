import { AuthProviders, LoaderSupportedFields, ProjectPermissions, ProjectType, TagHeaderTypes } from "../types";

export const authProvidersList = [
    AuthProviders.GITHUB,
    AuthProviders.GITLAB,
    AuthProviders.DISCORD,
    AuthProviders.GOOGLE,
    AuthProviders.CREDENTIAL,
];

export const projectTypes = [
    ProjectType.MOD,
    ProjectType.PLUGIN,
    ProjectType.MODPACK,
    ProjectType.DATAPACK,
    ProjectType.RESOURCE_PACK,
    ProjectType.SHADER,
];

export const ProjectPermissionsList = [
    ProjectPermissions.UPLOAD_VERSION,
    ProjectPermissions.DELETE_VERSION,
    ProjectPermissions.EDIT_DETAILS,
    ProjectPermissions.EDIT_DESCRIPTION,
    ProjectPermissions.MANAGE_INVITES,
    ProjectPermissions.REMOVE_MEMBER,
    ProjectPermissions.EDIT_MEMBER,
    ProjectPermissions.DELETE_PROJECT,
    ProjectPermissions.VIEW_ANALYTICS,
    ProjectPermissions.VIEW_REVENUE,
];

export type Loader = {
    name: string;
    supportedProjectTypes: ProjectType[];
    supportedFields: LoaderSupportedFields[];
    metadata: {
        visibleInCategoriesList?: boolean;
        accent?: {
            foreground: {
                light: string;
                dark: string;
            };
        };
    };
};

export const loaders: Loader[] = [
    {
        name: "quilt",
        supportedProjectTypes: [ProjectType.MOD],
        supportedFields: [
            LoaderSupportedFields.CLIENT_AND_SERVER,
            LoaderSupportedFields.SERVER_ONLY,
            LoaderSupportedFields.CLIENT_ONLY,
            LoaderSupportedFields.SINGLEPLAYER,
            LoaderSupportedFields.GAME_VERSIONS,
        ],
        metadata: {
            accent: {
                foreground: {
                    light: "#8B61B4",
                    dark: "#C796F9",
                },
            },
        },
    },
    {
        name: "puzzle_loader",
        supportedProjectTypes: [ProjectType.MOD],
        supportedFields: [
            LoaderSupportedFields.CLIENT_AND_SERVER,
            LoaderSupportedFields.SERVER_ONLY,
            LoaderSupportedFields.CLIENT_ONLY,
            LoaderSupportedFields.SINGLEPLAYER,
            LoaderSupportedFields.GAME_VERSIONS,
        ],
        metadata: {
            accent: {
                foreground: {
                    light: "#4A953F",
                    dark: "#A5E388",
                },
            },
        },
    },
    {
        name: "datapack",
        supportedProjectTypes: [ProjectType.DATAPACK],
        supportedFields: [LoaderSupportedFields.GAME_VERSIONS],
        metadata: {
            visibleInCategoriesList: false,
        },
    },
    {
        name: "resource_pack",
        supportedProjectTypes: [ProjectType.RESOURCE_PACK],
        supportedFields: [LoaderSupportedFields.GAME_VERSIONS],
        metadata: {
            visibleInCategoriesList: false,
        },
    },
];

export interface CategoryType {
    name: string;
    projectTypes: ProjectType[];
    header: TagHeaderTypes;
    isDisplayed?: boolean;
}

export const categories: CategoryType[] = [
    {
        name: "8x-",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "16x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "32x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "48x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "64x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "128x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "256x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "512x+",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "adventure",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN, ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "atmosphere",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "audio",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "blocks",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "bloom",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "cartoon",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "challenging",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "colored-lighting",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "combat",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "combat",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "core-shaders",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "cursed",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "cursed",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "cursed",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "decoration",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "decoration",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "economy",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "entities",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "environment",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "equipment",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "equipment",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "fantasy",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "foliage",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "fonts",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "food",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "game-mechanics",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "gui",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "items",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "kitchen-sink",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "library",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "lightweight",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "locale",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "magic",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "magic",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "management",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "minigame",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "mobs",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "modded",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "models",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "multiplayer",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "optimization",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "optimization",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "path-tracing",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "pbr",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "potato",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.PERFORMANCE_IMPACT,
    },
    {
        name: "low",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.PERFORMANCE_IMPACT,
    },
    {
        name: "medium",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.PERFORMANCE_IMPACT,
    },
    {
        name: "high",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.PERFORMANCE_IMPACT,
    },
    {
        name: "screenshot",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.PERFORMANCE_IMPACT,
    },
    {
        name: "quests",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "realistic",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "realistic",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "reflections",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "semi-realistic",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "shadows",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.FEATURE,
    },
    {
        name: "simplistic",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "social",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "storage",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "technology",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "technology",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "themed",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "transportation",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "tweaks",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "utility",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "utility",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "vanilla-like",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "vanilla-like",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderTypes.CATEGORY,
    },
    {
        name: "worldgen",
        projectTypes: [ProjectType.MOD, ProjectType.DATAPACK, ProjectType.PLUGIN],
        header: TagHeaderTypes.CATEGORY,
    },
];

// ?                LIGHT       DARK
// fabric:          #8A7B71     #DBB69B;
// quilt:           #8B61B4     #C796F9;
// forge:           #5B6197     #959EEF;
// neoforge:        #DC895C     #F99E6B;
// liteloader:      #4C90DE     #7AB0EE;
// bukkit:          #E78362     #F6AF7B;
// bungeecord:      #C69E39     #D2C080;
// folia:           #6AA54F     #A5E388;
// paper:           #E67E7E     #EEAAAA;
// purpur:          #7763A3     #C3ABF7;
// spigot:          #CD7A21     #F1CC84;
// velocity:        #4B98B0     #83D5EF;
// waterfall:       #5F83CB     #78A4FB;
// sponge:          #C49528     #F9E580;
