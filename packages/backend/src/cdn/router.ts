import { AuthenticationMiddleware } from "@/middleware/auth";
import { cdnAssetRateLimiter, cdnLargeFileRateLimiter } from "@/middleware/rate-limit/cdn";
import env from "@/utils/env";
import { invalidReqestResponse, serverErrorResponse } from "@/utils/http";
import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { getUserFromCtx } from "../auth/helpers/session";
import { serveOrgIconFile, serveProjectGalleryImage, serveProjectIconFile, serveVersionFile } from "./controller";

const cdnUrlQueryKey = "cdnReq";
const cacheCdnUrls = env.CACHE_CDN_URL.split(" ").filter((url) => url);

const cdnRouter = new Hono();
export const corsAllowCdn = cors({
    origin: [env.CDN_SERVER_URL, ...cacheCdnUrls],
    credentials: true,
});

cdnRouter.use(corsAllowCdn);

cdnRouter.get("/data/:projectId/:file", cdnAssetRateLimiter, projectFile_get);
cdnRouter.get("/data/:projectId/gallery/:image", cdnAssetRateLimiter, galleryImage_get);
cdnRouter.get("/data/:projectId/version/:versionId/:fileName", cdnLargeFileRateLimiter, AuthenticationMiddleware, versionFile_get);

cdnRouter.get("/data/organization/:orgId/:file", cdnAssetRateLimiter, orgFile_get);

async function projectFile_get(ctx: Context) {
    try {
        const { projectId } = ctx.req.param();
        if (!projectId) {
            return invalidReqestResponse(ctx);
        }

        return await serveProjectIconFile(ctx, projectId, IsCdnRequest(ctx));
    } catch (error) {
        return serverErrorResponse(ctx);
    }
}

async function galleryImage_get(ctx: Context) {
    try {
        const { projectId, image } = ctx.req.param();
        if (!projectId || !image) {
            return invalidReqestResponse(ctx);
        }

        return await serveProjectGalleryImage(ctx, projectId, image, IsCdnRequest(ctx));
    } catch (error) {
        return serverErrorResponse(ctx);
    }
}

async function versionFile_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const { projectId, versionId, fileName } = ctx.req.param();
        if (!projectId || !versionId || !fileName) {
            return invalidReqestResponse(ctx);
        }

        return await serveVersionFile(ctx, projectId, versionId, fileName, userSession, IsCdnRequest(ctx));
    } catch (error) {
        return serverErrorResponse(ctx);
    }
}

async function orgFile_get(ctx: Context) {
    try {
        const { orgId } = ctx.req.param();
        if (!orgId) {
            return invalidReqestResponse(ctx);
        }

        return await serveOrgIconFile(ctx, orgId, IsCdnRequest(ctx));
    } catch (error) {
        return serverErrorResponse(ctx);
    }
}

function IsCdnRequest(ctx: Context) {
    if (env.NODE_ENV === "development") return true;
    return ctx.req.query(cdnUrlQueryKey) === env.CDN_SECRET;
}

export default cdnRouter;
