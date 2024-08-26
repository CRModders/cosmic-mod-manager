import { loaders } from "../../config/project";
import { AuthProviders, ConfirmationType, FileType, GlobalUserRoles, ProjectType, ProjectVisibility } from "../../types";

export const getUserRoleFromString = (roleName: string) => {
    switch (roleName) {
        case GlobalUserRoles.ADMIN:
            return GlobalUserRoles.ADMIN;
        case GlobalUserRoles.MODERATOR:
            return GlobalUserRoles.MODERATOR;
        case GlobalUserRoles.CREATOR:
            return GlobalUserRoles.CREATOR;
        case GlobalUserRoles.USER:
            return GlobalUserRoles.USER;
        default:
            return GlobalUserRoles.USER;
    }
};

export const getProjectTypeFromString = (type: string) => {
    switch (type) {
        case ProjectType.MOD:
            return ProjectType.MOD;
        case ProjectType.MODPACK:
            return ProjectType.MODPACK;
        case ProjectType.SHADER:
            return ProjectType.SHADER;
        case ProjectType.RESOURCE_PACK:
            return ProjectType.RESOURCE_PACK;
        case ProjectType.DATAPACK:
            return ProjectType.DATAPACK;
        case ProjectType.PLUGIN:
            return ProjectType.PLUGIN;

        default:
            return ProjectType.MOD;
    }
};

export const getAuthProviderFromString = (providerName: string) => {
    switch (providerName.toLowerCase()) {
        case AuthProviders.GITHUB:
            return AuthProviders.GITHUB;
        case AuthProviders.GITLAB:
            return AuthProviders.GITLAB;
        case AuthProviders.DISCORD:
            return AuthProviders.DISCORD;
        case AuthProviders.GOOGLE:
            return AuthProviders.GOOGLE;
        case AuthProviders.CREDENTIAL:
            return AuthProviders.CREDENTIAL;
        default:
            return AuthProviders.UNKNOWN;
    }
};

export const getConfirmActionTypeFromStringName = (type: string) => {
    switch (type) {
        case ConfirmationType.CONFIRM_NEW_PASSWORD:
            return ConfirmationType.CONFIRM_NEW_PASSWORD;
        case ConfirmationType.CHANGE_ACCOUNT_PASSWORD:
            return ConfirmationType.CHANGE_ACCOUNT_PASSWORD;
        case ConfirmationType.DELETE_USER_ACCOUNT:
            return ConfirmationType.DELETE_USER_ACCOUNT;
        default:
            return null;
    }
};

export const getProjectVisibilityFromString = (visibility: string) => {
    switch (visibility.toLowerCase()) {
        case ProjectVisibility.PRIVATE:
            return ProjectVisibility.PRIVATE;
        case ProjectVisibility.UNLISTED:
            return ProjectVisibility.UNLISTED;
        case ProjectVisibility.ARCHIVED:
            return ProjectVisibility.ARCHIVED;
        default:
            return ProjectVisibility.LISTED;
    }
};

export const getFileType = (strType: string) => {
    switch (strType) {
        case "image/jpeg":
            return FileType.JPEG;
        case "image/jpg":
            return FileType.JPEG;
        case "image/png":
            return FileType.PNG;
        case "application/java-archive":
            return FileType.JAR;
        case "application/zip":
            return FileType.ZIP;
        default:
            return null;
    }
};

export const getLoaderFromString = (loaderName: string) => {
    for (const LOADER of loaders) {
        if (LOADER.name === loaderName.toLowerCase()) {
            return LOADER;
        }
    };
    return null;
}