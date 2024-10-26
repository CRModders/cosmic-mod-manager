import { REQ_BODY_NAMESPACE } from "@/types/namespaces";
import type { Context, Next } from "hono";

const bodyParserMiddleware = async (ctx: Context, next: Next) => {
    try {
        const contentType = ctx.req.header()?.["content-type"];
        let body: unknown;

        if (contentType.includes("text/plain") || contentType.includes("application/json")) {
            body = await ctx.req.json();
        } else if (contentType.includes("multipart/form-data")) {
            body = await ctx.req.formData();
        } else {
            body = null;
        }

        ctx.set(REQ_BODY_NAMESPACE, body || null);
    } catch (error) {}

    await next();
};

export default bodyParserMiddleware;
