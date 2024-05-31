import type { SocketAddress } from "bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import authRouter from "./auth/router";
import projectRouter from "./project/router";
import userRouter from "./user/router";

type Bindings = {
	ip: SocketAddress;
};

const PORT = 5500;
const app = new Hono<{ Bindings: Bindings }>();

app.use(
	"*",
	cors({
		origin: ["http://localhost:3000"],
		credentials: true,
	}),
);

app.route("/api/auth", authRouter);
app.route("/api/user", userRouter);
app.route("/api/project", projectRouter);

app.get("/api/test", (c) => {
	const headers = c.req.raw.headers.toJSON();

	return c.json({
		headers: headers,
	});
});

app.post("/api/test", async (c) => {
	const body = await c.req.json();
	const headers = c.req.raw.headers.toJSON();

	return c.json({
		body,
		headers,
	});
});

// 404 responses for non-existing api routes
app.get("/api/*", (c) => {
	return c.text("Route does not exist", 404);
});
app.post("/api/*", (c) => {
	return c.text("Route does not exist", 404);
});

console.log(`App starting on port ${PORT}`);
Bun.serve({
	port: PORT,
	fetch(req, server) {
		return app.fetch(req, { ip: server.requestIP(req) });
	},
});
