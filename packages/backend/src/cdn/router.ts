import { AuthenticationMiddleware } from "@/middleware/auth";
import { cdnAssetRateLimiter, cdnLargeFileRateLimiter } from "@/middleware/rate-limit/cdn";
import { invalidReqestResponse, serverErrorResponse } from "@/utils/http";
import { type Context, Hono } from "hono";
import { getUserFromCtx } from "../auth/helpers/session";
import { serveProjectGalleryImage, serveProjectIconFile, serveVersionFile } from "./controller";

const cdnRouter = new Hono();

cdnRouter.get("/data/:projectSlug/:file", cdnAssetRateLimiter, projectFile_get);
cdnRouter.get("/data/:projectSlug/gallery/:image", cdnAssetRateLimiter, galleryImage_get);
cdnRouter.get("/data/:projectSlug/version/:versionSlug/:fileName", cdnLargeFileRateLimiter, AuthenticationMiddleware, versionFile_get);

async function projectFile_get(ctx: Context) {
    try {
        const { projectSlug } = ctx.req.param();
        if (!projectSlug) {
            return invalidReqestResponse(ctx);
        }
        return await serveProjectIconFile(ctx, projectSlug);
    } catch (error) {
        return serverErrorResponse(ctx);
    }
}

async function galleryImage_get(ctx: Context) {
    try {
        const { projectSlug, image } = ctx.req.param();
        if (!projectSlug || !image) {
            return invalidReqestResponse(ctx);
        }
        return await serveProjectGalleryImage(ctx, projectSlug, image);
    } catch (error) {
        return serverErrorResponse(ctx);
    }
}

const cdnUrlQueryKey = "isCdnReq";
async function versionFile_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const { projectSlug, versionSlug, fileName } = ctx.req.param();
        const isUserRequest = ctx.req.query(cdnUrlQueryKey) === "false";
        if (!projectSlug || !versionSlug || !fileName) {
            return invalidReqestResponse(ctx);
        }

        return await serveVersionFile(ctx, projectSlug, versionSlug, fileName, userSession, isUserRequest);
    } catch (error) {
        return serverErrorResponse(ctx);
    }
}

export default cdnRouter;
