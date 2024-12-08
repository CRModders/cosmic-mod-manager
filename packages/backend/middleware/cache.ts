import type { Context, Next } from "hono";

interface CacheHeadersOptions {
    maxAge: number;
    sMaxAge: number;
}

export function applyCacheHeaders(props: CacheHeadersOptions) {
    return async function cacheHeaders(ctx: Context, next: Next) {
        ctx.res.headers.set("Cache-Control", `public, max-age=${props.maxAge}, s-maxage=${props.sMaxAge}`);

        await next();
    };
}
