export const USER_SESSION_CACHE_VALIDITY = 150; // Seconds

export const userSessionCacheKey = (userId: string) => `cached-user-session-${userId}`;