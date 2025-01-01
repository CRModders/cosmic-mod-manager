import type { GlobalUserRole } from "@app/utils/types";
import type { User } from "@prisma/client";
import { hashString } from "~/routes/auth/helpers";
import redis from "~/services/redis";
import type { ContextUserData } from "~/types";
import { SESSION_IDS_NAMESPACE, SESSION_TOKENS_NAMESPACE, USER_DATA_NAMESPACE } from "~/types/namespaces";
import { parseJson } from "~/utils/str";
import { cacheKey } from "./utils";

const SESSION_CACHE_EXPIRY_seconds = 300;

// ? Get Session Cache
export async function getUserDataCache(userId: string): Promise<User | null> {
    const userData = await redis.get(cacheKey(userId, USER_DATA_NAMESPACE));
    const user = userData ? await parseJson<User>(userData) : null;

    if (!user) return null;
    return user;
}

export async function getSessionCacheFromId(sessionId: string): Promise<ContextUserData | null> {
    const userId = await redis.get(cacheKey(sessionId, SESSION_IDS_NAMESPACE));
    if (!userId) return null;

    const user = await getUserDataCache(userId);
    if (!user) return null;

    return { ...user, role: user.role as GlobalUserRole, sessionId: sessionId };
}

export async function getSessionCacheFromToken(token: string, isHashed = false): Promise<ContextUserData | null> {
    const tokenHash = isHashed ? token : await hashString(token);
    const sessionId = await redis.get(cacheKey(tokenHash, SESSION_TOKENS_NAMESPACE));

    if (!sessionId) return null;
    return getSessionCacheFromId(sessionId);
}

// ? Set Session Cache
export async function setUserDataCache(userId: string, user: User) {
    await redis.set(cacheKey(userId, USER_DATA_NAMESPACE), JSON.stringify(user), "EX", SESSION_CACHE_EXPIRY_seconds);
}

export async function setSessionIdCache(userId: string, sessionId: string, user?: User) {
    await redis.set(cacheKey(sessionId, SESSION_IDS_NAMESPACE), userId, "EX", SESSION_CACHE_EXPIRY_seconds);

    if (user) await setUserDataCache(userId, user);
}

export async function setSessionTokenCache(tokenHash: string, sessionId: string, userId?: string, user?: User) {
    await redis.set(cacheKey(tokenHash, SESSION_TOKENS_NAMESPACE), sessionId, "EX", SESSION_CACHE_EXPIRY_seconds);

    if (userId) await setSessionIdCache(userId, sessionId, user);
    if (user && userId) await setUserDataCache(userId, user);
}

// ? Delete Session Cache
export async function deleteUserDataCache(userId: string) {
    await redis.del(cacheKey(userId, USER_DATA_NAMESPACE));
}

export async function deleteSessionIdCache(sessionId: string) {
    await redis.del(cacheKey(sessionId, SESSION_IDS_NAMESPACE));
}

export async function deleteSessionTokenCache(tokenHashes: string[]) {
    const keys = tokenHashes.map((hash) => cacheKey(hash, SESSION_TOKENS_NAMESPACE));
    await redis.del(keys);
}

export async function deleteSessionTokenAndIdCache(tokenHashes: string[], sessionIds: string[]) {
    const p1 = deleteSessionTokenCache(tokenHashes);

    const sessionIdKeys = sessionIds.map((id) => cacheKey(id, SESSION_IDS_NAMESPACE));
    const p2 = redis.del(sessionIdKeys);

    await Promise.all([p1, p2]);
}
