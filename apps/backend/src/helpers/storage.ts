import * as nodefs from "node:fs/promises";

const uploadsDir = process.env.UPLOADS_DIR as string;

export const generateUserStorageUrl = (userId: string) => {
    return `project-files/${userId}`;
};

export const generateProjectStorageUrl = (userId: string, projectId: string) => {
    return `${generateUserStorageUrl(userId)}/projects/${projectId}`;
};

export const generateProjectVersionStorageUrl = (userId: string, projectId: string, versionId: string) => {
    return `${generateProjectStorageUrl(userId, projectId)}/versions/${versionId}`;
};

export const createFilePathSafeString = (str: string) => {
    return str.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
}

export const generateProjectVersionFileStorageUrl = (
    userId: string,
    projectId: string,
    versionId: string,
    fileName: string,
) => {
    return `${generateProjectVersionStorageUrl(userId, projectId, versionId)}/${fileName}`;
};

const storeFile = async (path: string, file: File) => {
    await Bun.write(path, file, {
        createPath: true,
    });
};

const deleteDirectory = async (path: string) => {
    await nodefs.rm(path, { recursive: true });
}

export const saveProjectVersionFile = async ({
    fileName,
    userId,
    projectId,
    versionId,
    file,
}: {
    fileName: string;
    userId: string;
    projectId: string;
    versionId: string;
    file: File;
}) => {
    const fileUrl = generateProjectVersionFileStorageUrl(userId, projectId, versionId, fileName);
    const filePath = `${uploadsDir}/${fileUrl}`;

    await storeFile(filePath, file);
    return fileUrl;
};

export const deleteAllUserFiles = async (userId: string) => {
    await deleteDirectory(`${uploadsDir}/${generateUserStorageUrl(userId)}`);
}

export const deleteAllProjectFiles = async (userId: string, projectId: string) => {
    await deleteDirectory(`${uploadsDir}/${generateProjectStorageUrl(userId, projectId)}`);
}

export const deleteAllVersionFiles = async (userId: string, projectId: string, versionId: string) => {
    await deleteDirectory(`${uploadsDir}/${generateProjectVersionStorageUrl(userId, projectId, versionId)}`);
}