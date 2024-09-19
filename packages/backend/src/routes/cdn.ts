import { serveProjectGalleryImage, serveProjectIconFile, serveVersionFile } from "@/controllers/cdn";
import { cdn_assetsRateLimiterMiddleware, cdn_large_filesRateLimiterMiddleware } from "@/middleware/rate-limiter";
import { AuthenticationMiddleware } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { Hono } from "hono";

const cdnRouter = new Hono();

cdnRouter.use("*", cdn_assetsRateLimiterMiddleware);
cdnRouter.use("*", AuthenticationMiddleware);

cdnRouter.get("/data/:projectSlug/:file", async (ctx) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const { projectSlug } = ctx.req.param();
        if (!projectSlug) {
            return defaultInvalidReqResponse(ctx);
        }
        return await serveProjectIconFile(ctx, projectSlug, userSession);
    } catch (error) {
        return defaultServerErrorResponse(ctx);
    }
});

cdnRouter.get("/data/:projectSlug/gallery/:image", async (ctx) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const { projectSlug, image } = ctx.req.param();
        if (!projectSlug || !image) {
            return defaultInvalidReqResponse(ctx);
        }
        return await serveProjectGalleryImage(ctx, projectSlug, image, userSession);
    } catch (error) {
        return defaultServerErrorResponse(ctx);
    }
});

const cdnUrlQueryKey = "isCdnReq";
cdnRouter.get("/data/:projectSlug/version/:versionSlug/:fileName", cdn_large_filesRateLimiterMiddleware, async (ctx) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const { projectSlug, versionSlug, fileName } = ctx.req.param();
        const isUserRequest = ctx.req.query(cdnUrlQueryKey) === "false";
        if (!projectSlug || !versionSlug || !fileName) {
            return defaultInvalidReqResponse(ctx);
        }

        return await serveVersionFile(ctx, projectSlug, versionSlug, fileName, userSession, isUserRequest, cdnUrlQueryKey);
    } catch (error) {
        return defaultServerErrorResponse(ctx);
    }
});

export default cdnRouter;
