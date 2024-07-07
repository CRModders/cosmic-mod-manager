import { Hono } from "hono";
import meilisearch from "@/lib/search-service";
import { defaultSearchPageSize, projectsSearchIndexName } from "@root/config";
import { SearchResultSortTypes } from "@root/types";
import { getSelectedCategoryFilters, getSelectedLoaderFilters } from "@root/lib/search-helpers";

const searchRouter = new Hono();

const attribuesToMatchQueryWith = ["name", "summary"];

searchRouter.get("/", async (c) => {
    try {
        const query = decodeURIComponent(c.req.query("query") || "");
        let sortBy = decodeURIComponent(c.req.query("sortBy") || "");
        const page = Number.parseInt(decodeURIComponent(c.req.query("page") || "")) || 1;
        const offset = Math.max(page - 1, 0) * defaultSearchPageSize;
        const projectType = decodeURIComponent(c.req.query("projectType") || "");
        const categoryFilters = getSelectedCategoryFilters(c.req.queries("tags") || []);
        const loaderFilers = getSelectedLoaderFilters(c.req.queries("loaders") || []);
        const searchIndex = meilisearch.index(projectsSearchIndexName);

        let filter = `type = ${projectType}`;
        if (loaderFilers.length > 0) filter += ` AND (loaders = ${loaderFilers.join(" AND loaders = ")})`;
        if (categoryFilters.length > 0) filter += ` AND (tags = ${categoryFilters.join(" AND tags = ")} )`;
        if (c.req.query("oss") === "true") filter += " AND oss = true";

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
            attributesToSearchOn: attribuesToMatchQueryWith,
            showRankingScore: true,
            sort: !sortBy ? [] : [sortBy],
            filter: [filter],
            offset: offset,
        });

        return c.json({ data: res }, 200);
    } catch (err) {
        console.error(err);
        return c.json({ data: null, message: "Internal server error" }, 500);
    }
});

export default searchRouter;
