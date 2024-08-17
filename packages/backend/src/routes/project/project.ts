import { ctxReqBodyKey } from "@/../types";
import { createNewProject, getAllUserProjects, getProjectData, updateProject } from "@/controllers/project/project";
import { LoginProtectedRoute } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import httpCode, { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { parseValueToSchema } from "@shared/schemas";
import { generalProjectSettingsFormSchema, newProjectFormSchema } from "@shared/schemas/project";
import { type Context, Hono } from "hono";
import type { z } from "zod";
import versionRouter from "./version";

const projectRouter = new Hono();

projectRouter.post("/new", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession) return defaultInvalidReqResponse(ctx);

        const { data, error } = parseValueToSchema(newProjectFormSchema, ctx.get(ctxReqBodyKey));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await createNewProject(ctx, userSession, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

projectRouter.get("/", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const userId = ctx.req.query("userId") || userSession?.id;
        if (!userId) return defaultInvalidReqResponse(ctx);

        return await getAllUserProjects(ctx, userId, userSession);
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
        const formData = ctx.get(ctxReqBodyKey);
        const obj = {
            icon: formData.get("icon"),
            name: formData.get("name"),
            slug: formData.get("slug"),
            visibility: formData.get("visibility"),
            clientSide: formData.get("clientSide"),
            serverSide: formData.get("serverSide"),
            summary: formData.get("summary"),

        } satisfies z.infer<typeof generalProjectSettingsFormSchema>;

        const { data, error } = parseValueToSchema(generalProjectSettingsFormSchema, obj);
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await updateProject(ctx, slug, userSession, data);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
})

projectRouter.route("/:projectSlug/version", versionRouter);
export default projectRouter;
