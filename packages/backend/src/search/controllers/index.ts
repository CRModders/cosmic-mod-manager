import meilisearch from "@/services/meilisearch";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS } from "@/utils/http";
import { type ProjectType, SearchResultSortMethod } from "@shared/types";
import type { ProjectListItem } from "@shared/types/api";
import { type ProjectSearchDocument, projectSearchNamespace } from "../sync-queue";

interface Props {
    query: string;
    loaders: string[];
    gameVersions: string[];
    categories: string[];
    environments: string[];
    openSourceOnly: boolean;
    sortBy: SearchResultSortMethod;
    offset: number;
    limit: number;
    type?: ProjectType;
}

export const searchProjects = async (props: Props): Promise<RouteHandlerResponse> => {
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
            break;
    }

    const environments = [];
    if (props.environments.includes("client")) {
        environments.push("clientSide = true");
    }
    if (props.environments.includes("server")) {
        environments.push("serverSide = true");
    }

    const filters = [
        props.loaders.map((loader) => `loaders = ${loader}`).join(" AND "),
        props.gameVersions.map((gameVersion) => `gameVersions = ${gameVersion}`).join(" AND "),
        props.categories.map((category) => `categories = ${category}`).join(" AND "),
        environments.join(" AND "),
    ];

    if (props.type) filters.push(`type = ${props.type}`);
    if (props.openSourceOnly) filters.push("openSource = true");

    const result = await index.search(props.query, {
        sort: sortBy ? [sortBy] : [],
        limit: props.limit,
        offset: props.offset,
        filter: filters,
    });

    const projects: ProjectListItem[] = [];
    const hits = result.hits as ProjectSearchDocument[];

    for (const project of hits) {
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
            categories: project.categories,
            featuredCategories: project.featuredCategories,
            gameVersions: project.gameVersions,
            loaders: project.loaders,
            author: project.author,
            featured_gallery: project.featured_gallery,
            color: project.color || null,
        });
    }

    result.hits = projects;

    return { data: result, status: HTTP_STATUS.OK };
};
