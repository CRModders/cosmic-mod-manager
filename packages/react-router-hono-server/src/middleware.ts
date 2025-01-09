import { createMiddleware } from "hono/factory";

export function cache(seconds: number) {
    return createMiddleware(async (ctx, next) => {
        if (!ctx.req.path.match(/\.[a-zA-Z0-9]+$/) || ctx.req.path.endsWith(".data")) {
            return next();
        }

        await next();

        if (!ctx.res.ok) {
            return;
        }

        ctx.res.headers.set("cache-control", `public, max-age=${seconds}`);
    });
}
