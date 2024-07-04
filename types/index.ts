export enum AuthProvidersEnum {
    GOOGLE = "google",
    GITHUB = "github",
    DISCORD = "discord",
    GITLAB = "gitlab",
}

export type AuthProviderType = "google" | "github" | "discord" | "gitlab" | "credential";

export enum ProjectType {
    MOD = "MOD",
    MODPACK = "MODPACK",
    SHADER = "SHADER",
    RESOURCE_PACK = "RESOURCE_PACK",
    DATAPACK = "DATAPACK",
    PLUGIN = "PLUGIN",
}

export enum LoaderSupportedFields {
    CLIENT_AND_SERVER = "CLIENT_AND_SERVER",
    SERVER_ONLY = "SERVER_ONLY",
    SINGLEPLAYER = "SINGLEPLAYER",
    CLIENT_ONLY = "CLIENT_ONLY",
    GAME_VERSIONS = "GAME_VERSIONS",
}

export enum TagHeaderTypes {
    RESOLUTION = "RESOLUTION",
    FEATURE = "FEATURE",
    CATEGORY = "CATEGORY",
    PERFORMANCE_IMPACT = "PERFORMANCE_IMPACT",
}

export enum ReleaseChannels {
    RELEASE = "RELEASE",
    BETA = "BETA",
    ALPHA = "ALPHA",
}

export enum ProjectVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    LISTED = "LISTED",
    UNLISTED = "UNLISTED",
    ARCHIVED = "ARCHIVED",
}

export enum ProjectStatuses {
    LISTED = "LISTED",
    ARCHIVED = "ARCHIVED",
    DRAFT = "DRAFT",
    UNLISTED = "UNLISTED",
    SCHEDULED = "SCHEDULED",
    UNKNOWN = "UNKNOWN",
}

export enum UserRolesInProject {
    MEMBER = "MEMBER",
    OWNER = "OWNER",
}

export enum UserRolesInOrganisation {
    OWNER = "OWNER",
    MODERATOR = "MODERATOR",
    MEMBER = "MEMBER",
}

export enum MemberPermissionsInProject {
    UPLOAD_VERSION = "UPLOAD_VERSION",
    DELETE_VERSION = "DELETE_VERSION",
    EDIT_DETAILS = "EDIT_DETAILS",
    EDIT_DESCRIPTION = "EDIT_DESCRIPTION",
    MANAGE_INVITES = "MANAGE_INVITES",
    REMOVE_MEMBER = "REMOVE_MEMBER",
    EDIT_MEMBER = "EDIT_MEMBER",
    DELETE_PROJECT = "DELETE_PROJECT",
    VIEW_ANALYTICS = "VIEW_ANALYTICS",
    VIEW_REVENUE = "VIEW_REVENUE",
}

export interface LocalUserSession {
    user_id: string;
    email: string;
    name: string;
    user_name: string;
    avatar_image?: string;
    avatar_provider?: AuthProviderType;
    role: string;
    session_id: string;
    session_token: string;
}

export interface OAuthCallbackHandlerResult {
    message: string;
    success: boolean;
    user?: LocalUserSession;
}

export const time_past_phrases = {
    just_now: "just now",
    minute_ago: "a minute ago",
    minutes_ago: "${0} minutes ago",
    hour_ago: "an hour ago",
    hours_ago: "${0} hours ago",
    day_ago: "a day ago",
    days_ago: "${0} days ago",
    week_ago: "a week ago",
    weeks_ago: "${0} weeks ago",
    month_ago: "a month ago",
    months_ago: "${0} months ago",
    year_ago: "a year ago",
    years_ago: "${0} years ago",
};

export type TypeTimePastPhrases = typeof time_past_phrases;

export type ProjectDataType = {
    id: string;
    name: string;
    org_id?: string;
    status: string;
    summary: string;
    description?: string;
    type: string[];
    tags: string[];
    featured_tags: string[];
    license: string;
    licenseUrl: string;
    updated_on: Date;
    created_on: Date;
    url_slug: string;
    visibility: string;
    external_links: {
        issue_tracker_link?: string;
        project_source_link?: string;
        project_wiki_link?: string;
        discord_invite_link?: string;
    };
    members?: {
        role: string;
        role_title: string;
        permissions: string[];
        user: {
            id: string;
            avatar_image?: string;
            user_name: string;
        };
    }[];
};

export type ProjectVersionData = {
    id: string;
    visibility: ProjectVisibility;
    icon: string;
    members: {
        id: string;
        user_id: string;
        role: string;
    }[];

    versions: {
        id: string;
        version_number: string;
        version_title: string;
        changelog: string;
        url_slug: string;
        is_featured: boolean;
        published_on: Date;
        downloads: number;
        release_channel: ReleaseChannels;
        supported_game_versions: string[];
        supported_loaders: string[];
        publisher: {
            id: string;
            role_title: string;
            user: {
                id: string;
                user_name: string;
                avatar_image: string;
            };
        };

        files: {
            id: string;
            file_name: string;
            file_size: number;
            file_type: string;
            file_url: string;
            is_primary: boolean;
        }[];
    }[];
};

export type ProjectVersionsList = {
    id: string;
    visibility: ProjectVisibility;
    icon: string;
    versions: {
        id: string;
        version_number: string;
        version_title: string;
        url_slug: string;
        is_featured: boolean;
        published_on: Date;
        downloads: number;
        release_channel: ReleaseChannels;
        supported_game_versions: string[];
        supported_loaders: string[];

        files: {
            id: string;
            file_name: string;
            file_size: number;
            file_type: string;
            file_url: string;
            is_primary: boolean;
        }[];
    }[];
};
