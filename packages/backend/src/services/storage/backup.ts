import { FILE_STORAGE_SERVICE } from "@/../types";
import { saveFile } from "./index";

export const defaultBackupService = FILE_STORAGE_SERVICE.LOCAL;
export const defaultBackupPath = "backups";

export const createFileBackup = async (file: File, path: string, storageService = defaultBackupService) => {
    return await saveFile(storageService, file, `${defaultBackupPath}/${path}`);
};
