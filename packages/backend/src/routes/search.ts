import { searchProjects } from "@/controllers/search";
import { searchApiRateLimiterMiddleware } from "@/middleware/rate-limiter";
import httpCode, { defaultServerErrorResponse } from "@/utils/http";
import GAME_VERSIONS from "@shared/config/game-versions";
import {
    categoryFilterParamNamespace,
    defaultSortBy,
    gameVersionFilterParamNamespace,
    licenseFilterParamNamespace,
    loaderFilterParamNamespace,
    pageOffsetParamNamespace,
    sortByParamNamespace,
} from "@shared/config/search";
import { getAllLoaderCategories, getValidProjectCategories, isNumber } from "@shared/lib/utils";
import { getProjectTypeFromName } from "@shared/lib/utils/convertors";
import { SearchResultSortMethod, TagHeaderTypes } from "@shared/types";
import { type Context, Hono } from "hono";

const searchRouter = new Hono();
searchRouter.use("*", searchApiRateLimiterMiddleware);

searchRouter.get("/", searchProjectsRoute);
searchRouter.get("/filters/sort-by", sortByFilters);
searchRouter.get("/filters/loaders", loaderFilters);
searchRouter.get("/filters/game-versions", gameVersionFilters);
searchRouter.get("/filters/categories", categoryFilters);
searchRouter.get("/filters/features", featureFilters);
searchRouter.get("/filters/resolutions", resolutionFilters);
searchRouter.get("/filters/performance-impact", performanceImpactFilters);
searchRouter.get("/filters/license", licenseFilters);

async function searchProjectsRoute(ctx: Context) {
    try {
        const query = ctx.req.query("q") || "";
        const categories = ctx.req.queries(categoryFilterParamNamespace) || [];
        const loaders = ctx.req.queries(loaderFilterParamNamespace) || [];
        const gameVersions = ctx.req.queries(gameVersionFilterParamNamespace) || [];
        const page = ctx.req.query(pageOffsetParamNamespace) || "1";
        const environments = ctx.req.queries("e") || [];
        const openSourceOnly = ctx.req.query(licenseFilterParamNamespace) === "oss";
        const sortBy = ctx.req.query(sortByParamNamespace) || defaultSortBy;
        const type = getProjectTypeFromName(ctx.req.query("type") || "");

        let pageNumber = Number.parseInt(page);
        if (!isNumber(pageNumber)) pageNumber = 1;

        return await searchProjects(ctx, {
            query,
            loaders,
            gameVersions,
            categories,
            environments,
            openSourceOnly,
            sortBy: sortBy as SearchResultSortMethod,
            page: pageNumber,
            type: type,
        });
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function sortByFilters(ctx: Context) {
    try {
        const list = [
            SearchResultSortMethod.RELEVANCE,
            SearchResultSortMethod.DOWNLOADS,
            SearchResultSortMethod.FOLLOW_COUNT,
            SearchResultSortMethod.RECENTLY_UPDATED,
            SearchResultSortMethod.RECENTLY_PUBLISHED,
        ];
        return ctx.json({ success: true, queryKey: sortByParamNamespace, default: defaultSortBy, list: list }, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function loaderFilters(ctx: Context) {
    try {
        const projectType = getProjectTypeFromName(ctx.req.query("type") || "");
        if (!projectType) {
            return ctx.json({ success: false, message: "Invalid project type" }, httpCode("bad_request"));
        }

        const loaderFilters = getAllLoaderCategories(projectType);
        return ctx.json({ success: true, queryKey: loaderFilterParamNamespace, list: loaderFilters }, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function gameVersionFilters(ctx: Context) {
    try {
        return ctx.json({ success: true, queryKey: gameVersionFilterParamNamespace, list: GAME_VERSIONS }, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function categoryFilters(ctx: Context) {
    try {
        const projectType = getProjectTypeFromName(ctx.req.query("type") || "");
        if (!projectType) {
            return ctx.json({ success: false, message: "Invalid project type" }, httpCode("bad_request"));
        }

        const categories = getValidProjectCategories([projectType], TagHeaderTypes.CATEGORY).map((category) => category.name);
        return ctx.json({ success: true, queryKey: categoryFilterParamNamespace, list: categories }, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function featureFilters(ctx: Context) {
    try {
        const projectType = getProjectTypeFromName(ctx.req.query("type") || "");
        if (!projectType) {
            return ctx.json({ success: false, message: "Invalid project type" }, httpCode("bad_request"));
        }

        const categories = getValidProjectCategories([projectType], TagHeaderTypes.FEATURE).map((category) => category.name);
        return ctx.json({ success: true, queryKey: categoryFilterParamNamespace, list: categories }, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function resolutionFilters(ctx: Context) {
    try {
        const projectType = getProjectTypeFromName(ctx.req.query("type") || "");
        if (!projectType) {
            return ctx.json({ success: false, message: "Invalid project type" }, httpCode("bad_request"));
        }

        const categories = getValidProjectCategories([projectType], TagHeaderTypes.RESOLUTION).map((category) => category.name);
        return ctx.json({ success: true, queryKey: categoryFilterParamNamespace, list: categories }, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function performanceImpactFilters(ctx: Context) {
    try {
        const projectType = getProjectTypeFromName(ctx.req.query("type") || "");
        if (!projectType) {
            return ctx.json({ success: false, message: "Invalid project type" }, httpCode("bad_request"));
        }

        const categories = getValidProjectCategories([projectType], TagHeaderTypes.PERFORMANCE_IMPACT).map((category) => category.name);
        return ctx.json({ success: true, queryKey: categoryFilterParamNamespace, list: categories }, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function licenseFilters(ctx: Context) {
    try {
        return ctx.json({ success: true, queryKey: licenseFilterParamNamespace, list: ["oss"] }, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

export default searchRouter;
