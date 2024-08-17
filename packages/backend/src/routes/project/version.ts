import { createNewVersion, getAllProjectVersions } from "@/controllers/project/version";
import { LoginProtectedRoute } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import httpCode, { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { parseValueToSchema } from "@shared/schemas";
import { newVersionFormSchema } from "@shared/schemas/project";
import { type Context, Hono } from "hono";
import { ctxReqBodyKey } from "../../../types";

const versionRouter = new Hono();

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

        const formData = ctx.get(ctxReqBodyKey);
        const dependencies = formData.get("dependencies");
        const loaders = formData.get("loaders");
        const gameVersions = formData.get("gameVersions");

        const schemaObj = {
            title: formData.get("title"),
            changelog: formData.get("changelog"),
            releaseChannel: formData.get("releaseChannel"),
            versionNumber: formData.get("versionNumber"),
            loaders: JSON.parse(loaders ? loaders.toString() : "[]"),
            gameVersions: JSON.parse(gameVersions ? gameVersions.toString() : "[]"),
            dependencies: JSON.parse(dependencies ? dependencies.toString() : "[]"),
            primaryFile: formData.get("primaryFile"),
            additionalFiles: (formData.getAll("additionalFiles") || []).filter((file: unknown) => {
                if (file instanceof File) return file;
                if (typeof file === "string") return JSON.parse(file);
            }),
        };

        const { data, error } = parseValueToSchema(newVersionFormSchema, schemaObj);
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

export default versionRouter;
