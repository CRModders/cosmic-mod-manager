import { AuthProvider, ProjectPermission, ProjectType, TagHeaderType } from "../types";

export const authProvidersList = [
    AuthProvider.GITHUB,
    AuthProvider.GITLAB,
    AuthProvider.DISCORD,
    AuthProvider.GOOGLE,
    AuthProvider.CREDENTIAL,
];

export const projectTypes = [
    ProjectType.MOD,
    ProjectType.DATAMOD,
    ProjectType.RESOURCE_PACK,
    ProjectType.SHADER,
    ProjectType.MODPACK,
    // ProjectType.PLUGIN,
];

export const ProjectPermissionsList = [
    ProjectPermission.UPLOAD_VERSION,
    ProjectPermission.DELETE_VERSION,
    ProjectPermission.EDIT_DETAILS,
    ProjectPermission.EDIT_DESCRIPTION,
    ProjectPermission.MANAGE_INVITES,
    ProjectPermission.REMOVE_MEMBER,
    ProjectPermission.EDIT_MEMBER,
    ProjectPermission.DELETE_PROJECT,
    ProjectPermission.VIEW_ANALYTICS,
    ProjectPermission.VIEW_REVENUE,
];

export type Loader = {
    name: string;
    supportedProjectTypes: ProjectType[];
    metadata: {
        visibleInTagsList: boolean;
        visibleInLoadersList: boolean;
        isAFilter: boolean;
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
        supportedProjectTypes: [ProjectType.MOD, ProjectType.SHADER, ProjectType.MODPACK],
        metadata: {
            visibleInTagsList: true,
            visibleInLoadersList: true,
            isAFilter: true,
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
        supportedProjectTypes: [ProjectType.MOD, ProjectType.MODPACK],
        metadata: {
            visibleInTagsList: true,
            visibleInLoadersList: true,
            isAFilter: true,
            accent: {
                foreground: {
                    light: "#4A953F",
                    dark: "#A5E388",
                },
            },
        },
    },
];

export interface CategoryType {
    name: string;
    projectTypes: ProjectType[];
    header: TagHeaderType;
    isDisplayed?: boolean;
}

export const categories: CategoryType[] = [
    {
        name: "8x-",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "16x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "32x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "48x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "64x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "128x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "256x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "512x+",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "adventure",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN, ProjectType.MODPACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "atmosphere",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "audio",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "blocks",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "bloom",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "cartoon",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "challenging",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "colored-lighting",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "combat",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "combat",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "core-shaders",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "cursed",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "cursed",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "cursed",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "decoration",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "decoration",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "economy",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "entities",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "environment",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "equipment",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "equipment",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "fantasy",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "foliage",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "fonts",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "food",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "game-mechanics",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "gui",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "items",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "kitchen-sink",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "library",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "lightweight",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "locale",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "magic",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "magic",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "management",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "minigame",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "mobs",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "modded",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "models",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "multiplayer",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "optimization",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "optimization",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "path-tracing",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "pbr",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "potato",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.PERFORMANCE_IMPACT,
    },
    {
        name: "low",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.PERFORMANCE_IMPACT,
    },
    {
        name: "medium",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.PERFORMANCE_IMPACT,
    },
    {
        name: "high",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.PERFORMANCE_IMPACT,
    },
    {
        name: "screenshot",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.PERFORMANCE_IMPACT,
    },
    {
        name: "quests",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "realistic",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "realistic",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "reflections",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "semi-realistic",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "shadows",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.FEATURE,
    },
    {
        name: "simplistic",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "social",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "storage",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "technology",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "technology",
        projectTypes: [ProjectType.MODPACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "themed",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "transportation",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "tweaks",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "utility",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "utility",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "vanilla-like",
        projectTypes: [ProjectType.SHADER],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "vanilla-like",
        projectTypes: [ProjectType.RESOURCE_PACK],
        header: TagHeaderType.CATEGORY,
    },
    {
        name: "worldgen",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        header: TagHeaderType.CATEGORY,
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
