import { ctxReqBodyNamespace } from "@/../types";
import { addNewGalleryImage, createNewProject, getProjectData, removeGalleryImage, updateGalleryImage } from "@/controllers/project";
import { getProjectDependencies } from "@/controllers/project/dependency";
import {
    updateProject,
    updateProjectDescription,
    updateProjectExternalLinks,
    updateProjectLicense,
    updateProjectTags,
} from "@/controllers/project/settings";
import { LoginProtectedRoute } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import httpCode, { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { type Context, Hono } from "hono";
import type { z } from "zod";
import versionRouter from "./version";

import { newProjectFormSchema } from "@shared/schemas/project";
import { updateProjectTagsFormSchema } from "@shared/schemas/project/settings/categories";
import { updateDescriptionFormSchema } from "@shared/schemas/project/settings/description";
import { addNewGalleryImageFormSchema, updateGalleryImageFormSchema } from "@shared/schemas/project/settings/gallery";
import { generalProjectSettingsFormSchema } from "@shared/schemas/project/settings/general";
import { updateProjectLicenseFormSchema } from "@shared/schemas/project/settings/license";
import { updateExternalLinksFormSchema } from "@shared/schemas/project/settings/links";
import { parseValueToSchema } from "@shared/schemas/utils";

const projectRouter = new Hono();

projectRouter.post("/new", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(newProjectFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await createNewProject(ctx, userSession, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

projectRouter.get("/:slug", async (ctx: Context) => {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return defaultInvalidReqResponse(ctx);
        const userSession = getUserSessionFromCtx(ctx);

        return await getProjectData(ctx, slug, userSession);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

projectRouter.patch("/:slug", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return defaultInvalidReqResponse(ctx);

        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession) return defaultInvalidReqResponse(ctx);
        const formData = ctx.get(ctxReqBodyNamespace);
        const obj = {
            icon: formData.get("icon"),
            name: formData.get("name"),
            slug: formData.get("slug"),
            visibility: formData.get("visibility"),
            clientSide: formData.get("clientSide"),
            serverSide: formData.get("serverSide"),
            summary: formData.get("summary"),
        } satisfies z.infer<typeof generalProjectSettingsFormSchema>;

        const { data, error } = await parseValueToSchema(generalProjectSettingsFormSchema, obj);
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await updateProject(ctx, slug, userSession, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

projectRouter.get("/:slug/dependencies", async (ctx: Context) => {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserSessionFromCtx(ctx);
        if (!slug) return defaultInvalidReqResponse(ctx);

        return await getProjectDependencies(ctx, slug, userSession);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

projectRouter.patch("/:slug/description", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return defaultInvalidReqResponse(ctx);

        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(updateDescriptionFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await updateProjectDescription(ctx, slug, userSession, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

projectRouter.patch("/:slug/tags", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserSessionFromCtx(ctx);
        if (!slug || !userSession?.id) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(updateProjectTagsFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await updateProjectTags(ctx, slug, userSession, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

projectRouter.patch("/:slug/external-links", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserSessionFromCtx(ctx);
        if (!slug || !userSession?.id) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(updateExternalLinksFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await updateProjectExternalLinks(ctx, userSession, slug, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

projectRouter.patch("/:slug/license", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserSessionFromCtx(ctx);
        if (!slug || !userSession?.id) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(updateProjectLicenseFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await updateProjectLicense(ctx, userSession, slug, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

projectRouter.post("/:slug/gallery", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return defaultInvalidReqResponse(ctx);

        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession) return defaultInvalidReqResponse(ctx);

        const formData = ctx.get(ctxReqBodyNamespace);
        const obj = {
            image: formData.get("image"),
            title: formData.get("title"),
            description: formData.get("description"),
            orderIndex: Number.parseInt(formData.get("orderIndex") || "0"),
            featured: formData.get("featured") === "true",
        };

        const { data, error } = await parseValueToSchema(addNewGalleryImageFormSchema, obj);
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await addNewGalleryImage(ctx, slug, userSession, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

projectRouter.patch("/:slug/gallery/:imageId", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const { slug, imageId } = ctx.req.param();
        const userSession = getUserSessionFromCtx(ctx);
        if (!slug || !imageId || !userSession) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(updateGalleryImageFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await updateGalleryImage(ctx, slug, userSession, imageId, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

projectRouter.delete("/:slug/gallery", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const slug = ctx.req.param("slug");
        const galleryItemId = ctx.get(ctxReqBodyNamespace)?.id;
        const userSession = getUserSessionFromCtx(ctx);

        if (!slug || !userSession || !galleryItemId) return defaultInvalidReqResponse(ctx);

        return await removeGalleryImage(ctx, slug, userSession, galleryItemId);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

projectRouter.route("/:projectSlug/version", versionRouter);
export default projectRouter;
