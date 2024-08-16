import { serveVersionFile } from "@/controllers/cdn";
import { getUserSessionFromCtx } from "@/utils";
import { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { Hono } from "hono";

const cdnRouter = new Hono();

// cdnRouter.get("/data/:projectSlug/:fileName")

cdnRouter.get("/data/:projectSlug/version/:versionSlug/:fileName", async (ctx) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const { projectSlug, versionSlug, fileName } = ctx.req.param();
        if (!projectSlug || !versionSlug || !fileName) {
            return defaultInvalidReqResponse(ctx);
        }

        return await serveVersionFile(ctx, projectSlug, versionSlug, fileName, userSession);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
})

export default cdnRouter;