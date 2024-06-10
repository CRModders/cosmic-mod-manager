import { LoaderSupportedFields, ProjectType, ProjectVisibility, ReleaseChannels, TagHeaderTypes } from "@root/types";

export const ProjectTypes = [
    ProjectType.MOD,
    ProjectType.PLUGIN,
    ProjectType.MODPACK,
    ProjectType.DATAPACK,
    ProjectType.RESOURCE_PACK,
    ProjectType.SHADER
];

export const ReleaseChannelsList = [
    ReleaseChannels.RELEASE,
    ReleaseChannels.BETA,
    ReleaseChannels.ALPHA
];

export const ProjectVisibilityOptions = [
    ProjectVisibility.PUBLIC,
    ProjectVisibility.PRIVATE,
    ProjectVisibility.LISTED,
    ProjectVisibility.UNLISTED,
    ProjectVisibility.ARCHIVED,
];

export const Loaders = [
    {
        icon: "",
        name: "QUILT",
        supported_project_types: [
            ProjectType.MOD
        ],
        supported_fields: [
            LoaderSupportedFields.CLIENT_AND_SERVER,
            LoaderSupportedFields.SERVER_ONLY,
            LoaderSupportedFields.CLIENT_ONLY,
            LoaderSupportedFields.SINGLEPLAYER,
            LoaderSupportedFields.GAME_VERSIONS,
        ],
        metadata: {}
    },
    {
        icon: "",
        name: "PUZZLE_LOADER",
        supported_project_types: [
            ProjectType.MOD
        ],
        supported_fields: [
            LoaderSupportedFields.CLIENT_AND_SERVER,
            LoaderSupportedFields.SERVER_ONLY,
            LoaderSupportedFields.CLIENT_ONLY,
            LoaderSupportedFields.SINGLEPLAYER,
            LoaderSupportedFields.GAME_VERSIONS,
        ],
        metadata: {}
    },
    {
        icon: "",
        name: "DATAPACK",
        supported_project_types: [ProjectType.DATAPACK],
        supported_fields: [LoaderSupportedFields.GAME_VERSIONS],
        metadata: {}
    },
    {
        icon: "",
        name: "RESOURCE_PACK",
        supported_project_types: [ProjectType.RESOURCE_PACK],
        supported_fields: [LoaderSupportedFields.GAME_VERSIONS],
        metadata: {}
    },
];

export const Categories = [
    {
        icon: "",
        name: "128x",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.RESOLUTION
    },
    {
        icon: "",
        name: "16x",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.RESOLUTION
    },
    {
        icon: "",
        name: "256x",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.RESOLUTION
    },
    {
        icon: "",
        name: "32x",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.RESOLUTION
    },
    {
        icon: "",
        name: "48x",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.RESOLUTION
    },
    {
        icon: "",
        name: "512x+",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.RESOLUTION
    },
    {
        icon: "",
        name: "64x",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.RESOLUTION
    },
    {
        icon: "",
        name: "8x-",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.RESOLUTION
    },
    {
        icon: "",
        name: "adventure",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "adventure",
        project_type: ProjectType.MODPACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "atmosphere",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "audio",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "blocks",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "bloom",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "cartoon",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "challenging",
        project_type: ProjectType.MODPACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "colored-lighting",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "combat",
        project_type: ProjectType.MODPACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "combat",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "core-shaders",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "cursed",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "cursed",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "cursed",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "decoration",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "decoration",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "economy",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "entities",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "environment",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "equipment",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "equipment",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "fantasy",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "foliage",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "fonts",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "food",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "game-mechanics",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "gui",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "high",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.PERFORMANCE_IMPACT
    },
    {
        icon: "",
        name: "items",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "kitchen-sink",
        project_type: ProjectType.MODPACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "library",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "lightweight",
        project_type: ProjectType.MODPACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "locale",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "low",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.PERFORMANCE_IMPACT
    },
    {
        icon: "",
        name: "magic",
        project_type: ProjectType.MODPACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "magic",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "management",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "medium",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.PERFORMANCE_IMPACT
    },
    {
        icon: "",
        name: "minigame",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "mobs",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "modded",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "models",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "multiplayer",
        project_type: ProjectType.MODPACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "optimization",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "optimization",
        project_type: ProjectType.MODPACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "path-tracing",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "pbr",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "potato",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.PERFORMANCE_IMPACT
    },
    {
        icon: "",
        name: "quests",
        project_type: ProjectType.MODPACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "realistic",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "realistic",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "reflections",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "screenshot",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.PERFORMANCE_IMPACT
    },
    {
        icon: "",
        name: "semi-realistic",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "shadows",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.FEATURE
    },
    {
        icon: "",
        name: "simplistic",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "social",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "storage",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "technology",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "technology",
        project_type: ProjectType.MODPACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "themed",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "transportation",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "tweaks",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "utility",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "utility",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "vanilla-like",
        project_type: ProjectType.SHADER,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "vanilla-like",
        project_type: ProjectType.RESOURCE_PACK,
        header: TagHeaderTypes.CATEGORY
    },
    {
        icon: "",
        name: "worldgen",
        project_type: ProjectType.MOD,
        header: TagHeaderTypes.CATEGORY
    }
];

export const GameVersions = [
    { version: '0.1.36', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.35', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.34', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.33', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.32', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.31', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.30', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.29', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.28', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.27', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.26', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.25', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.24', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.23', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.22', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.21', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.20', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.19', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.18', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.17', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.16', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.15', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.14', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.13', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.12', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.11', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.10', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.9', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.8', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.7', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.6', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.5', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.4', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.3', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.2', releaseType: ReleaseChannels.RELEASE },
    { version: '0.1.1', releaseType: ReleaseChannels.RELEASE }
]