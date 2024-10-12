import { getUserIpAddress } from "@/controllers/auth/commons";
import redis from "@/services/redis";
import { status } from "@/utils/http";
import type { Seconds } from "@shared/types/time";
import type { Context, Next } from "hono";

const API_RATE_LIMIT_PREFIX = "rateLimit";
const CDN_ASSETS_RATE_LIMIT_PREFIX = "cdnRateLimit";
const CDN_LARGE_FILES_RATE_LIMIT_PREFIX = "cdnLargeFilesRateLimit";
const SEARCH_RATE_LIMIT_PREFIX = "searchApiRateLimit";

const rateLimitKey = (key: string, prefix: string) => `${prefix}:${key}`;

interface RateLimit {
    isRateLimited: boolean;
    remainingLimit: number;
    totalLimit: number;
    timeWindow: number;
}

const rateLimiter = async (
    ctx: Context,
    keyPrefix: string,
    timeWindow: Seconds,
    totalLimit: number,
    setHeaders = true,
): Promise<RateLimit> => {
    try {
        const ipAddr = getUserIpAddress(ctx);
        const key = rateLimitKey(ipAddr || "", keyPrefix);

        let count = Number.parseInt((await redis.get(key)) || "-1");
        if (count === -1) {
            await redis.set(key, 1, "EX", timeWindow);
            count = 1;
        } else if (count < totalLimit) {
            await redis.incr(key);
        }

        const remainingLimit = Math.max(totalLimit - count, 0);
        if (setHeaders === true) {
            ctx.res.headers.set("X-Ratelimit-Type", keyPrefix);
            ctx.res.headers.set("X-Ratelimit-Remaining", `${remainingLimit}`);
            ctx.res.headers.set("X-Ratelimit-Limit", `${totalLimit}`);
            ctx.res.headers.set("X-Ratelimit-Reset", `${timeWindow}`);
        }

        if (count < totalLimit) {
            return {
                isRateLimited: false,
                remainingLimit: remainingLimit,
                totalLimit: totalLimit,
                timeWindow: timeWindow,
            };
        }
    } catch (error) {
        console.error(error);
        ctx.res.headers.set("X-Ratelimit-Remaining", `${0}`);
    }

    return {
        isRateLimited: true,
        remainingLimit: 0,
        timeWindow: timeWindow,
        totalLimit: totalLimit,
    };
};

export const ddosPreventionRateLimiterMiddleware = async (ctx: Context, next: Next) => {
    const rateLimitResult = await rateLimiter(ctx, "ddosPrevention", rateLimits.ddosProtection.timeWindow, rateLimits.ddosProtection.limit);
    if (rateLimitResult.isRateLimited) {
        return ctx.json(
            { success: false, message: `Rate limit exceeded, please try again after ${rateLimitResult.timeWindow} seconds` },
            status.TOO_MANY_REQUESTS,
        );
    }

    await next();
};

export const apiRateLimiterMiddleware = async (ctx: Context, next: Next) => {
    const rateLimitResult = await rateLimiter(ctx, API_RATE_LIMIT_PREFIX, rateLimits.global.timeWindow, rateLimits.global.limit);
    if (rateLimitResult.isRateLimited) {
        return ctx.json(
            { success: false, message: `Rate limit exceeded, please try again after ${rateLimitResult.timeWindow / 60} minutes` },
            status.TOO_MANY_REQUESTS,
        );
    }

    await next();
};

export const searchApiRateLimiterMiddleware = async (ctx: Context, next: Next) => {
    const rateLimitResult = await rateLimiter(ctx, SEARCH_RATE_LIMIT_PREFIX, rateLimits.searchApi.timeWindow, rateLimits.searchApi.limit);
    if (rateLimitResult.isRateLimited) {
        return ctx.json(
            { success: false, message: `Rate limit exceeded, please try again after ${rateLimitResult.timeWindow} seconds` },
            status.TOO_MANY_REQUESTS,
        );
    }

    await next();
};

export const cdn_assetsRateLimiterMiddleware = async (ctx: Context, next: Next) => {
    const rateLimitResult = await rateLimiter(
        ctx,
        CDN_ASSETS_RATE_LIMIT_PREFIX,
        rateLimits.cdnAssets.timeWindow,
        rateLimits.cdnAssets.limit,
    );
    if (rateLimitResult.isRateLimited) {
        return ctx.json(
            { success: false, message: `Rate limit exceeded, please try again after ${rateLimitResult.timeWindow} seconds` },
            status.TOO_MANY_REQUESTS,
        );
    }

    await next();
};

export const cdn_large_filesRateLimiterMiddleware = async (ctx: Context, next: Next) => {
    const rateLimitResult = await rateLimiter(
        ctx,
        CDN_LARGE_FILES_RATE_LIMIT_PREFIX,
        rateLimits.cdnLargeFiles.timeWindow,
        rateLimits.cdnLargeFiles.limit,
    );
    if (rateLimitResult.isRateLimited) {
        return ctx.json(
            { success: false, message: `Rate limit exceeded, please try again after ${rateLimitResult.timeWindow} seconds` },
            status.TOO_MANY_REQUESTS,
        );
    }

    await next();
};

export const addToUsedApiRateLimit = async (ctx: Context, incrementBy = 1) => {
    try {
        const ipAddr = getUserIpAddress(ctx);
        const key = rateLimitKey(ipAddr || "", API_RATE_LIMIT_PREFIX);

        const count = Number.parseInt((await redis.get(key)) || "-1");
        if (count < rateLimits.global.limit) {
            await redis.incrby(key, Math.min(incrementBy, rateLimits.global.limit - count));
        }

        ctx.res.headers.set("X-Ratelimit-Remaining", `${Math.max(rateLimits.global.limit - (count + incrementBy), 0)}`);

        return incrementBy;
    } catch (err) {
        console.error(err);
        return null;
    }
};

interface RateLimitItem {
    limit: number;
    timeWindow: Seconds;
}

interface RateLimits {
    ddosProtection: RateLimitItem;
    global: RateLimitItem;
    searchApi: RateLimitItem;
    cdnAssets: RateLimitItem;
    cdnLargeFiles: RateLimitItem;
}

// Number of requests in a time window (seconds)
const rateLimits: RateLimits = {
    ddosProtection: {
        limit: 100,
        timeWindow: 5,
    },
    global: {
        limit: 300,
        timeWindow: 300,
    },
    searchApi: {
        limit: 1000,
        timeWindow: 300,
    },
    cdnAssets: {
        limit: 100,
        timeWindow: 60,
    },
    cdnLargeFiles: {
        limit: 60,
        timeWindow: 60,
    },
};
