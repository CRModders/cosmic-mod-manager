import type { FILE_STORAGE_SERVICES } from "@/../types";
import prisma from "@/services/prisma";
import { createFilePathSafeString, deleteDataFromLocalStorage, deleteFile, getProjectVersionStoragePath, saveProjectVersionFile } from "@/services/storage";
import type { File as DBFile } from "@prisma/client";
import { STRING_ID_LENGTH } from "@shared/config";
import { getFileType } from "@shared/lib/utils/convertors";
import { nanoid } from "nanoid";


export const retrieveVersionFilesData = async (fileIds: string[]) => {
    const files = await prisma.file.findMany({
        where: {
            OR: fileIds.map((id) => ({ id })),
        },
    });

    const map = new Map<string, DBFile>();
    for (const file of files) {
        map.set(file.id, file);
    }

    return map;
};

export interface CreateVersionFileProps {
    files: File[];
    versionId: string;
    projectId: string;
    storageService: FILE_STORAGE_SERVICES;
    isPrimary?: boolean;
}

export const createVersionFiles = async ({ files, versionId, projectId, storageService, isPrimary }: CreateVersionFileProps) => {
    const promises = [];
    for (const file of files) {
        promises.push(createVersionFile(file, versionId, projectId, storageService, isPrimary === true));
    }

    return await Promise.all(promises);
};

export const createVersionFile = async (
    file: File,
    versionId: string,
    projectId: string,
    storageService: FILE_STORAGE_SERVICES,
    isPrimaryFile = false,
) => {
    const fileType = getFileType(file.type);
    if (!fileType) return null;

    const savedPath = await saveProjectVersionFile(projectId, versionId, file.name, storageService, file);
    if (!savedPath?.path) return null;

    const dbFile = await prisma.file.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            name: createFilePathSafeString(file.name),
            type: fileType,
            size: file.size,
            storageService: storageService,
            url: savedPath.path,
        },
    });

    return await prisma.versionFile.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            versionId: versionId,
            isPrimary: isPrimaryFile,
            fileId: dbFile.id,
        },
    });
};

export const deleteVersionFiles = async (projectId: string, versionId: string, filesData: DBFile[]) => {
    // Delete files from storage
    const promises = [];
    for (const file of filesData) {
        promises.push(deleteFile(getProjectVersionStoragePath(projectId, versionId, `/${file.name}`), file.storageService as FILE_STORAGE_SERVICES));
    }
    await Promise.all(promises);

    // Delete files from database
    await prisma.file.deleteMany({
        where: {
            id: {
                in: filesData.map((file) => file.id)
            }
        }
    });

    // Delete the deleted versionFiles from database
    await prisma.versionFile.deleteMany({
        where: {
            versionId: versionId,
            fileId: {
                in: filesData.map((file) => file.id)
            }
        },
    });
};

export const deleteVersionStoreDirectory = async (projectId: string, versionId: string) => {
    const directoryPath = getProjectVersionStoragePath(projectId, versionId);
    return await deleteDataFromLocalStorage(directoryPath);
}