import type { Context, Next } from "hono";

interface CacheHeadersOptions {
    maxAge_s: number;
    sMaxAge_s: number;
}

export function applyCacheHeaders(props: CacheHeadersOptions) {
    return async function cacheHeaders(ctx: Context, next: Next) {
        ctx.res.headers.set("Cache-Control", `public, max-age=${props.maxAge_s}, s-maxage=${props.sMaxAge_s}`);

        await next();
    };
}
