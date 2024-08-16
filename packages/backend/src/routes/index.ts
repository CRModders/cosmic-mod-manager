import bodyParserMiddleware from "@/middleware/parse-body";
import { RateLimiterMiddleware } from "@/middleware/rate-limiter";
import { AuthenticationMiddleware } from "@/middleware/session";
import { Hono } from "hono";
import authRouter from "./auth";
import projectRouter from "./project/project";
import userRouter from "./user";

const router = new Hono();

// MIDDLEWARES
router.use("*", bodyParserMiddleware);
router.use("*", RateLimiterMiddleware);
router.use("*", AuthenticationMiddleware);

// Routers
router.route("/auth", authRouter);
router.route("/user", userRouter);
router.route("/project", projectRouter);


export default router;
