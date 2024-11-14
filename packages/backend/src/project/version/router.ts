import { LoginProtectedRoute } from "@/middleware/auth";
import { getReqRateLimiter } from "@/middleware/rate-limit/get-req";
import { critModifyReqRateLimiter, modifyReqRateLimiter } from "@/middleware/rate-limit/modify-req";
import { getUserFromCtx } from "@/src/auth/helpers/session";
import { REQ_BODY_NAMESPACE } from "@/types/namespaces";
import { HTTP_STATUS, invalidReqestResponse, serverErrorResponse } from "@/utils/http";
import { newVersionFormSchema, updateVersionFormSchema } from "@shared/schemas/project/version";
import { parseValueToSchema } from "@shared/schemas/utils";
import { type Context, Hono } from "hono";
import { getAllProjectVersions, getProjectVersionData } from "./controllers";
import { createNewVersion } from "./controllers/new-version";
import { deleteProjectVersion, updateVersionData } from "./controllers/update";

const versionRouter = new Hono();

versionRouter.get("/", getReqRateLimiter, versions_get);
versionRouter.get("/:versionId", getReqRateLimiter, version_get);

versionRouter.post("/", critModifyReqRateLimiter, LoginProtectedRoute, version_post);
versionRouter.patch("/:versionId", modifyReqRateLimiter, LoginProtectedRoute, version_patch);
versionRouter.delete("/:versionId", critModifyReqRateLimiter, LoginProtectedRoute, version_delete);

async function versions_get(ctx: Context) {
    try {
        const projectSlug = ctx.req.param("projectSlug");
        if (!projectSlug) return invalidReqestResponse(ctx);
        const userSession = getUserFromCtx(ctx);
        const featuredOnly = ctx.req.query("featured") === "true";

        const res = await getAllProjectVersions(projectSlug, userSession, featuredOnly);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function version_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const { projectSlug, versionId } = ctx.req.param();
        if (!userSession || !projectSlug || !versionId) return invalidReqestResponse(ctx);

        const res = await getProjectVersionData(projectSlug, versionId, userSession);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.trace(error);
        return serverErrorResponse(ctx);
    }
}

async function version_post(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const projectSlug = ctx.req.param("projectSlug");
        if (!userSession || !projectSlug) return invalidReqestResponse(ctx);

        const formData = ctx.get(REQ_BODY_NAMESPACE);
        if (!formData) {
            return ctx.json({ success: false, message: "No form data found" }, HTTP_STATUS.BAD_REQUEST);
        }

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
            return ctx.json({ success: false, message: name && errMsg ? `${name}: ${errMsg}` : error }, HTTP_STATUS.BAD_REQUEST);
        }

        const res = await createNewVersion(ctx, userSession, projectSlug, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.trace(error);
        return serverErrorResponse(ctx);
    }
}

async function version_patch(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const { projectSlug, versionId } = ctx.req.param();
        if (!userSession || !projectSlug || !versionId) return invalidReqestResponse(ctx);

        const formData = ctx.get(REQ_BODY_NAMESPACE);
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
            return ctx.json({ success: false, message: name && errMsg ? `${name}: ${errMsg}` : error }, HTTP_STATUS.BAD_REQUEST);
        }

        const res = await updateVersionData(ctx, projectSlug, versionId, userSession, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.trace(error);
        return serverErrorResponse(ctx);
    }
}

async function version_delete(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const { projectSlug, versionId } = ctx.req.param();
        if (!userSession || !projectSlug || !versionId) return invalidReqestResponse(ctx);

        const res = await deleteProjectVersion(ctx, projectSlug, versionId, userSession);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.trace(error);
        return serverErrorResponse(ctx);
    }
}

export default versionRouter;
