export const USER_SESSION_CACHE_VALIDITY = 150; // Seconds

export function userSessionCacheKey(userId: string) {
    return `cached-user-session-${userId}`;
}
