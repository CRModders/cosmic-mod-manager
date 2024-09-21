import bodyParserMiddleware from "@/middleware/parse-body";
import { apiRateLimiterMiddleware } from "@/middleware/rate-limiter";
import { AuthenticationMiddleware } from "@/middleware/session";
import httpCode from "@/utils/http";
import { type Context, Hono } from "hono";
import authRouter from "./auth";
import projectRouter from "./project";
import teamRouter from "./team";
import userRouter from "./user";

const router = new Hono();

// MIDDLEWARES
router.use("*", apiRateLimiterMiddleware);
router.use("*", bodyParserMiddleware);
router.use("*", AuthenticationMiddleware);

router.get("/", apiDetails);

// Routers
router.route("/auth", authRouter);
router.route("/user", userRouter);
router.route("/project", projectRouter);
router.route("/team", teamRouter);

async function apiDetails(ctx: Context) {
    return ctx.json(
        {
            cdnUrl: process.env.CACHE_CDN_URL,
            docs: "https://docs.crmm.tech",
        },
        httpCode("ok"),
    );
}

export default router;
