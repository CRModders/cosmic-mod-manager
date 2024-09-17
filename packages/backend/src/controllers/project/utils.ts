import { FILE_STORAGE_SERVICE } from "@/../types";
import prisma from "@/services/prisma";
import { deleteProjectVersionDirectory, deleteProjectVersionFile, saveProjectVersionFile } from "@/services/storage";
import { createFilePathSafeString } from "@/services/storage/utils";
import { createHashFromFile } from "@/utils/file";
import type { File as DBFile, VersionFile } from "@prisma/client";
import { STRING_ID_LENGTH } from "@shared/config";
import { getFileType } from "@shared/lib/utils/convertors";
import { nanoid } from "nanoid";

export const getFilesFromId = async (fileIds: string[]) => {
    const data = await prisma.file.findMany({
        where: {
            id: {
                in: fileIds,
            },
        },
    });

    const map = new Map<string, DBFile>();
    for (const file of data) {
        map.set(file.id, file);
    }

    return map;
};

export interface CreateVersionFileProps {
    files: File[];
    versionId: string;
    projectId: string;
    storageService: FILE_STORAGE_SERVICE;
    isPrimary?: boolean;
}

export const createVersionFile = async (
    file: File,
    versionId: string,
    projectId: string,
    storageService: FILE_STORAGE_SERVICE,
    isPrimaryFile = false,
) => {
    return await createVersionFiles({
        versionId,
        projectId,
        files: [
            {
                file: file,
                isPrimary: isPrimaryFile,
                storageService,
            },
        ],
    });
};

interface createVersionFilesProps {
    versionId: string;
    projectId: string;
    files: {
        file: File;
        isPrimary: boolean;
        storageService: FILE_STORAGE_SERVICE;
    }[];
}

export const createVersionFiles = async ({ versionId, projectId, files }: createVersionFilesProps) => {
    if (!files.length) return [];

    const filesToCreate: DBFile[] = [];
    const versionFilesToCreate: VersionFile[] = [];

    for (const { file, isPrimary, storageService } of files) {
        const fileType = await getFileType(file);
        if (!fileType) continue;

        const sha1_hash = await createHashFromFile(file, "sha1");
        const sha512_hash = await createHashFromFile(file, "sha512");
        const path = await saveProjectVersionFile(storageService, projectId, versionId, file, file.name);
        if (!path) continue;

        const fileId = nanoid(STRING_ID_LENGTH);
        filesToCreate.push({
            id: fileId,
            name: createFilePathSafeString(file.name),
            size: file.size,
            type: fileType,
            storageService: storageService,
            url: path,
            sha1_hash: sha1_hash,
            sha512_hash: sha512_hash,
        });

        versionFilesToCreate.push({
            id: nanoid(STRING_ID_LENGTH),
            versionId: versionId,
            fileId: fileId,
            isPrimary: isPrimary,
        });
    }

    await prisma.$transaction([
        prisma.file.createMany({
            data: filesToCreate,
        }),
        prisma.versionFile.createMany({
            data: versionFilesToCreate,
        }),
    ]);

    return versionFilesToCreate;
};

export const deleteVersionFiles = async (projectId: string, versionId: string, filesData: DBFile[]) => {
    // Delete files from storage
    const promises = [];
    for (const file of filesData) {
        promises.push(deleteProjectVersionFile(file.storageService as FILE_STORAGE_SERVICE, projectId, versionId, `/${file.name}`));
    }
    await Promise.all(promises);

    // Delete files from database
    await prisma.file.deleteMany({
        where: {
            id: {
                in: filesData.map((file) => file.id),
            },
        },
    });

    // Delete the deleted versionFiles from database
    await prisma.versionFile.deleteMany({
        where: {
            versionId: versionId,
            fileId: {
                in: filesData.map((file) => file.id),
            },
        },
    });
};

export const deleteVersionStoreDirectory = async (projectId: string, versionId: string) => {
    return await deleteProjectVersionDirectory(FILE_STORAGE_SERVICE.LOCAL, projectId, versionId);
};

interface isAnyDuplicateFileProps {
    projectId: string;
    files: File[];
}

export const isAnyDuplicateFile = async ({ projectId, files }: isAnyDuplicateFileProps) => {
    const sha1_hashes: string[] = [];
    for (const file of files) {
        const hash = await createHashFromFile(file, "sha1");
        sha1_hashes.push(hash);
    }

    const dbFilesData = await prisma.file.findMany({
        where: {
            sha1_hash: {
                in: sha1_hashes,
            },
        },
    });

    if (dbFilesData.length === 0) return false;

    // List of files which has matching hashes
    const dbFileIds = new Set<string>();
    const dbFilesMap = new Map<string, DBFile>();

    for (const file of dbFilesData) {
        dbFileIds.add(file.id);
        dbFilesMap.set(file.id, file);
    }

    // Corresponding versionFile of those files
    const versionFiles = await prisma.versionFile.findMany({
        where: {
            fileId: {
                in: Array.from(dbFileIds),
            },
        },
        include: {
            version: true,
        },
    });

    if (!versionFiles?.length) return false;

    const associatedProjectIds = new Set<string>();
    for (const versionFile of versionFiles) {
        associatedProjectIds.add(versionFile.version.projectId);
    }

    // Check if the file is associated with another project or is from the same project
    for (const associatedProjectId of Array.from(associatedProjectIds)) {
        if (associatedProjectId !== projectId) return true;
    }

    return false;
};
