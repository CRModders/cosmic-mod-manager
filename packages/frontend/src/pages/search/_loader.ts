import { routeLoader } from "@/lib/route-loader";
import useFetch from "@/src/hooks/fetch";
import type { ProjectType } from "@shared/types";
import type { ProjectListItem } from "@shared/types/api";
import type { QueryClient, UseQueryOptions } from "@tanstack/react-query";

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

    const res = await useFetch(`/api/search${queryParams}`, {
        signal: searchResultsFetchReqAbortController.signal,
    });
    const data = await res.json();

    return (data || {}) as SearchResult;
};
export const getSearchResultsQuery = (params: string, type: ProjectType) => {
    return {
        queryKey: ["search-results", type],
        queryFn: () => getSearchResults(params, type),
        staleTime: 1000,
    } satisfies UseQueryOptions;
};

export const searchResultsLoader = (queryClient: QueryClient, type: ProjectType) => {
    const _loader = routeLoader(({ params, request, context }) => {
        const searchParams = new URL(request.url).searchParams;

        return getSearchResultsQuery(searchParams.toString(), type);
    });

    return _loader(queryClient);
};
