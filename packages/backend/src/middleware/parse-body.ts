import type { Context, Next } from "hono";
import { ctxReqBodyKey } from "../../types";

const bodyParserMiddleware = async (ctx: Context, next: Next) => {
    try {
        const contentType = ctx.req.header()?.["content-type"];
        let body: unknown;

        if (contentType.includes("text/plain")) {
            body = await ctx.req.json();
        } else if (contentType.includes("multipart/form-data")) {
            body = await ctx.req.formData();
        } else {
            body = null;
        }

        ctx.set(ctxReqBodyKey, body || null);
    } catch (error) {}

    await next();
};

export default bodyParserMiddleware;
