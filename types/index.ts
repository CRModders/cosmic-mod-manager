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
    GAME_VERSIONS = "GAME_VERSIONS"
}

export enum TagHeaderTypes {
    RESOLUTION = "RESOLUTION",
    FEATURE = "FEATURE",
    CATEGORY = "CATEGORY",
    PERFORMANCE_IMPACT = "PERFORMANCE_IMPACT"
}

export enum ReleaseChannels {
    RELEASE = "RELEASE",
    BETA = "BETA",
    ALPHA = "ALPHA"
}

export enum ProjectVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    LISTED = "LISTED",
    UNLISTED = "UNLISTED",
    ARCHIVED = "ARCHIVED"
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
    OWNER = "OWNER"
}

export enum UserROlesInOrganisation {
    OWNER = "OWNER",
    MODERATOR = "MODERATOR",
    MEMBER = "MEMBER",
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
    user?: LocalUserSession
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
}

export type TypeTimePastPhrases = typeof time_past_phrases;