import { nanoid } from "nanoid";
import prisma from "../prisma";
import redis from "../redis";

interface DownloadsQueueItem {
    id: string;
    ipAddress: string;
    userId?: string;
    projectId: string;
    versionId: string;
}

const QUEUE_PROCESS_INTERVAL = 300_000; // 5 minutes
const HISTORY_VALIDITY = 5400_000; // 1.5 hours

const DOWNLOADS_QUEUE_KEY = "downloads-counter-queue";
const DOWNLOADS_HISTORY_KEY = "downloads-history";

let isQueueProcessing = false;
const maxQueueSize = 100_000;

const getDownloadsHistory = async () => {
    const list: DownloadsQueueItem[] = [];
    const historyItems = await redis.lrange(DOWNLOADS_HISTORY_KEY, 0, -1);

    for (const item of historyItems) {
        try {
            list.push(JSON.parse(item) as DownloadsQueueItem);
        } catch {}
    }

    return list;
};

const refreshDownloadsHistory = async () => {
    await redis.del(DOWNLOADS_HISTORY_KEY);
};

const addToHistory = async (item: DownloadsQueueItem) => {
    await redis.lpush(DOWNLOADS_HISTORY_KEY, JSON.stringify(item));
};

const queueDownloadsHistoryRefresh = () => {
    // @ts-ignore
    const intervalId = global.historyRefreshIntervalId;
    if (intervalId) clearInterval(intervalId);

    // @ts-ignore
    global.historyRefreshIntervalId = setTimeout(refreshDownloadsHistory, HISTORY_VALIDITY);
};

const flushDownloadsCounterQueue = async () => {
    await redis.del(DOWNLOADS_QUEUE_KEY);
};

const getDownloadsCounterQueue = async (flushQueue = false) => {
    const list = await redis.lrange(DOWNLOADS_QUEUE_KEY, 0, -1);
    if (flushQueue === true) await flushDownloadsCounterQueue();

    const listItems: DownloadsQueueItem[] = [];
    for (const item of list) {
        try {
            listItems.push(JSON.parse(item));
        } catch {}
    }

    return listItems;
};

const getDownloadsCounterQueueLength = async () => {
    return await redis.llen(DOWNLOADS_QUEUE_KEY);
};

const processDownloads = async () => {
    try {
        if (isQueueProcessing) return;
        isQueueProcessing = true;

        const downloadsQueue = await getDownloadsCounterQueue(true);
        const downloadsHistory = await getDownloadsHistory();

        const versionDownloadsMap = new Map<string, number>();
        const projectDownloadsMap = new Map<string, number>();

        for (const queueItem of downloadsQueue) {
            let isDuplicateDownload = false;
            for (const historyItem of downloadsHistory) {
                if (
                    historyItem.id !== queueItem.id &&
                    historyItem.projectId === queueItem.projectId &&
                    (historyItem.ipAddress === queueItem.ipAddress || (!!historyItem.userId && historyItem.userId === queueItem.userId))
                ) {
                    isDuplicateDownload = true;
                    break;
                }
            }

            if (!isDuplicateDownload) {
                await addToHistory(queueItem);
                downloadsHistory.push(queueItem);

                versionDownloadsMap.set(queueItem.versionId, (versionDownloadsMap.get(queueItem.versionId) || 0) + 1);
                projectDownloadsMap.set(queueItem.projectId, (projectDownloadsMap.get(queueItem.projectId) || 0) + 1);
            }
        }

        const promises = [];

        // Update all the versions
        const versionIds = Array.from(versionDownloadsMap.keys());
        for (const versionId of versionIds) {
            const downloadsCount = versionDownloadsMap.get(versionId);
            try {
                promises.push(
                    prisma.version.update({
                        where: { id: versionId },
                        data: { downloads: { increment: downloadsCount } },
                    }),
                );
            } catch {}
        }

        // Update all the projects
        const projectIds = Array.from(projectDownloadsMap.keys());
        for (const projectId of projectIds) {
            const downloadsCount = projectDownloadsMap.get(projectId);
            try {
                promises.push(
                    prisma.project.update({
                        where: { id: projectId },
                        data: { downloads: { increment: downloadsCount } },
                    }),
                );
            } catch {}
        }

        await Promise.all(promises);
    } finally {
        isQueueProcessing = false;
    }
};

export const queueDownloadsCounterQueueProcessing = async () => {
    // @ts-ignore
    const intervalId = global.downloadsCounterQueueIntervalId;
    if (intervalId) clearInterval(intervalId);

    // @ts-ignore
    global.downloadsCounterQueueIntervalId = setInterval(processDownloads, QUEUE_PROCESS_INTERVAL);
};

export const addToDownloadsQueue = async (item: Omit<DownloadsQueueItem, "id">) => {
    await redis.lpush(DOWNLOADS_QUEUE_KEY, JSON.stringify({ ...item, id: nanoid(16) }));
    const queueLength = await getDownloadsCounterQueueLength();

    if (queueLength >= maxQueueSize) {
        await processDownloads();
    }
};

//
processDownloads();
queueDownloadsHistoryRefresh();
