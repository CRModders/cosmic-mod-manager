import { FILE_STORAGE_SERVICES } from "@/../types";
import { rm } from "node:fs/promises";

export const BASE_STORAGE_PATH = "./uploads";

export const getProjectStoragePath = (projectId: string, extra?: string) => `projects/${projectId}${extra || ""}`;
export const getProjectVersionStoragePath = (projectId: string, versionId: string, extra?: string) => {
    return getProjectStoragePath(projectId, `/versions/${versionId}${extra || ""}`);
};

export const createFilePathSafeString = (str: string) => {
    return str.replace(/[^a-z0-9.-]/gi, "-").toLowerCase();
};

export const saveFileToLocalStorage = async (path: string, file: File) => {
    try {
        await Bun.write(`${BASE_STORAGE_PATH}/${path}`, file);
        return { path };
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteDataFromLocalStorage = async (path: string) => {
    try {
        await rm(`${BASE_STORAGE_PATH}/${path}`, { recursive: true });
        return { path };
    } catch (error) {
        console.error(error);
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

export const handleFileOperation = async (
    operation: "save" | "delete",
    path: string,
    storageService: FILE_STORAGE_SERVICES,
    file?: File,
) => {
    try {
        if (storageService === FILE_STORAGE_SERVICES.LOCAL) {
            if (operation === "save" && file) {
                return await saveFileToLocalStorage(path, file);
            }
            if (operation === "delete") {
                return await deleteDataFromLocalStorage(path);
            }
        }
        throw new Error(`Unsupported storage service: ${storageService}`);
    } catch (error) {
        console.error(`Error during file operation (${operation}) at path: ${path}`, error);
        return null;
    }
};

export const saveProjectFile = async (projectId: string, fileName: string, storageService: FILE_STORAGE_SERVICES, file: File) => {
    return await handleFileOperation("save", getProjectStoragePath(projectId, `/${fileName}`), storageService, file);
};

export const saveProjectGalleryFile = async (projectId: string, fileName: string, storageService: FILE_STORAGE_SERVICES, file: File) => {
    return await handleFileOperation("save", getProjectStoragePath(projectId, `/gallery/${fileName}`), storageService, file);
};

export const deleteProjectGalleryFile = async (projectId: string, fileName: string, storageService: FILE_STORAGE_SERVICES) => {
    return await handleFileOperation("delete", getProjectStoragePath(projectId, `/gallery/${fileName}`), storageService);
};

export const deleteProjectFile = async (projectId: string, fileName: string, storageService: FILE_STORAGE_SERVICES) => {
    return await handleFileOperation("delete", getProjectStoragePath(projectId, `/${fileName}`), storageService);
};

export const saveProjectVersionFile = async (
    projectId: string,
    versionId: string,
    fileName: string,
    storageService: FILE_STORAGE_SERVICES,
    file: File,
) => {
    return await handleFileOperation("save", getProjectVersionStoragePath(projectId, versionId, `/${createFilePathSafeString(fileName)}`), storageService, file);
};

export const deleteFile = async (url: string, storageService: FILE_STORAGE_SERVICES) => {
    return await handleFileOperation("delete", url, storageService);
};
