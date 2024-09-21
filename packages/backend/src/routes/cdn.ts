import { serveProjectGalleryImage, serveProjectIconFile, serveVersionFile } from "@/controllers/cdn";
import { cdn_assetsRateLimiterMiddleware, cdn_large_filesRateLimiterMiddleware } from "@/middleware/rate-limiter";
import { AuthenticationMiddleware } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { type Context, Hono } from "hono";

const cdnRouter = new Hono();
cdnRouter.use("*", cdn_assetsRateLimiterMiddleware);

cdnRouter.get("/data/:projectSlug/:file", projectFile_get);
cdnRouter.get("/data/:projectSlug/gallery/:image", galleryImage_get);
cdnRouter.get(
    "/data/:projectSlug/version/:versionSlug/:fileName",
    cdn_large_filesRateLimiterMiddleware,
    AuthenticationMiddleware,
    versionFile_get,
);

async function projectFile_get(ctx: Context) {
    try {
        const { projectSlug } = ctx.req.param();
        if (!projectSlug) {
            return defaultInvalidReqResponse(ctx);
        }
        return await serveProjectIconFile(ctx, projectSlug);
    } catch (error) {
        return defaultServerErrorResponse(ctx);
    }
}

async function galleryImage_get(ctx: Context) {
    try {
        const { projectSlug, image } = ctx.req.param();
        if (!projectSlug || !image) {
            return defaultInvalidReqResponse(ctx);
        }
        return await serveProjectGalleryImage(ctx, projectSlug, image);
    } catch (error) {
        return defaultServerErrorResponse(ctx);
    }
}

const cdnUrlQueryKey = "isCdnReq";
async function versionFile_get(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const { projectSlug, versionSlug, fileName } = ctx.req.param();
        const isUserRequest = ctx.req.query(cdnUrlQueryKey) === "false";
        if (!projectSlug || !versionSlug || !fileName) {
            return defaultInvalidReqResponse(ctx);
        }

        return await serveVersionFile(ctx, projectSlug, versionSlug, fileName, userSession, isUserRequest);
    } catch (error) {
        return defaultServerErrorResponse(ctx);
    }
}

export default cdnRouter;
