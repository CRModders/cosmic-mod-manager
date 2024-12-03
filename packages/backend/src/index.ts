import bodyParserMiddleware from "@/middleware/body-parser";
import { logger } from "@/middleware/logger";
import { ddosProtectionRateLimiter } from "@/middleware/rate-limit/ddos";
import { startSitemapGenerator } from "@/services/sitemap-gen";
import env from "@/utils/env";
import { HTTP_STATUS } from "@/utils/http";
import { BACKEND_PORT } from "@shared/config";
import { queueDownloadsCounterQueueProcessing } from "@src/cdn/downloads-counter";
import queueSearchDbSync from "@src/search/sync-queue";
import type { SocketAddress } from "bun";
import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import authRouter from "./auth/router";
import cdnRouter, { corsAllowCdn } from "./cdn/router";
import bulkProjectsRouter from "./project/bulk_router";
import bulkOrgsRouter from "./project/organisation/bulk_router";
import orgRouter from "./project/organisation/router";
import projectRouter from "./project/router";
import teamRouter from "./project/team/router";
import searchRouter from "./search/router";
import tagsRouter from "./tags";
import bulkUserActionsRouter from "./user/bulk_actions/router";
import notificationRouter from "./user/notification/router";
import userRouter from "./user/router";

const app = new Hono<{ Bindings: { ip: SocketAddress } }>();

app.use(ddosProtectionRateLimiter);
app.use(logger());
app.use(
    cors({
        origin: env.CORS_ALLOWED_URLS.split(" "),
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
app.route("/api/organizations", bulkOrgsRouter);
app.route("/api/user/:userId/organization", orgRouter);

app.route("/cdn", cdnRouter);

// Redirect to /api
app.get("/favicon.ico", corsAllowCdn, async (ctx: Context) => {
    return ctx.redirect("https://www.crmm.tech/icon.png");
});

app.get("/", corsAllowCdn, apiDetails);
app.get("/api", corsAllowCdn, apiDetails);

Bun.serve({
    port: BACKEND_PORT,
    fetch(req, server) {
        return app.fetch(req, { ip: server.requestIP(req) });
    },
});

// Start the sync queues
queueDownloadsCounterQueueProcessing();
queueSearchDbSync();
startSitemapGenerator();

async function apiDetails(ctx: Context) {
    return ctx.json(
        {
            cdnUrl: env.CACHE_CDN_URL,
            docs: "https://docs.crmm.tech",
        },
        HTTP_STATUS.OK,
    );
}
