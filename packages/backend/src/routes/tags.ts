import { searchApiRateLimiterMiddleware } from "@/middleware/rate-limiter";
import httpCode, { defaultServerErrorResponse } from "@/utils/http";
import GAME_VERSIONS from "@shared/config/game-versions";
import SPDX_LICENSE_LIST, { FEATURED_LICENSE_OPTIONS } from "@shared/config/license-list";
import { projectTypes } from "@shared/config/project";
import { getAllLoaderCategories, getValidProjectCategories } from "@shared/lib/utils";
import type { ProjectType, TagHeaderTypes } from "@shared/types";
import { type Context, Hono } from "hono";

const tagsRouter = new Hono();
tagsRouter.use("*", searchApiRateLimiterMiddleware);

tagsRouter.get("/categories", categories_get);
tagsRouter.get("/game-versions", gameVersions_get);
tagsRouter.get("/loaders", loaders_get);
tagsRouter.get("/licenses", licenses_get);
tagsRouter.get("/licenses/featured", featuredLicenses_get);
tagsRouter.get("/licenses/:id", licenses_get);
tagsRouter.get("/project-types", projectTypes_get);

const getCategories = ({
    projectType,
    headerType,
    namesOnly,
}: { projectType?: ProjectType; headerType?: TagHeaderTypes; namesOnly?: boolean }) => {
    const list = getValidProjectCategories(projectType ? [projectType] : [], headerType);

    if (namesOnly) {
        return list.map((category) => category.name);
    }
    return list;
};

async function categories_get(ctx: Context) {
    try {
        const projectType = (ctx.req.query("type")?.toLowerCase() as ProjectType) || undefined;
        const namesOnly = ctx.req.query("namesOnly") === "true";

        const categories = await getCategories({ namesOnly, projectType: projectType });
        return ctx.json({ categories }, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function gameVersions_get(ctx: Context) {
    try {
        return ctx.json(GAME_VERSIONS, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function loaders_get(ctx: Context) {
    try {
        const projectType = (ctx.req.query("type")?.toLowerCase() as ProjectType) || undefined;
        const loaders = getAllLoaderCategories(projectType, false);
        return ctx.json({ loaders }, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function featuredLicenses_get(ctx: Context) {
    try {
        return ctx.json(FEATURED_LICENSE_OPTIONS.slice(1), httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function licenses_get(ctx: Context) {
    try {
        const licenseId = ctx.req.param("id")?.toLowerCase();
        if (!licenseId) {
            const license = SPDX_LICENSE_LIST.find((l) => l.licenseId.toLowerCase() === licenseId);
            if (!license) {
                return ctx.json({ success: false, message: "License not found" }, httpCode("not_found"));
            }
            return ctx.json(license, httpCode("ok"));
        }

        return ctx.json(SPDX_LICENSE_LIST, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function projectTypes_get(ctx: Context) {
    try {
        return ctx.json(projectTypes, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

export default tagsRouter;
