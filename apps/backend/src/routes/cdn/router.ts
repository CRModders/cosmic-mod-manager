import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { cdnAssetRateLimiter, cdnLargeFileRateLimiter } from "~/middleware/rate-limit/cdn";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { getSitemap } from "~/services/sitemap-gen";
import env from "~/utils/env";
import { invalidReqestResponse, notFoundResponse, serverErrorResponse } from "~/utils/http";
import { getUserFromCtx } from "../auth/helpers/session";
import { serveOrgIconFile, serveProjectGalleryImage, serveProjectIconFile, serveUserAvatar, serveVersionFile } from "./controller";

const cdnUrlQueryKey = "cdnReq";

const cdnRouter = new Hono();
cdnRouter.use(
    cors({
        origin: "*",
        credentials: true,
    }),
);

// TODO: Remove these three later and just ust the /project prefix
cdnRouter.get("/data/:projectId/:file", cdnAssetRateLimiter, projectFile_get);
cdnRouter.get("/data/:projectId/gallery/:image", cdnAssetRateLimiter, galleryImage_get);
cdnRouter.get(
    "/data/:projectId/version/:versionId/:fileName",
    invalidAuthAttemptLimiter,
    cdnLargeFileRateLimiter,
    AuthenticationMiddleware,
    versionFile_get,
);

cdnRouter.get("/data/project/:projectId/:file", cdnAssetRateLimiter, projectFile_get);
cdnRouter.get("/data/project/:projectId/gallery/:image", cdnAssetRateLimiter, galleryImage_get);
cdnRouter.get(
    "/data/project/:projectId/version/:versionId/:fileName",
    invalidAuthAttemptLimiter,
    cdnLargeFileRateLimiter,
    AuthenticationMiddleware,
    versionFile_get,
);

cdnRouter.get("/data/organization/:orgId/:file", cdnAssetRateLimiter, orgFile_get);
cdnRouter.get("/data/user/:userId/:file", cdnAssetRateLimiter, userFile_get);

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

async function userFile_get(ctx: Context) {
    try {
        const { userId } = ctx.req.param();
        if (!userId) {
            return invalidReqestResponse(ctx);
        }

        return await serveUserAvatar(ctx, userId, IsCdnRequest(ctx));
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
        if (!sitemap) return invalidReqestResponse(ctx);
        if (!(await sitemap.exists())) return notFoundResponse(ctx, "Sitemap not found");

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
