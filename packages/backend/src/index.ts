import { BACKEND_PORT } from "@shared/config";
import type { SocketAddress } from "bun";
import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { ddosPreventionRateLimiterMiddleware } from "./middleware/rate-limiter";
import router from "./routes";
import cdnRouter from "./routes/cdn";
import searchRouter from "./routes/search";
import { queueDownloadsCounterQueueProcessing } from "./services/queues/downloads-queue";
import queueSearchDbSync from "./services/queues/searchdb-sync";

const app = new Hono<{ Bindings: { ip: SocketAddress } }>();

app.use(ddosPreventionRateLimiterMiddleware);
app.use(logger());
app.use(
    "*",
    cors({
        origin: (process.env.CORS_ALLOWED_URLS || "").split(" "),
        credentials: true,
    }),
);

app.get("/favicon.ico", async (ctx: Context) => {
    return ctx.redirect("https://wsrv.nl/?url=https://i.ibb.co/qMXwhxL/Mercury-rose-gradient-lighter.png");
});

app.route("/api/search", searchRouter);
app.route("/api", router);
app.route("/cdn", cdnRouter);

Bun.serve({
    port: BACKEND_PORT,
    fetch(req, server) {
        return app.fetch(req, { ip: server.requestIP(req) });
    },
});

queueSearchDbSync();
queueDownloadsCounterQueueProcessing();
