import type { SocketAddress } from "bun";
import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import bodyParserMiddleware from "~/middleware/body-parser";
import { applyCacheHeaders } from "~/middleware/cache";
import { logger } from "~/middleware/logger";
import { ddosProtectionRateLimiter } from "~/middleware/rate-limit/ddos";
import authRouter from "~/routes/auth/router";
import { queueDownloadsCounterQueueProcessing } from "~/routes/cdn/downloads-counter";
import cdnRouter from "~/routes/cdn/router";
import bulkProjectsRouter from "~/routes/project/bulk_router";
import moderationRouter from "~/routes/project/moderation/router";
import bulkOrgsRouter from "~/routes/project/organisation/bulk_router";
import orgRouter from "~/routes/project/organisation/router";
import projectRouter from "~/routes/project/router";
import teamRouter from "~/routes/project/team/router";
import searchRouter from "~/routes/search/router";
import bulkUserActionsRouter from "~/routes/user/bulk_actions/router";
import notificationRouter from "~/routes/user/notification/router";
import userRouter from "~/routes/user/router";
import { versionFileRouter, versionFiles_Router } from "~/routes/version-file/router";
import { startSitemapGenerator } from "~/services/sitemap-gen";
import { getStatistics } from "~/statistics";
import tagsRouter from "~/tags";
import env from "~/utils/env";
import { HTTP_STATUS, serverErrorResponse } from "~/utils/http";
import { QueueSearchIndexUpdate } from "./routes/search/search-db";

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
app.route("/api/version-file", versionFileRouter);
app.route("/api/version-files", versionFiles_Router);
app.route("/api/projects", bulkProjectsRouter);
app.route("/api/moderation", moderationRouter);

app.route("/api/team", teamRouter);
app.route("/api/organization", orgRouter); // Uses the userSession's userId instead of getting it from the URL
app.route("/api/user/:userId/organization", orgRouter);
app.route("/api/organizations", bulkOrgsRouter);

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

// Initialize the queues
await queueDownloadsCounterQueueProcessing();
await QueueSearchIndexUpdate();
await startSitemapGenerator();
