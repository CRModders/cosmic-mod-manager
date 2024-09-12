import { ctxReqBodyNamespace } from "@/../types";
import { inviteProjectMember } from "@/controllers/project/member";
import { getUserSessionFromCtx } from "@/utils";
import { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { type Context, Hono } from "hono";

const projectMemberRouter = new Hono();

projectMemberRouter.post("/invite", async (ctx: Context) => {
    try {
        const projectSlug = ctx.req.param("projectSlug");
        const userName = ctx.get(ctxReqBodyNamespace)?.userName;
        const userSession = getUserSessionFromCtx(ctx);
        if (!userName || !userSession || !projectSlug) return defaultInvalidReqResponse(ctx);

        return await inviteProjectMember(ctx, userSession, userName, projectSlug);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

export default projectMemberRouter;
