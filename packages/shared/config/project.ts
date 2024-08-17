import { AuthProviders, LoaderSupportedFields, ProjectPermissions, ProjectType } from "../types";

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

export const ProjectTeamOwnerPermissionsList = [
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
    icon: string;
    name: string;
    supportedProjectTypes: ProjectType[];
    supportedFields: LoaderSupportedFields[];
    metadata: {
        visibleInTagsList?: boolean;
    };
};

export const loaders: Loader[] = [
    {
        icon: "quilt_icon",
        name: "quilt",
        supportedProjectTypes: [ProjectType.MOD],
        supportedFields: [
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
        name: "puzzle_loader",
        supportedProjectTypes: [ProjectType.MOD],
        supportedFields: [
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
        name: "datapack",
        supportedProjectTypes: [ProjectType.DATAPACK],
        supportedFields: [LoaderSupportedFields.GAME_VERSIONS],
        metadata: {
            visibleInTagsList: false,
        },
    },
    {
        icon: "",
        name: "resource_pack",
        supportedProjectTypes: [ProjectType.RESOURCE_PACK],
        supportedFields: [LoaderSupportedFields.GAME_VERSIONS],
        metadata: {
            visibleInTagsList: false,
        },
    },
];
