import prisma from "../prisma";

interface DownloadsQueueItem {
    ipAddress: string;
    userId?: string;
    projectId: string;
    versionId: string;
}

const QUEUE_PROCESS_INTERVAL = 1800_000; // 30 minutess

// TODO: Use a proper queue with Redis
let downloadsQueueList: DownloadsQueueItem[] = [];
let isQueueProcessing = false;
const maxQueueSize = 100_000;

export const flushDownloadsQueue = async () => {
    downloadsQueueList = [];
};

export const addToDownloadsQueue = async (item: DownloadsQueueItem) => {
    try {
        let isDuplicateDownload = false;
        for (const downloadItem of downloadsQueueList) {
            if (
                downloadItem.projectId === item.projectId &&
                downloadItem.versionId === item.versionId &&
                (downloadItem.ipAddress === item.ipAddress || (!!downloadItem.userId && downloadItem.userId === item.userId))
            ) {
                isDuplicateDownload = true;
                break;
            }
        }

        if (!isDuplicateDownload) {
            downloadsQueueList.push(item);
        }
    } catch (error) {
        console.error(error);
    } finally {
        if (downloadsQueueList.length >= maxQueueSize) {
            processDownloadsQueue();
        }
    }
};

const processDownloadsQueue = async () => {
    try {
        if (downloadsQueueList.length === 0) return;

        if (isQueueProcessing) return;
        isQueueProcessing = true;

        // Copy the current queue and flush the original one
        const list = downloadsQueueList;
        await flushDownloadsQueue();

        // TODO: Limit the number of max downloads on a project from same IP address or user

        // Count the number of downloads for each project and version
        const versionDownloadsMap = new Map<string, number>();
        const projectDownloadsMap = new Map<string, number>();

        for (const queueItem of list) {
            const versionId = queueItem.versionId;
            const projectId = queueItem.projectId;

            versionDownloadsMap.set(versionId, (versionDownloadsMap.get(versionId) || 0) + 1);
            projectDownloadsMap.set(projectId, (projectDownloadsMap.get(projectId) || 0) + 1);
        }

        const promises = [];

        // Update all the versions
        const versionIds = Array.from(versionDownloadsMap.keys());
        for (const versionId of versionIds) {
            const downloadsCount = versionDownloadsMap.get(versionId);
            promises.push(
                prisma.version.update({
                    where: { id: versionId },
                    data: { downloads: { increment: downloadsCount } },
                }),
            );
        }

        // Update all the projects
        const projectIds = Array.from(projectDownloadsMap.keys());
        for (const projectId of projectIds) {
            const downloadsCount = projectDownloadsMap.get(projectId);
            promises.push(
                prisma.project.update({
                    where: { id: projectId },
                    data: { downloads: { increment: downloadsCount } },
                }),
            );
        }

        await Promise.all(promises);
    } catch (error) {
        console.error(error);
    } finally {
        isQueueProcessing = false;
    }
};

export const watchFileDownloadsQueue = async () => {
    // @ts-ignore
    const intervalId = global.intervalId;
    if (intervalId) clearInterval(intervalId);

    // @ts-ignore
    global.intervalId = setInterval(() => {
        processDownloadsQueue();
    }, QUEUE_PROCESS_INTERVAL);
};

process.on("exit", async () => {
    await processDownloadsQueue();
});
