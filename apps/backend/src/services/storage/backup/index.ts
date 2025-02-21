import { $ } from "bun";
import path from "node:path/posix";
import { LOCAL_BASE_STORAGE_PATH } from "../utils";
import { BackupToBackblaze } from "./backblaze";

const FILES_BACKUP_NAME = "files_backup.zip";
const DB_BACKUP_NAME = "db_backup.sql";

export async function BackupLocalData() {
    console.log("STARTING PROJECT FILES BACKUP...");
    const projectFilesBackupZip = await CreateProjectFilesBackupZip();
    await BackupToBackblaze(projectFilesBackupZip, FILES_BACKUP_NAME);
    console.log("PROJECT FILES BACKUP FINISHED!");

    console.log("STARTING DB BACKUP...");
    const dbBackup = await CreateDbBackupZip();
    await BackupToBackblaze(dbBackup, DB_BACKUP_NAME);
    console.log("DB BACKUP FINISHED!");
}
await BackupLocalData();

export async function CreateDbBackupZip() {
    const dbBackupPath = path.resolve(LOCAL_BASE_STORAGE_PATH, DB_BACKUP_NAME);

    await $`rm -f ${dbBackupPath}`;
    await $`pg_dump -U postgres -p 5432 crmm_prod > ${dbBackupPath}`;

    return Bun.file(dbBackupPath);
}

export async function CreateProjectFilesBackupZip() {
    const filesDir = path.resolve(LOCAL_BASE_STORAGE_PATH);
    const zipPath = path.resolve(LOCAL_BASE_STORAGE_PATH, FILES_BACKUP_NAME);

    // Delete the previous backup file to prevent it from being included in the new backup
    await $`rm -f ${zipPath}`;
    await $`zip -r ${zipPath} ${filesDir}`;

    return Bun.file(zipPath);
}
