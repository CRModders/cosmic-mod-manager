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
        accent?: {
            foreground: {
                light: string;
                dark: string;
            }
        }
    };
};

export const loaders: Loader[] = [
    {
        icon: "quilt",
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
                }
            }
        },
    },
    {
        icon: "puzzle_loader",
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
                }
            }
        },
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
