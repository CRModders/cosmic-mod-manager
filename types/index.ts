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
    DATA_PACK = "DATA_PACK",
    PLUGIN = "PLUGIN",
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

export const modLoaders = {
    FABRIC: "FABRIC",
    QUILT: "QUILT",
    PUZZLE_LOADER: "PUZZLE_LOADER"
}

export const modpackLoaders = {};

export const shaderLoaders = {};

export const pluginLoaders = {};

export const dataPackLoaders = {};

export const getProjectLoaders  = (project_type: string) => {
    switch(project_type){
        case ProjectType.MOD:
            return modLoaders;
        case ProjectType.MODPACK:
            return modpackLoaders;
        case ProjectType.DATA_PACK:
            return dataPackLoaders;
        case ProjectType.RESOURCE_PACK:
            return {};
        case ProjectType.PLUGIN:
            return pluginLoaders;
        case ProjectType.SHADER:
            return shaderLoaders;
        default:
            return {};
    }
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