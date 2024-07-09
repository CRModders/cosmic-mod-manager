import { Hono } from "hono";
import meilisearch from "@/lib/search-service";
import { defaultSearchPageSize, projectsSearchIndexName } from "@root/config";
import { SearchResultSortTypes } from "@root/types";
import {
    generateSearchFilterString,
    getSelectedCategoryFilters,
    getSelectedLoaderFilters,
} from "@root/lib/search-helpers";

const searchRouter = new Hono();

searchRouter.get("/", async (c) => {
    try {
        const query = decodeURIComponent(c.req.query("query") || "");
        let sortBy = decodeURIComponent(c.req.query("sortBy") || "");
        const page = Number.parseInt(decodeURIComponent(c.req.query("page") || "")) || 1;
        const offset = Math.max(page - 1, 0) * defaultSearchPageSize;
        const projectType = decodeURIComponent(c.req.query("projectType") || "");
        const categoryFilters = getSelectedCategoryFilters(c.req.queries("tags") || []);
        const loaderFilters = getSelectedLoaderFilters(c.req.queries("loaders") || []);
        const ossOnly = c.req.query("oss") === "true";
        const searchIndex = meilisearch.index(projectsSearchIndexName);

        const filter = generateSearchFilterString({
            projectType: projectType,
            query: query,
            loaderFiltersList: loaderFilters,
            categoryFiltersList: categoryFilters,
            ossOnly: ossOnly,
        });

        switch (sortBy) {
            case SearchResultSortTypes.DOWNLOADS:
                sortBy = "total_downloads:desc";
                break;
            // case SearchResultSortTypes.FOLLOW_COUNT:
            //     sortBy = "follow_count:desc";
            //     break;
            case SearchResultSortTypes.RECENTLY_UPDATED:
                sortBy = "updated_on:desc";
                break;
            case SearchResultSortTypes.RECENTLY_PUBLISHED:
                sortBy = "created_on:desc";
                break;
            default:
                sortBy = "total_downloads:desc";
                break;
        }

        const res = await searchIndex.search(query, {
            limit: defaultSearchPageSize,
            showRankingScore: true,
            sort: !sortBy ? [] : [sortBy],
            filter: [filter],
            offset: offset,
        });

        return c.json(
            {
                ...res,
                projectType,
                loaderFilters,
                categoryFilters,
                offset,
                ossOnly,
            },
            200,
        );
    } catch (err) {
        // console.error(err);
        return c.json({ data: null, message: "Internal server error" }, 500);
    }
});

export default searchRouter;
