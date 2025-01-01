import { DownloadsProcessing, processDownloads } from "./downloads-counter";

if ((await DownloadsProcessing()) === false) {
    await processDownloads();
} else {
    while ((await DownloadsProcessing()) === true) {
        await new Promise((res) => setTimeout(res, 100));
    }
}

process.exit(0);
