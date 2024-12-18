import type { ProjectType } from "@app/utils/types";
import type { ProjectListItem } from "@app/utils/types/api";
import type { UseQueryOptions } from "@tanstack/react-query";
import clientFetch from "~/utils/client-fetch";
import { resJson } from "~/utils/server-fetch";

interface SearchResult {
    estimatedTotalHits: number;
    hits: ProjectListItem[];
    limit: number;
    offset: number;
    processingTimeMs: number;
    query: string;
}

let searchResultsFetchReqAbortController: AbortController;

export const getSearchResults = async (params: string, type?: ProjectType) => {
    if (searchResultsFetchReqAbortController) searchResultsFetchReqAbortController.abort();
    searchResultsFetchReqAbortController = new AbortController();

    let queryParams = `${params ? "?" : ""}${params}`;
    if (type) queryParams += `${params ? "&" : "?"}type=${type}`;

    const res = await clientFetch(`/api/search${queryParams}`, {
        signal: searchResultsFetchReqAbortController.signal,
    });
    const data = await resJson(res);

    return (data || {}) as SearchResult;
};

export const getSearchResultsQuery = (params: string, type?: ProjectType) => {
    return {
        queryKey: ["search-results", type],
        queryFn: () => getSearchResults(params, type),
        refetchOnMount: true,
        staleTime: 5 * 1000,
    } satisfies UseQueryOptions;
};
