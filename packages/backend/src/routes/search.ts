import { searchProjects } from "@/controllers/search";
import { defaultServerErrorResponse } from "@/utils/http";
import {
    categoryFilterParamNamespace,
    defaultSortBy,
    gameVersionFilterParamNamespace,
    licenseFilterParamNamespace,
    loaderFilterParamNamespace,
    pageOffsetParamNamespace,
    sortByParamNamespace,
} from "@shared/config/search";
import { isNumber } from "@shared/lib/utils";
import { ProjectType, type SearchResultSortMethod } from "@shared/types";
import { type Context, Hono } from "hono";

const searchRouter = new Hono();

searchRouter.get("/", async (ctx: Context) => {
    try {
        const query = ctx.req.query("q") || "";
        const categories = ctx.req.queries(categoryFilterParamNamespace) || [];
        const loaders = ctx.req.queries(loaderFilterParamNamespace) || [];
        const gameVersions = ctx.req.queries(gameVersionFilterParamNamespace) || [];
        const page = ctx.req.query(pageOffsetParamNamespace) || "1";
        const environments = ctx.req.queries("e") || [];
        const openSourceOnly = ctx.req.query(licenseFilterParamNamespace) === "oss";
        const sortBy = ctx.req.query(sortByParamNamespace) || defaultSortBy;
        const type = ctx.req.query("type") || ProjectType.MOD;

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
            type: type as ProjectType,
        });
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

export default searchRouter;
