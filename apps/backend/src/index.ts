import type { SocketAddress } from "bun";
import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import bodyParserMiddleware from "~/middleware/body-parser";
import { applyCacheHeaders } from "~/middleware/cache";
import { logger } from "~/middleware/logger";
import { ddosProtectionRateLimiter } from "~/middleware/rate-limit/ddos";
import { startSitemapGenerator } from "~/services/sitemap-gen";
import { queueDownloadsCounterQueueProcessing } from "~/src/cdn/downloads-counter";
import queueSearchDbSync from "~/src/search/sync-queue";
import env from "~/utils/env";
import { HTTP_STATUS, serverErrorResponse } from "~/utils/http";
import authRouter from "./auth/router";
import cdnRouter from "./cdn/router";
import bulkProjectsRouter from "./project/bulk_router";
import bulkOrgsRouter from "./project/organisation/bulk_router";
import orgRouter from "./project/organisation/router";
import projectRouter from "./project/router";
import teamRouter from "./project/team/router";
import searchRouter from "./search/router";
import { getStatistics } from "./statistics";
import tagsRouter from "./tags";
import bulkUserActionsRouter from "./user/bulk_actions/router";
import notificationRouter from "./user/notification/router";
import userRouter from "./user/router";

const app = new Hono<{ Bindings: { ip: SocketAddress } }>();
const corsAllowedOrigins = env.CORS_ALLOWED_URLS.split(" ");

app.use(ddosProtectionRateLimiter);
app.use(logger());
app.use(
    cors({
        origin: (origin, ctx) => {
            // Allow all requests from allowed origins
            for (const allowedOrigin of corsAllowedOrigins) {
                if (origin?.endsWith(allowedOrigin)) {
                    return origin;
                }
            }

            // Allow GET requests from all origins
            if (ctx.req.method === "GET") {
                return ctx.req.header("Origin") || "*";
            }

            return corsAllowedOrigins[0];
        },
        credentials: true,
    }),
);
app.use(bodyParserMiddleware);

// Routes
app.route("/api/auth", authRouter);
app.route("/api/search", searchRouter);
app.route("/api/tags", tagsRouter);

app.route("/api/user", userRouter);
app.route("/api/users", bulkUserActionsRouter);

app.route("/api/notifications", notificationRouter); // Uses the userSession's userId instead of getting it from the URL
app.route("/api/user/:userId/notifications", notificationRouter);

app.route("/api/project", projectRouter);
app.route("/api/projects", bulkProjectsRouter);

app.route("/api/team", teamRouter);
app.route("/api/organization", orgRouter);
app.route("/api/organizations", bulkOrgsRouter); // Uses the userSession's userId instead of getting it from the URL
app.route("/api/user/:userId/organization", orgRouter);

app.route("/cdn", cdnRouter);

// Some inlined routes
app.get("/favicon.ico", async (ctx: Context) => {
    return ctx.redirect("https://crmm.tech/favicon.ico");
});

app.get("/", apiDetails);
app.get("/api", apiDetails);
app.get("/api/statistics", applyCacheHeaders({ maxAge: 600, sMaxAge: 7200 }), async (ctx: Context) => {
    try {
        const stats = await getStatistics();

        return ctx.json(stats, HTTP_STATUS.OK);
    } catch (error) {
        return serverErrorResponse(ctx);
    }
});

Bun.serve({
    port: 5500,
    fetch(req, server) {
        return app.fetch(req, { ip: server.requestIP(req) });
    },
});

async function apiDetails(ctx: Context) {
    return ctx.json(
        {
            message: "Hello visitor! Welcome to the CRMM API.",
            website: "https://crmm.tech",
            docs: "https://docs.crmm.tech",
            status: "https://status.crmm.tech",
            cdn: env.CACHE_CDN_URL,
        },
        HTTP_STATUS.OK,
    );
}

// Start the sync queues
await queueDownloadsCounterQueueProcessing();
await queueSearchDbSync();
await startSitemapGenerator();
