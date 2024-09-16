import { ctxReqBodyNamespace } from "@/../types";
import {
    createNewVersion,
    deleteProjectVersion,
    getAllProjectVersions,
    getProjectVersionData,
    updateVersionData,
} from "@/controllers/project/version";
import { LoginProtectedRoute } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import httpCode, { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { newVersionFormSchema, updateVersionFormSchema } from "@shared/schemas/project/version";
import { parseValueToSchema } from "@shared/schemas/utils";
import { type Context, Hono } from "hono";

const versionRouter = new Hono();

// ?  PREFIX "/api/project/:projectSlug/version"

versionRouter.get("/", async (ctx: Context) => {
    try {
        const projectSlug = ctx.req.param("projectSlug");
        if (!projectSlug) return defaultInvalidReqResponse(ctx);
        const userSession = getUserSessionFromCtx(ctx);
        const featuredOnly = ctx.req.query("featured") === "true";

        return await getAllProjectVersions(ctx, projectSlug, userSession, featuredOnly);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

versionRouter.post("/new", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const projectSlug = ctx.req.param("projectSlug");
        if (!userSession || !projectSlug) return defaultInvalidReqResponse(ctx);

        const formData = ctx.get(ctxReqBodyNamespace);
        const dependencies = formData.get("dependencies");
        const loaders = formData.get("loaders");
        const gameVersions = formData.get("gameVersions");

        const schemaObj = {
            title: formData.get("title"),
            changelog: formData.get("changelog"),
            featured: formData.get("featured") === "true",
            releaseChannel: formData.get("releaseChannel"),
            versionNumber: formData.get("versionNumber"),
            loaders: JSON.parse(loaders ? loaders.toString() : "[]"),
            gameVersions: JSON.parse(gameVersions ? gameVersions.toString() : "[]"),
            dependencies: JSON.parse(dependencies ? dependencies.toString() : "[]"),
            primaryFile: formData.get("primaryFile"),
            additionalFiles: (formData.getAll("additionalFiles") || []).filter((file: unknown) => {
                if (file instanceof File) return file;
            }),
        };

        const { data, error } = await parseValueToSchema(newVersionFormSchema, schemaObj);
        if (error || !data) {
            // @ts-ignore
            const name = error?.issues?.[0]?.path?.[0];
            // @ts-ignore
            const errMsg = error?.issues?.[0]?.message;
            return ctx.json({ success: false, message: name && errMsg ? `${name}: ${errMsg}` : error }, httpCode("bad_request"));
        }

        return await createNewVersion(ctx, userSession, projectSlug, data);
    } catch (error) {
        console.trace(error);
        return defaultServerErrorResponse(ctx);
    }
});

versionRouter.get("/:versionSlug", async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const { projectSlug, versionSlug } = ctx.req.param();
        if (!userSession || !projectSlug || !versionSlug) return defaultInvalidReqResponse(ctx);

        return await getProjectVersionData(ctx, projectSlug, versionSlug, userSession);
    } catch (error) {
        console.trace(error);
        return defaultServerErrorResponse(ctx);
    }
});

versionRouter.patch("/:versionSlug", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const { projectSlug, versionSlug } = ctx.req.param();
        if (!userSession || !projectSlug || !versionSlug) return defaultInvalidReqResponse(ctx);

        const formData = ctx.get(ctxReqBodyNamespace);
        const dependencies = formData.get("dependencies");
        const loaders = formData.get("loaders");
        const gameVersions = formData.get("gameVersions");
        const additionalFiles = formData.getAll("additionalFiles").map((file: File | string) => {
            if (file instanceof File) return file;
            return JSON.parse(file);
        });

        const schemaObj = {
            title: formData.get("title"),
            changelog: formData.get("changelog"),
            featured: formData.get("featured") === "true",
            releaseChannel: formData.get("releaseChannel"),
            versionNumber: formData.get("versionNumber"),
            dependencies: dependencies ? JSON.parse(dependencies) : [],
            loaders: loaders ? JSON.parse(loaders) : [],
            gameVersions: gameVersions ? JSON.parse(gameVersions) : [],
            additionalFiles: additionalFiles,
        };

        const { data, error } = await parseValueToSchema(updateVersionFormSchema, schemaObj);
        if (error || !data) {
            // @ts-ignore
            const name = error?.issues?.[0]?.path?.[0];
            // @ts-ignore
            const errMsg = error?.issues?.[0]?.message;
            return ctx.json({ success: false, message: name && errMsg ? `${name}: ${errMsg}` : error }, httpCode("bad_request"));
        }

        return await updateVersionData(ctx, projectSlug, versionSlug, userSession, data);
    } catch (error) {
        console.trace(error);
        return defaultServerErrorResponse(ctx);
    }
});

versionRouter.delete("/:versionSlug", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const { projectSlug, versionSlug } = ctx.req.param();
        if (!userSession || !projectSlug || !versionSlug) return defaultInvalidReqResponse(ctx);

        return await deleteProjectVersion(ctx, projectSlug, versionSlug, userSession);
    } catch (error) {
        console.trace(error);
        return defaultServerErrorResponse(ctx);
    }
});

export default versionRouter;
