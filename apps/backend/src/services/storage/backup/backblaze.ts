import { S3Client, type S3File, type BunFile } from "bun";
import env from "~/utils/env";

const b2_client = new S3Client({
    bucket: "crmm-project-files",
    endpoint: "https://s3.eu-central-003.backblazeb2.com",
    region: "eu-central-003",
    accessKeyId: env.BACKBLAZE_BACKUP_API_KEY_ID,
    secretAccessKey: env.BACKBLAZE_BACKUP_API_KEY,
});

export async function BackupToBackblaze(backupFile: BunFile, fileName: string) {
    // Using two references of the backup file so that the older one can be deleted
    // only after the newer backup is successfully uploaded
    const backup_ref = b2_client.file(fileName);
    const alt_backup_ref = b2_client.file(AltFileName(fileName));

    if (await backup_ref.exists()) {
        await UploadBackupFile(backupFile, alt_backup_ref);
        await backup_ref.delete();
        return;
    }

    await UploadBackupFile(backupFile, backup_ref);
    await alt_backup_ref.delete();
    return;
}

async function UploadBackupFile(file: BunFile, s3_ref: S3File) {
    const chunkSize = 10 * 1024 * 1024; // 10MB

    const writer = s3_ref.writer({
        retry: 3,
        queueSize: 10,
        partSize: chunkSize,
    });

    const stream = file.stream();
    const reader = stream.getReader();

    const buffer = new Uint8Array(chunkSize);
    let offset = 0;
    let readComplete = false;
    // This variable is used to store the size of the first chunk read, just to estimate the chunk size of the stream read
    let readChunkSize = 0;

    console.log(`Uploading backup file to backblaze. Ref: ${s3_ref.name}`);
    while (!readComplete) {
        const _res = await reader.read();

        if (_res.done) {
            readComplete = true;
        }

        if (_res.value) {
            buffer.set(_res.value, offset);
            offset += _res.value.length;

            if (!readChunkSize) readChunkSize = _res.value.length;
        }

        // Adding the read buffer length again just to check if the buffer can fit the next chunk
        // If it can't, then write the chunk to the writer and reset the offset
        if (readComplete || offset + readChunkSize >= chunkSize) {
            const chunk = buffer.slice(0, offset);
            writer.write(chunk);
            offset = 0;
        }
    }

    await writer.end();
    console.log(`Backup file uploaded to backblaze. ${s3_ref.name} ${file.size} bytes`);
}

function AltFileName(fileName: string) {
    const parts = fileName.split(".");
    return `${parts[0]}_alt.${parts[1]}`;
}
