export enum AuthProvidersEnum {
	GOOGLE = "google",
	GITHUB = "github",
	DISCORD = "discord",
	GITLAB = "gitlab",
}

export type AuthProviderType = "google" | "github" | "discord" | "gitlab" | "credential";

export enum ProjectType {
    MOD = "Mod",
    MODPACK = "Modpack",
    SHADER = "Shader",
    RESOURCEPACK = "Resource pack",
    DATAPACK = "Data pack",
    PLUGIN = "Plugin"
}

export enum ProjectVisibility {
    PUBLIC = "Public",
    PRIVATE = "Private",
    UNLISTED = "Unlisted"
}

export enum ProjectStatuses {
    LISTED = "Listed",
    ARCHIVED = "Archived",
    DRAFT = "Draft",
    UNLISTED = "Unlisted",
    SCHEDULED = "Scheduled",
    UNKNOWN = "Unknown",
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
    minute_ago: "${0} minute ago",
    minutes_ago: "${0} minutes ago",
    hour_ago: "${0} hour ago",
    hours_ago: "${0} hours ago",
    day_ago: "${0} day ago",
    days_ago: "${0} days ago",
    week_ago: "${0} week ago",
    weeks_ago: "${0} weeks ago",
    month_ago: "${0} month ago",
    months_ago: "${0} months ago",
    year_ago: "${0} year ago",
    years_ago: "${0} years ago",
}

export type TypeTimePastPhrases = typeof time_past_phrases;