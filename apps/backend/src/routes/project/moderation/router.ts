import { MODERATOR_ROLES } from "@app/utils/config/roles";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { addInvalidAuthAttempt, invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { critModifyReqRateLimiter } from "~/middleware/rate-limit/modify-req";
import { getUserFromCtx } from "~/routes/auth/helpers/session";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { serverErrorResponse, unauthorizedReqResponse } from "~/utils/http";
import { getModerationProjects, updateModerationProject } from "./controller";

const moderationRouter = new Hono();
moderationRouter.use(invalidAuthAttemptLimiter);
moderationRouter.use(AuthenticationMiddleware);

moderationRouter.get("/projects", critModifyReqRateLimiter, moderationProjects_get);
moderationRouter.post("/project/:id", critModifyReqRateLimiter, moderationProject_post);

async function moderationProjects_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (!userSession?.id || !MODERATOR_ROLES.includes(userSession.role)) {
            await addInvalidAuthAttempt(ctx);
            return unauthorizedReqResponse(ctx);
        }

        const res = await getModerationProjects();
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function moderationProject_post(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (!userSession?.id || !MODERATOR_ROLES.includes(userSession.role)) {
            await addInvalidAuthAttempt(ctx);
            return unauthorizedReqResponse(ctx);
        }
        const id = ctx.req.param("id");
        const body = ctx.get(REQ_BODY_NAMESPACE);
        const newStatus = body.status;

        const res = await updateModerationProject(id, newStatus);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default moderationRouter;
