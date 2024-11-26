import clientFetch from "@root/utils/client-fetch";
import { resJson } from "@root/utils/server-fetch";
import type { ProjectType } from "@shared/types";
import type { ProjectListItem } from "@shared/types/api";
import type { UseQueryOptions } from "@tanstack/react-query";

interface SearchResult {
    estimatedTotalHits: number;
    hits: ProjectListItem[];
    limit: number;
    offset: number;
    processingTimeMs: number;
    query: string;
}

let searchResultsFetchReqAbortController: AbortController;

export const getSearchResults = async (params: string, type: ProjectType) => {
    if (searchResultsFetchReqAbortController) searchResultsFetchReqAbortController.abort();
    searchResultsFetchReqAbortController = new AbortController();

    const queryParams = `${params ? "?" : ""}${params}${params ? "&" : "?"}type=${type}`;

    const res = await clientFetch(`/api/search${queryParams}`, {
        signal: searchResultsFetchReqAbortController.signal,
    });
    const data = await resJson(res);

    return (data || {}) as SearchResult;
};

export const getSearchResultsQuery = (params: string, type: ProjectType) => {
    return {
        queryKey: ["search-results", type],
        queryFn: () => getSearchResults(params, type),
        refetchOnMount: true,
        staleTime: 5 * 1000,
    } satisfies UseQueryOptions;
};
