import bodyParserMiddleware from "@/middleware/parse-body";
import { apiRateLimiterMiddleware } from "@/middleware/rate-limiter";
import { AuthenticationMiddleware } from "@/middleware/session";
import { status } from "@/utils/http";
import { type Context, Hono } from "hono";
import authRouter from "./auth";
import orgRouter from "./organisation";
import projectRouter from "./project";
import bulkProjectsRouter from "./project/bulk";
import teamRouter from "./team";
import userRouter from "./user";
import bulkUsersRouter from "./user/bulk";
import userNotificationRouter from "./user/user_notification";

const router = new Hono();

// MIDDLEWARES
router.use("*", apiRateLimiterMiddleware);
router.use("*", bodyParserMiddleware);
router.use("*", AuthenticationMiddleware);

router.get("/", apiDetails);

// Routers
router.route("/auth", authRouter);

router.route("/project", projectRouter);
router.route("/projects", bulkProjectsRouter);
router.route("/team", teamRouter);
router.route("/organisation", orgRouter);

router.route("/user", userRouter);
router.route("/users", bulkUsersRouter);
router.route("/notifications", userNotificationRouter);

async function apiDetails(ctx: Context) {
    return ctx.json(
        {
            cdnUrl: process.env.CACHE_CDN_URL,
            docs: "https://docs.crmm.tech",
        },
        status.OK,
    );
}

export default router;
