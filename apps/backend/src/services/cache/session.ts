import type { GlobalUserRole } from "@app/utils/types";
import { GetUser_ByIdOrUsername } from "~/db/user_item";
import { hashString } from "~/routes/auth/helpers";
import valkey from "~/services/redis";
import type { ContextUserData } from "~/types";
import { SESSION_IDS_CACHE_KEY, SESSION_TOKENS_CACHE_KEY } from "~/types/namespaces";
import { cacheKey } from "./utils";

const SESSION_CACHE_EXPIRY_seconds = 600; // 10 minutes

// ? Get Session Cache
export async function getSessionCacheFromId(sessionId: string): Promise<ContextUserData | null> {
    const userId = await valkey.get(cacheKey(sessionId, SESSION_IDS_CACHE_KEY));
    if (!userId) return null;

    const user = await GetUser_ByIdOrUsername(undefined, userId);
    if (!user) return null;

    return { ...user, name: user.name || user.userName, role: user.role as GlobalUserRole, sessionId: sessionId };
}

export async function getSessionCacheFromToken(token: string, isHashed = false): Promise<ContextUserData | null> {
    const tokenHash = isHashed ? token : await hashString(token);
    const sessionId = await valkey.get(cacheKey(tokenHash, SESSION_TOKENS_CACHE_KEY));

    if (!sessionId) return null;
    return getSessionCacheFromId(sessionId);
}

// ? Set Session Cache
export async function setSessionIdCache(userId: string, sessionId: string) {
    await valkey.set(cacheKey(sessionId, SESSION_IDS_CACHE_KEY), userId, "EX", SESSION_CACHE_EXPIRY_seconds);
}

export async function setSessionTokenCache(tokenHash: string, sessionId: string, userId?: string) {
    await valkey.set(cacheKey(tokenHash, SESSION_TOKENS_CACHE_KEY), sessionId, "EX", SESSION_CACHE_EXPIRY_seconds);

    if (userId) await setSessionIdCache(userId, sessionId);
}

// ? Delete Session Cache
export async function deleteSessionIdCache(sessionId: string) {
    await valkey.del(cacheKey(sessionId, SESSION_IDS_CACHE_KEY));
}

export async function deleteSessionTokenCache(tokenHashes: string[]) {
    const keys = tokenHashes.map((hash) => cacheKey(hash, SESSION_TOKENS_CACHE_KEY));
    await valkey.del(keys);
}

export async function deleteSessionTokenAndIdCache(tokenHashes: string[], sessionIds: string[]) {
    const p1 = deleteSessionTokenCache(tokenHashes);

    const sessionIdKeys = sessionIds.map((id) => cacheKey(id, SESSION_IDS_CACHE_KEY));
    const p2 = valkey.del(sessionIdKeys);

    await Promise.all([p1, p2]);
}
