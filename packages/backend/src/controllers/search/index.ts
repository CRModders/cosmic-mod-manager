import meilisearch from "@/services/meilisearch";
import { projectSearchNamespace } from "@/services/queues/searchdb-sync";
import httpCode from "@/utils/http";
import { defaultSearchLimit } from "@shared/config/search";
import { type ProjectType, SearchResultSortMethod } from "@shared/types";
import type { ProjectListItem } from "@shared/types/api";
import type { Context } from "hono";

interface Props {
    query: string;
    loaders: string[];
    gameVersions: string[];
    categories: string[];
    environments: string[];
    openSourceOnly: boolean;
    sortBy: SearchResultSortMethod;
    page: number;
    type: ProjectType;
}

export const searchProjects = async (ctx: Context, props: Props) => {
    const index = meilisearch.index(projectSearchNamespace);
    let sortBy = null;

    switch (props.sortBy) {
        case SearchResultSortMethod.RELEVANCE:
            sortBy = props.query ? null : "downloads:desc";
            break;
        case SearchResultSortMethod.RECENTLY_PUBLISHED:
            sortBy = "datePublished:desc";
            break;
        case SearchResultSortMethod.DOWNLOADS:
            sortBy = "downloads:desc";
            break;
        case SearchResultSortMethod.FOLLOW_COUNT:
            sortBy = "followers:desc";
            break;
        case SearchResultSortMethod.RECENTLY_UPDATED:
            sortBy = "dateUpdated:desc";
    }

    const offset = (props.page - 1) * defaultSearchLimit;
    const environments = [];
    if (props.environments.includes("client")) {
        environments.push("clientSide = true");
    }
    if (props.environments.includes("server")) {
        environments.push("serverSide = true");
    }

    const result = await index.search(props.query, {
        sort: sortBy ? [sortBy] : [],
        limit: defaultSearchLimit,
        offset: offset,
        filter: [
            props.loaders.map((loader) => `loaders = ${loader}`),
            props.gameVersions.map((gameVersion) => `gameVersions = ${gameVersion}`),
            props.categories.map((category) => `categories = ${category}`),
            environments,
            props.openSourceOnly ? "openSource = true" : "",
            `type = ${props.type}`,
        ],
    });

    const projects: ProjectListItem[] = [];
    for (const project of result.hits) {
        projects.push({
            id: project.id,
            slug: project.slug,
            name: project.name,
            summary: project.summary,
            type: project.type,
            icon: project.iconUrl,
            downloads: project.downloads,
            followers: project.followers,
            dateUpdated: project.dateUpdated,
            datePublished: project.datePublished,
            featuredCategories: project.categories,
            categories: project.categories,
            gameVersions: project.gameVersions,
            loaders: project.loaders,
            author: project.author,
        });
    }

    result.hits = projects;

    return ctx.json(result, httpCode("ok"));
};
