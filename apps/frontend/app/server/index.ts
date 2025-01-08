import { Hono } from "hono";
import { createHonoServer } from "react-router-hono-server/bun";

const app = new Hono();

export default await createHonoServer({
    app,
});
