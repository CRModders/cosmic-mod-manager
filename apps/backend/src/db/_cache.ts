import { cacheKey } from "~/services/cache/utils";
import redis from "~/services/redis";
import { parseJson } from "~/utils/str";

const TIME_1HR = 3600;
const TIME_3HR = 10800;
const TIME_6HR = 21600;
const TIME_12HR = 43200;

// User
export const USER_DATA_CACHE_EXPIRY_seconds = TIME_12HR;

// Project
export const PROJECT_CACHE_EXPIRY_seconds = TIME_12HR;
export const VERSION_CACHE_EXPIRY_seconds = TIME_12HR;

// Organization
export const ORGANIZATION_DATA_CACHE_EXPIRY_seconds = TIME_12HR;

// Team
export const TEAM_DATA_CACHE_EXPIRY_seconds = TIME_12HR;

// File
export const FILE_ITEM_EXPIRY_seconds = TIME_12HR;

// Statistics
export const STATISTICS_CACHE_EXPIRY_seconds = TIME_12HR;

export async function GetData_FromCache<T extends object | null>(NAMESPACE: string, key?: string): Promise<T | null> {
    const rawData = await GetRawData_FromCache(NAMESPACE, key);
    if (!rawData) return null;

    return await parseJson<T>(rawData);
}

export async function GetRawData_FromCache(NAMESPACE: string, key?: string): Promise<string | null> {
    if (!key) return null;

    const primaryKeyData = await redis.get(cacheKey(key, NAMESPACE));
    if (!primaryKeyData) return null;

    if (primaryKeyData.startsWith("{") || primaryKeyData.startsWith("[")) return primaryKeyData;

    // If the primaryKeyData is not a JSON object, it is most likely a secondary key
    // Use the primaryKeyData to get the main data
    const secondaryKeyData = await redis.get(cacheKey(primaryKeyData, NAMESPACE));
    if (!secondaryKeyData) return null;

    return secondaryKeyData;
}

export async function SetCache(NAMESPACE: string, key: string, data: string, expiry_seconds: number) {
    await redis.set(cacheKey(key, NAMESPACE), data, "EX", expiry_seconds);
}
