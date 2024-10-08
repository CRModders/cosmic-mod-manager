import { getManyProjects } from "@/controllers/project/bulk_actions";
import { getUserSessionFromCtx } from "@/utils";
import { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { type Context, Hono } from "hono";

const bulkProjectsRouter = new Hono();

bulkProjectsRouter.get("/", projects_get);

async function projects_get(ctx: Context) {
    try {
        const projectIds = ctx.req.query("ids");
        const userSession = getUserSessionFromCtx(ctx);
        if (!projectIds) return defaultInvalidReqResponse(ctx);

        const idsArray = JSON.parse(projectIds);

        if (idsArray.some((id: unknown) => typeof id !== "string")) {
            return defaultInvalidReqResponse(ctx, "Invalid project ids list");
        }
        if (idsArray.length > 100) {
            return defaultInvalidReqResponse(ctx, "Maximum 100 projects can be fetched at once");
        }

        return await getManyProjects(ctx, userSession, idsArray);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

export default bulkProjectsRouter;
