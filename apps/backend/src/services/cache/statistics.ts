import type { Statistics } from "@app/utils/types/api/stats";
import { STATISTICS_NAMESPACE } from "~/types/namespaces";
import { parseJson } from "~/utils/str";
import redis from "../redis";

const STATISTICS_CACHE_EXPIRY_seconds = 21600; // 6 hours

export async function getStatisticsCache() {
    const str = await redis.get(STATISTICS_NAMESPACE);
    return await parseJson<Statistics>(str);
}

export async function setStatisticsCache(data: Statistics) {
    const str = JSON.stringify(data);
    await redis.set(STATISTICS_NAMESPACE, str, "EX", STATISTICS_CACHE_EXPIRY_seconds);
}
