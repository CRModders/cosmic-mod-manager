import { $ } from "bun";
import path from "node:path/posix";
import { LOCAL_BASE_STORAGE_PATH } from "../utils";
import { BackupToBackblaze } from "./backblaze";

const FILES_BACKUP_NAME = "files_backup.zip";
const DB_BACKUP_NAME = "db_backup.sql";

const filesDir = path.resolve(LOCAL_BASE_STORAGE_PATH);
const zipPath = path.resolve(LOCAL_BASE_STORAGE_PATH, FILES_BACKUP_NAME);
const dbBackupPath = path.resolve(LOCAL_BASE_STORAGE_PATH, DB_BACKUP_NAME);

export async function BackupLocalData() {
    await RemoveOldBackupFiles();

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

async function CreateDbBackupZip() {
    await $`pg_dump -U postgres -p 5432 crmm_prod > ${dbBackupPath}`;
    return Bun.file(dbBackupPath);
}

async function CreateProjectFilesBackupZip() {
    await $`zip -r ${zipPath} ${filesDir}`;
    return Bun.file(zipPath);
}

async function RemoveOldBackupFiles() {
    // Delete the previous backup files to prevent it from being included in the new backup
    await $`rm -f ${zipPath} && rm -f ${dbBackupPath}`;
}
