import { BACKEND_PORT, BASE_API_ROUTE_PATH } from "@shared/config";
import type { SocketAddress } from "bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import router from "./routes";
import cdnRouter from "./routes/cdn";

const app = new Hono<{ Bindings: { ip: SocketAddress } }>();

app.use(
    "*",
    cors({
        origin: (process.env.CORS_ALLOWED_URLS || "").split(" "),
        credentials: true,
    }),
);

app.route(BASE_API_ROUTE_PATH, router);
app.route("/cdn", cdnRouter);

Bun.serve({
    port: BACKEND_PORT,
    fetch(req, server) {
        return app.fetch(req, { ip: server.requestIP(req) });
    },
});
