import type { Context } from "hono";

interface HeadersData {
    remaining: number;
    max: number;
    timeWindow_seconds: number;
}

export function setRateLimitHeaders(ctx: Context, { remaining, max, timeWindow_seconds }: HeadersData) {
    ctx.res.headers.set("X-Ratelimit-Remaining", `${remaining}`);
    ctx.res.headers.set("X-Ratelimit-Limit", `${max}`);
    ctx.res.headers.set("X-Ratelimit-Reset", `${timeWindow_seconds}`);
}
