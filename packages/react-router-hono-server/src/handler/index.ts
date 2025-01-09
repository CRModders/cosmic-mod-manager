import type { Context } from "hono";
import type { AppLoadContext, ServerBuild } from "react-router";
import { createRequestHandler as createRemixRequestHandler } from "react-router";

export type GetLoadContextFunction = (ctx: Context) => Promise<AppLoadContext> | AppLoadContext;
export type RequestHandler = (ctx: Context) => Promise<Response>;

interface CreateRequestHandlerProps {
    build: ServerBuild | (() => Promise<ServerBuild>);
    getLoadContext?: GetLoadContextFunction;
    mode?: string;
}

export function createRequestHandler({
    build,
    getLoadContext,
    mode = process.env.NODE_ENV,
}: CreateRequestHandlerProps): RequestHandler {
    const handleRequest = createRemixRequestHandler(build, mode);

    return async (ctx) => {
        try {
            const loadContext = await getLoadContext?.(ctx);
            const response = await handleRequest(ctx.req.raw, loadContext);

            return response;
        } catch (error: unknown) {
            console.error(error);
            return new Response("Internal Server Error", { status: 500 });
        }
    };
}