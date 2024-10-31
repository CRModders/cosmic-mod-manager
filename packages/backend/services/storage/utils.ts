export const LOCAL_BASE_STORAGE_PATH = "./uploads";

export const PROJECTS_FOLDER_NAMESPACE = "projects";
export const VERSIONS_FOLDER_NAMESPACE = "versions";
export const GALLERY_FOLDER_NAMESPACE = "gallery";
export const ORGS_FOLDER_NAMESPACE = "organizations";

export function projectFileStoragePath(projectId: string, extra?: string) {
    let path = `${PROJECTS_FOLDER_NAMESPACE}/${projectId}`;
    if (extra) path += `/${extra}`;

    return path;
}

export function versionFileStoragePath(projectId: string, versionId: string, extra?: string) {
    let path = projectFileStoragePath(projectId, `${VERSIONS_FOLDER_NAMESPACE}/${versionId}`);
    if (extra) path += `/${extra}`;

    return path;
}

export function projectGalleryStoragePath(projectId: string, extra?: string) {
    let path = projectFileStoragePath(projectId, GALLERY_FOLDER_NAMESPACE);
    if (extra) path += `/${extra}`;

    return path;
}

export function orgFileStoragePath(orgId: string, extra?: string) {
    let path = `${ORGS_FOLDER_NAMESPACE}/${orgId}`;
    if (extra) path += `/${extra}`;

    return path;
}

export function createFilePathSafeString(str: string) {
    return str.replace(/[^a-z0-9.-_]/gi, "-").toLowerCase();
}
