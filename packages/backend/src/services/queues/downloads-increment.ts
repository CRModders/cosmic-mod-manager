import prisma from "../prisma";
import redis from "../redis";

interface DownloadsQueueItem {
    ipAddress: string;
    userId?: string;
    projectId: string;
    versionId: string;
}

const QUEUE_PROCESS_INTERVAL = 3600_000; // 60 minutes
const DOWNLOADS_QUEUE_KEY = "downloads-queue";

let isQueueProcessing = false;
const maxQueueSize = 100_000;

export const getDownloadsCounterQueue = async (removeItems = false) => {
    const luaScript = `
        local listName = KEYS[1]
        local listLength = redis.call('LLEN', listName)
        local items = redis.call('LRANGE', listName, 0, -1)
        ${removeItems === true ? "redis.call('DEL', listName)" : ""}
        return items
    `;

    const list = (await redis.eval(luaScript, 1, DOWNLOADS_QUEUE_KEY)) as string[];
    const listItems: DownloadsQueueItem[] = [];

    for (const item of list) {
        listItems.push(JSON.parse(item));
    }

    return listItems;
};

export const flushDownloadsQueue = async () => {
    await redis.del(DOWNLOADS_QUEUE_KEY);
};

export const addToDownloadsQueue = async (item: DownloadsQueueItem) => {
    const downloadsQueueList = await getDownloadsCounterQueue();
    try {
        if (!downloadsQueueList) return null;

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
            await redis.lpush(DOWNLOADS_QUEUE_KEY, JSON.stringify(item));
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
    const downloadsQueueList = await getDownloadsCounterQueue(true);
    try {
        if (downloadsQueueList.length === 0) return;

        if (isQueueProcessing) return;
        isQueueProcessing = true;

        // TODO: Limit the number of max downloads on a project from same IP address or user

        // Count the number of downloads for each project and version
        const versionDownloadsMap = new Map<string, number>();
        const projectDownloadsMap = new Map<string, number>();

        for (const queueItem of downloadsQueueList) {
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

// Process the queue on startup for any leftover items
processDownloadsQueue();
