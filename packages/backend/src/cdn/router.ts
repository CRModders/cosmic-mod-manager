import { AuthenticationMiddleware } from "@/middleware/auth";
import { cdnAssetRateLimiter, cdnLargeFileRateLimiter } from "@/middleware/rate-limit/cdn";
import env from "@/utils/env";
import { invalidReqestResponse, serverErrorResponse } from "@/utils/http";
import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { getUserFromCtx } from "../auth/helpers/session";
import { getSitemap } from "../search/sitemap-gen";
import { serveOrgIconFile, serveProjectGalleryImage, serveProjectIconFile, serveVersionFile } from "./controller";

const cdnUrlQueryKey = "cdnReq";
const cacheCdnUrls = [env.CACHE_CDN_URL, "https://crmm-cdn.global.ssl.fastly.net"];

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

// Sitemaps
cdnRouter.get("/sitemap/:name", cdnAssetRateLimiter, sitemap_get);

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

async function sitemap_get(ctx: Context) {
    try {
        const { name } = ctx.req.param();
        if (!name) {
            return invalidReqestResponse(ctx);
        }

        const sitemap = await getSitemap(name);
        if (!sitemap) {
            return invalidReqestResponse(ctx);
        }

        return new Response(sitemap, {
            headers: {
                "Content-Type": "application/xml",
            },
        });
    } catch (error) {
        return serverErrorResponse(ctx);
    }
}

function IsCdnRequest(ctx: Context) {
    if (env.NODE_ENV === "development") return true;
    return ctx.req.query(cdnUrlQueryKey) === env.CDN_SECRET;
}

export default cdnRouter;
