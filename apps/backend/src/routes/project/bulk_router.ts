import { type Context, Hono } from "hono";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { getReqRateLimiter, strictGetReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { invalidReqestResponse, serverErrorResponse } from "~/utils/http";
import { getUserFromCtx } from "../auth/helpers/session";
import { getManyProjects, getRandomProjects } from "./controllers";

const bulkProjectsRouter = new Hono();
bulkProjectsRouter.use(invalidAuthAttemptLimiter);
bulkProjectsRouter.use(AuthenticationMiddleware);

bulkProjectsRouter.get("/", strictGetReqRateLimiter, projects_get);
bulkProjectsRouter.get("/random", strictGetReqRateLimiter, projectsRandom_get);
bulkProjectsRouter.get("/home-page-carousel", getReqRateLimiter, homePageCarousel_get);

async function projects_get(ctx: Context) {
    try {
        const projectIds = ctx.req.query("ids");
        const userSession = getUserFromCtx(ctx);
        if (!projectIds) return invalidReqestResponse(ctx);

        const idsArray = JSON.parse(projectIds);

        if (idsArray.some((id: unknown) => typeof id !== "string")) {
            return invalidReqestResponse(ctx, "Invalid project ids list");
        }
        if (idsArray.length > 100) {
            return invalidReqestResponse(ctx, "Maximum of 100 projects can be fetched at once");
        }

        const res = await getManyProjects(userSession, idsArray);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectsRandom_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const count = Number.parseInt(ctx.req.query("count") || "");

        const res = await getRandomProjects(userSession, count, true);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function homePageCarousel_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);

        const res = await getRandomProjects(userSession, 20, true);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default bulkProjectsRouter;
