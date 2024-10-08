import { ctxReqBodyNamespace } from "@/../types";
import {
    addNewGalleryImage,
    checkProjectSlugValidity,
    createNewProject,
    getProjectData,
    removeGalleryImage,
    updateGalleryImage,
} from "@/controllers/project";
import { getProjectDependencies } from "@/controllers/project/dependency";
import {
    deleteProject,
    deleteProjectIcon,
    updateProject,
    updateProjectDescription,
    updateProjectExternalLinks,
    updateProjectIcon,
    updateProjectLicense,
    updateProjectTags,
} from "@/controllers/project/settings";
import { LoginProtectedRoute } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import { defaultInvalidReqResponse, defaultServerErrorResponse, status } from "@/utils/http";
import { type Context, Hono } from "hono";
import type { z } from "zod";
import versionRouter from "./version";

import { getAllVisibleProjects } from "@/controllers/user/profile";
import { newProjectFormSchema } from "@shared/schemas/project";
import { updateProjectTagsFormSchema } from "@shared/schemas/project/settings/categories";
import { updateDescriptionFormSchema } from "@shared/schemas/project/settings/description";
import { addNewGalleryImageFormSchema, updateGalleryImageFormSchema } from "@shared/schemas/project/settings/gallery";
import { generalProjectSettingsFormSchema, projectIconFieldSchema } from "@shared/schemas/project/settings/general";
import { updateProjectLicenseFormSchema } from "@shared/schemas/project/settings/license";
import { updateExternalLinksFormSchema } from "@shared/schemas/project/settings/links";
import { parseValueToSchema } from "@shared/schemas/utils";

const projectRouter = new Hono();

// Get projects of the currently logged in user
projectRouter.get("/", projects_get);

projectRouter.get("/:slug", project_get);
projectRouter.get("/:slug/dependencies", projectDependencies_get);
projectRouter.get("/:slug/check", projectCheck_get);

projectRouter.post("/", LoginProtectedRoute, project_post);
projectRouter.patch("/:slug", LoginProtectedRoute, project_patch);
projectRouter.delete("/:slug", LoginProtectedRoute, project_delete);
projectRouter.patch("/:slug/icon", LoginProtectedRoute, projectIcon_patch);
projectRouter.delete("/:slug/icon", LoginProtectedRoute, projectIcon_delete);
projectRouter.patch("/:slug/description", LoginProtectedRoute, description_patch);
projectRouter.patch("/:slug/tags", LoginProtectedRoute, tags_patch);
projectRouter.patch("/:slug/external-links", LoginProtectedRoute, externalLinks_patch);
projectRouter.patch("/:slug/license", LoginProtectedRoute, license_patch);

projectRouter.post("/:slug/gallery", LoginProtectedRoute, gallery_post);
projectRouter.patch("/:slug/gallery/:galleryId", LoginProtectedRoute, galleryItem_patch);
projectRouter.delete("/:slug/gallery/:galleryId", LoginProtectedRoute, galleryItem_delete);

projectRouter.route("/:projectSlug/version", versionRouter);

async function projects_get(ctx: Context) {
    try {
        const listedProjectsOnly = ctx.req.query("listedOnly") === "true";
        const userSession = getUserSessionFromCtx(ctx);
        const userName = userSession?.userName;
        if (!userName) return ctx.json({ success: false, message: "You're not logged in" }, status.UNAUTHENTICATED);

        return await getAllVisibleProjects(ctx, userSession, userName, listedProjectsOnly);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function project_get(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return defaultInvalidReqResponse(ctx);
        const userSession = getUserSessionFromCtx(ctx);

        return await getProjectData(ctx, slug, userSession);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function project_post(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(newProjectFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, status.BAD_REQUEST);
        }

        return await createNewProject(ctx, userSession, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function projectCheck_get(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return defaultInvalidReqResponse(ctx);

        return await checkProjectSlugValidity(ctx, slug);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function project_patch(ctx: Context) {
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
            type: JSON.parse(formData.get("type")),
            clientSide: formData.get("clientSide"),
            serverSide: formData.get("serverSide"),
            summary: formData.get("summary"),
        } satisfies z.infer<typeof generalProjectSettingsFormSchema>;

        const { data, error } = await parseValueToSchema(generalProjectSettingsFormSchema, obj);
        if (error || !data) {
            return ctx.json({ success: false, message: error }, status.BAD_REQUEST);
        }

        return await updateProject(ctx, slug, userSession, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function project_delete(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession || !slug) return defaultInvalidReqResponse(ctx);

        return await deleteProject(ctx, userSession, slug);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function projectIcon_patch(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const slug = ctx.req.param("slug");
        const formData = ctx.get(ctxReqBodyNamespace);
        const icon = formData.get("icon");

        if (!userSession || !slug || !icon || !(icon instanceof File)) return defaultInvalidReqResponse(ctx, "Invalid data");

        const { data, error } = await parseValueToSchema(projectIconFieldSchema, icon);
        if (error || !data) {
            return ctx.json(
                {
                    success: false,
                    message: error,
                },
                status.BAD_REQUEST,
            );
        }

        return await updateProjectIcon(ctx, userSession, slug, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function projectIcon_delete(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const slug = ctx.req.param("slug");

        if (!userSession || !slug) return defaultInvalidReqResponse(ctx, "Invalid data");
        return await deleteProjectIcon(ctx, userSession, slug);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function projectDependencies_get(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserSessionFromCtx(ctx);
        if (!slug) return defaultInvalidReqResponse(ctx);

        return await getProjectDependencies(ctx, slug, userSession);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function description_patch(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return defaultInvalidReqResponse(ctx);

        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(updateDescriptionFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, status.BAD_REQUEST);
        }

        return await updateProjectDescription(ctx, slug, userSession, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function tags_patch(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserSessionFromCtx(ctx);
        if (!slug || !userSession?.id) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(updateProjectTagsFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, status.BAD_REQUEST);
        }

        return await updateProjectTags(ctx, slug, userSession, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function externalLinks_patch(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserSessionFromCtx(ctx);
        if (!slug || !userSession?.id) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(updateExternalLinksFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, status.BAD_REQUEST);
        }

        return await updateProjectExternalLinks(ctx, userSession, slug, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function license_patch(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserSessionFromCtx(ctx);
        if (!slug || !userSession?.id) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(updateProjectLicenseFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, status.BAD_REQUEST);
        }

        return await updateProjectLicense(ctx, userSession, slug, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function gallery_post(ctx: Context) {
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
            return ctx.json({ success: false, message: error }, status.BAD_REQUEST);
        }

        return await addNewGalleryImage(ctx, slug, userSession, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function galleryItem_patch(ctx: Context) {
    try {
        const { slug, galleryId } = ctx.req.param();
        const userSession = getUserSessionFromCtx(ctx);
        if (!slug || !galleryId || !userSession) return defaultInvalidReqResponse(ctx);

        const { data, error } = await parseValueToSchema(updateGalleryImageFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, status.BAD_REQUEST);
        }

        return await updateGalleryImage(ctx, slug, userSession, galleryId, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function galleryItem_delete(ctx: Context) {
    try {
        const { slug, galleryId } = ctx.req.param();
        const userSession = getUserSessionFromCtx(ctx);
        if (!slug || !userSession || !galleryId) return defaultInvalidReqResponse(ctx);

        return await removeGalleryImage(ctx, slug, userSession, galleryId);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

export default projectRouter;
