import bodyParserMiddleware from "@/middleware/parse-body";
import { apiRateLimiterMiddleware } from "@/middleware/rate-limiter";
import { AuthenticationMiddleware } from "@/middleware/session";
import { Hono } from "hono";
import authRouter from "./auth";
import projectRouter from "./project";
import teamRouter from "./team";
import userRouter from "./user";

const router = new Hono();

// MIDDLEWARES
router.use("*", apiRateLimiterMiddleware);
router.use("*", bodyParserMiddleware);
router.use("*", AuthenticationMiddleware);

// Routers
router.route("/auth", authRouter);
router.route("/user", userRouter);
router.route("/project", projectRouter);
router.route("/team", teamRouter);

export default router;
