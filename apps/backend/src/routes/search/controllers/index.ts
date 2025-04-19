import { EnvironmentSupport, type ProjectType, SearchResultSortMethod } from "@app/utils/types";
import type { ProjectListItem } from "@app/utils/types/api";
import meilisearch from "~/services/meilisearch";
import { HTTP_STATUS, invalidReqestResponseData } from "~/utils/http";
import { type ProjectSearchDocument, projectSearchNamespace } from "../sync-utils";

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

export async function searchProjects(props: Props) {
    // Validate the filters
    if (props.query?.length > 64) return invalidReqestResponseData(`Query string too long: '${props.query}'`);

    const Items = [props.type, ...props.loaders, ...props.gameVersions, ...props.categories];
    for (let i = 0; i < Items.length; i++) {
        const item = Items[i];
        if (!item) continue;

        if (item?.length > 32) return invalidReqestResponseData(`Filter string too long: ${item}`);
        if (isValidFilterStr(item) === false) return invalidReqestResponseData(`Invalid filter string: ${item}`);
    }

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

    let envFilter = "";
    // If both client and server are selected, only include projects that require both environments
    if (props.environments.includes("client") && props.environments.includes("server")) {
        envFilter = `clientSide = ${EnvironmentSupport.REQUIRED} AND serverSide = ${EnvironmentSupport.REQUIRED}`;
    }
    // If only client is selected, include projects that require only client or optionally server
    else if (props.environments.includes("client")) {
        envFilter = `clientSide = ${EnvironmentSupport.REQUIRED} AND serverSide != ${EnvironmentSupport.REQUIRED}`
    }
    // If only server is selected, include projects that require only server or optionally client
    else if (props.environments.includes("server")) {
        envFilter = `serverSide = ${EnvironmentSupport.REQUIRED} AND clientSide != ${EnvironmentSupport.REQUIRED}`
    }

    const filters = [
        props.loaders.map((loader) => `loaders = ${loader}`).join(" OR "),
        props.gameVersions.map((gameVersion) => `gameVersions = ${gameVersion}`).join(" OR "),
        props.categories.map((category) => `categories = ${category}`).join(" AND "),
        envFilter,
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
            clientSide: project.clientSide,
            serverSide: project.serverSide,
            featured_gallery: project.featured_gallery,
            color: project.color || null,
            isOrgOwned: project.isOrgOwned,
            visibility: project.visibility,
        });
    }

    result.hits = projects;

    return { data: result, status: HTTP_STATUS.OK };
}

function isValidFilterStr(str: string) {
    const regex = /^[a-zA-Z0-9-_.]+$/;
    return regex.test(str);
}
