import { FILE_STORAGE_SERVICES } from "@/../types";
import { unlink } from "node:fs/promises";

export const BASE_STORAGE_PATH = "./uploads";

export const getProjectStoragePath = (projectId: string) => `projects/${projectId}`;
export const getProjectVersionStoragePath = (projectId: string, versionId: string) =>
    `${getProjectStoragePath(projectId)}/versions/${versionId}`;

export const createFilePathSafeString = (str: string) => {
    return str.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
};

export const getProjectFileStorageUrl = (projectId: string, fileName: string) => {
    return `${getProjectStoragePath(projectId)}/${fileName}`;
};

export const getProjectVersionFileStorageUrl = (projectId: string, versionId: string, fileName: string) => {
    return `${getProjectVersionStoragePath(projectId, versionId)}/${fileName}`;
};

export const saveFileToLocalStorage = async (path: string, file: File) => {
    try {
        await Bun.write(`${BASE_STORAGE_PATH}/${path}`, file);
        return { path };
    } catch (error) {
        console.error(error)
        return null;
    }
};

export const deleteFileFromLocalStorage = async (path: string) => {
    try {
        await unlink(`${BASE_STORAGE_PATH}/${path}`);
        return { path };
    } catch (error) {
        return null;
    }
};

export const getFileFromStorage = async (storageService: string, url: string) => {
    try {
        if (storageService === FILE_STORAGE_SERVICES.LOCAL) {
            const file = Bun.file(`${BASE_STORAGE_PATH}/${url}`);
            return file;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const saveProjectFile = async (projectId: string, fileName: string, storageService: FILE_STORAGE_SERVICES, file: File,) => {
    if (storageService === FILE_STORAGE_SERVICES.LOCAL) {
        return await saveFileToLocalStorage(getProjectFileStorageUrl(projectId, fileName), file);
    }

    return null;
};

export const saveProjectGalleryFile = async (projectId: string, fileName: string, storageService: FILE_STORAGE_SERVICES, file: File) => {
    if (storageService === FILE_STORAGE_SERVICES.LOCAL) {
        return await saveFileToLocalStorage(`${getProjectStoragePath(projectId)}/gallery/${fileName}`, file);
    }

    return null;
}

export const deleteProjectFile = async (projectId: string, fileName: string, storageService: FILE_STORAGE_SERVICES) => {
    if (storageService === FILE_STORAGE_SERVICES.LOCAL) {
        return await deleteFileFromLocalStorage(getProjectFileStorageUrl(projectId, fileName));
    }

    return null;
}

export const saveProjectVersionFile = async (
    projectId: string,
    versionId: string,
    fileName: string,
    storageService: FILE_STORAGE_SERVICES,
    file: File,
) => {
    if (storageService === FILE_STORAGE_SERVICES.LOCAL) {
        return await saveFileToLocalStorage(getProjectVersionFileStorageUrl(projectId, versionId, fileName), file);
    }

    return null;
};