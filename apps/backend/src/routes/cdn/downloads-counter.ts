import prisma from "~/services/prisma";
import redis from "~/services/redis";
import { generateRandomId } from "~/utils/str";

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

const MAX_DOWNLOADS_PER_USER_PER_HISTORY_WINDOW = 3;

async function getDownloadsHistory() {
    const list: DownloadsQueueItem[] = [];
    const historyItems = await redis.lrange(DOWNLOADS_HISTORY_KEY, 0, -1);

    for (let i = 0; i < historyItems.length; i++) {
        const item = historyItems[i];
        try {
            list.push(JSON.parse(item) as DownloadsQueueItem);
        } catch {}
    }

    return list;
}

async function refreshDownloadsHistory() {
    await redis.del(DOWNLOADS_HISTORY_KEY);
}

async function addToHistory(item: DownloadsQueueItem) {
    await redis.lpush(DOWNLOADS_HISTORY_KEY, JSON.stringify(item));
}

function queueDownloadsHistoryRefresh() {
    // @ts-ignore
    const intervalId = global.historyRefreshIntervalId;
    if (intervalId) clearInterval(intervalId);

    // @ts-ignore
    global.historyRefreshIntervalId = setTimeout(refreshDownloadsHistory, HISTORY_VALIDITY);
}

async function flushDownloadsCounterQueue() {
    await redis.del(DOWNLOADS_QUEUE_KEY);
}

async function getDownloadsCounterQueue(flushQueue = false) {
    const list = await redis.lrange(DOWNLOADS_QUEUE_KEY, 0, -1);
    if (flushQueue === true) await flushDownloadsCounterQueue();

    const listItems: DownloadsQueueItem[] = [];
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        try {
            listItems.push(JSON.parse(item));
        } catch {}
    }

    return listItems;
}

export async function processDownloads() {
    try {
        if (await DownloadsProcessing()) return;
        await SetDownloadsProcessing(true);

        const downloadsQueue = await getDownloadsCounterQueue(true);
        const downloadsHistory = await getDownloadsHistory();

        const versionDownloadsMap = new Map<string, number>();
        const projectDownloadsMap = new Map<string, number>();

        // History counters
        const userDownloadsHistory = new Map<string, number>();
        const ipDownloadsHistory = new Map<string, number>();
        const userDownloadsHistoryMapKey = (userId: string, projectId: string) => `${userId}:${projectId}`;
        const ipDownloadsHistoryMapKey = (ipAddr: string, projectId: string) => `${ipAddr}:${projectId}`;

        for (let i = 0; i < downloadsQueue.length; i++) {
            const queueItem = downloadsQueue[i];
            let isDuplicateDownload = false;

            for (let j = 0; j < downloadsHistory.length; j++) {
                const historyItem = downloadsHistory[j];
                const userDownloads =
                    userDownloadsHistory.get(userDownloadsHistoryMapKey(queueItem.userId || "", queueItem.projectId)) || 0;
                const ipDownloads = ipDownloadsHistory.get(ipDownloadsHistoryMapKey(queueItem.ipAddress, queueItem.projectId)) || 0;

                userDownloadsHistory.set(userDownloadsHistoryMapKey(historyItem.userId || "", historyItem.projectId), userDownloads + 1);
                ipDownloadsHistory.set(ipDownloadsHistoryMapKey(historyItem.ipAddress, historyItem.projectId), ipDownloads + 1);

                if (
                    historyItem.id !== queueItem.id &&
                    historyItem.projectId === queueItem.projectId &&
                    (historyItem.ipAddress === queueItem.ipAddress || (!!historyItem.userId && historyItem.userId === queueItem.userId)) &&
                    (historyItem.versionId === queueItem.versionId ||
                        userDownloads >= MAX_DOWNLOADS_PER_USER_PER_HISTORY_WINDOW ||
                        ipDownloads >= MAX_DOWNLOADS_PER_USER_PER_HISTORY_WINDOW)
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
        await SetDownloadsProcessing(false);
    }
}

export async function queueDownloadsCounterQueueProcessing() {
    // @ts-ignore
    const intervalId = global.downloadsCounterQueueIntervalId;
    if (intervalId) clearInterval(intervalId);

    // @ts-ignore
    global.downloadsCounterQueueIntervalId = setInterval(processDownloads, QUEUE_PROCESS_INTERVAL);
}

export async function DownloadsProcessing() {
    return (await redis.get("downloadsQueueProcessing")) === "true";
}

export async function SetDownloadsProcessing(val: boolean) {
    await redis.set("downloadsQueueProcessing", val === true ? "true" : "false");
}

export async function addToDownloadsQueue(item: Omit<DownloadsQueueItem, "id">) {
    await redis.lpush(DOWNLOADS_QUEUE_KEY, JSON.stringify({ ...item, id: generateRandomId() }));
}

//
processDownloads();
queueDownloadsHistoryRefresh();
