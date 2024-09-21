export enum AuthProvider {
    GITHUB = "github",
    GITLAB = "gitlab",
    DISCORD = "discord",
    GOOGLE = "google",
    CREDENTIAL = "credential",
    UNKNOWN = "unknown",
}

export enum GlobalUserRoles {
    ADMIN = "admin",
    MODERATOR = "moderator",
    CREATOR = "creator",
    USER = "user",
}

export enum UserSessionStates {
    ACTIVE = "active",
    UNVERIFIED = "unverified",
}

export interface LoggedInUserData {
    id: string;
    email: string;
    name: string;
    userName: string;
    hasAPassword: boolean;
    avatarUrl?: string | null;
    avatarProvider?: AuthProvider | null;
    role: GlobalUserRoles;
    sessionId: string;
}

export enum ProjectType {
    MOD = "mod",
    MODPACK = "modpack",
    SHADER = "shader",
    RESOURCE_PACK = "resource-pack",
    DATAPACK = "datapack",
    PLUGIN = "plugin",
}

export enum AuthActionIntent {
    SIGN_IN = "signin",
    SIGN_UP = "signup",
    LINK_PROVIDER = "link-provider",
}

export interface LinkedProvidersListData {
    id: string;
    providerName: string;
    providerAccountId: string;
    providerAccountEmail: string;
    avatarImageUrl?: string | null;
}

export enum ConfirmationType {
    CONFIRM_NEW_PASSWORD = "confirm-new-password",
    CHANGE_ACCOUNT_PASSWORD = "change-account-password",
    DELETE_USER_ACCOUNT = "delete-user-account",
}

// PROJECT
export enum ProjectVisibility {
    LISTED = "listed",
    PRIVATE = "private",
    UNLISTED = "unlisted",
    ARCHIVED = "archived",
}

export enum ProjectPublishingStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    PUBLISHED = "published",
    UNKNOWN = "unknown",
}

export enum VersionReleaseChannel {
    RELEASE = "release",
    BETA = "beta",
    ALPHA = "alpha",
}

export enum GameVersionReleaseType {
    RELEASE = "release",
    SNAPSHOT = "snapshot",
    BETA = "beta",
    ALPHA = "alpha",
    PRE_ALPHA = "pre-alpha",
}

export enum ProjectPermission {
    UPLOAD_VERSION = "upload_version",
    DELETE_VERSION = "delete_version",
    EDIT_DETAILS = "edit_details",
    EDIT_DESCRIPTION = "edit_description",
    MANAGE_INVITES = "manage_invites",
    REMOVE_MEMBER = "remove_member",
    EDIT_MEMBER = "edit_member",
    DELETE_PROJECT = "delete_project",
    VIEW_ANALYTICS = "view_analytics",
    VIEW_REVENUE = "view_revenue",
}

export enum OrganisationPermission {
    EDIT_DETAILS = "edit_details",
    MANAGE_INVITES = "manage_invites",
    REMOVE_MEMBER = "remove_member",
    EDIT_MEMBER = "edit_member",
    ADD_PROJECT = "add_project",
    REMOVE_PROJECT = "remove_project",
    DELETE_ORGANIZATION = "delete_organisation",
    EDIT_MEMBER_DEFAULT_PERMISSIONS = "edit_member_default_permissions",
}

export type FileObjectType = {
    name: string;
    size: number;
    type: string;
};

export enum DependsOn {
    PROJECT = "project",
    VERSION = "version",
}

export enum DependencyType {
    REQUIRED = "required",
    OPTIONAL = "optional",
    INCOMPATIBLE = "incompatible",
    EMBEDDED = "embedded",
}

export enum FileType {
    JAR = "jar",
    ZIP = "zip",
    PNG = "png",
    WEBP = "webp",
    JPEG = "jpeg",
}

export enum ProjectSupport {
    UNKNOWN = "unknown",
    REQUIRED = "required",
    OPTIONAL = "optional",
    UNSUPPORTED = "unsupported",
}

export enum TagHeaderTypes {
    RESOLUTION = "resolution",
    FEATURE = "feature",
    CATEGORY = "category",
    PERFORMANCE_IMPACT = "performance_impact",
}

export enum SearchResultSortMethod {
    RELEVANCE = "relevance",
    DOWNLOADS = "downloads",
    FOLLOW_COUNT = "follow_count",
    RECENTLY_UPDATED = "recently_updated",
    RECENTLY_PUBLISHED = "recently_published",
}
