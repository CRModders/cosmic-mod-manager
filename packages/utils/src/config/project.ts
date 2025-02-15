import { AuthProvider, EnvironmentSupport, OrganisationPermission, ProjectPermission, ProjectPublishingStatus, ProjectType } from "~/types";

export const authProvidersList: AuthProvider[] = [
    AuthProvider.GITHUB,
    AuthProvider.GITLAB,
    AuthProvider.DISCORD,
    AuthProvider.GOOGLE,
    AuthProvider.CREDENTIAL,
];

export const projectTypes: ProjectType[] = [
    ProjectType.MOD,
    ProjectType.DATAMOD,
    ProjectType.RESOURCE_PACK,
    ProjectType.SHADER,
    ProjectType.MODPACK,
    ProjectType.PLUGIN,
];

export const ProjectPermissionsList: ProjectPermission[] = [
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

export const OrgPermissionsList: OrganisationPermission[] = [
    OrganisationPermission.EDIT_DETAILS,
    OrganisationPermission.MANAGE_INVITES,
    OrganisationPermission.REMOVE_MEMBER,
    OrganisationPermission.EDIT_MEMBER,
    OrganisationPermission.ADD_PROJECT,
    OrganisationPermission.REMOVE_PROJECT,
    OrganisationPermission.DELETE_ORGANIZATION,
    OrganisationPermission.EDIT_MEMBER_DEFAULT_PERMISSIONS,
];

export const RejectedStatuses = [ProjectPublishingStatus.REJECTED, ProjectPublishingStatus.WITHHELD];

export const ShowEnvSupportSettingsForType = [ProjectType.MOD, ProjectType.MODPACK, ProjectType.DATAMOD];

export function GetProjectEnvironment(type: ProjectType[], clientSide?: EnvironmentSupport, serverSide?: EnvironmentSupport) {
    // Shaders and resource packs can only be used client side
    if (type.includes(ProjectType.SHADER) || type.includes(ProjectType.RESOURCE_PACK)) {
        return {
            clientSide: EnvironmentSupport.REQUIRED,
            serverSide: EnvironmentSupport.UNSUPPORTED,
        };
    }

    // Plugins are server only
    if (type.includes(ProjectType.PLUGIN)) {
        return {
            clientSide: type.includes(ProjectType.MOD) && clientSide ? clientSide : EnvironmentSupport.UNSUPPORTED,
            serverSide: EnvironmentSupport.REQUIRED,
        };
    }

    return {
        clientSide: clientSide || EnvironmentSupport.UNKNOWN,
        serverSide: serverSide || EnvironmentSupport.UNKNOWN,
    };
}
