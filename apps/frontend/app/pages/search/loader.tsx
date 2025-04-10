import type { ProjectType } from "@app/utils/types";
import type { SearchResult } from "@app/utils/types/api";
import type { UseQueryOptions } from "@tanstack/react-query";
import clientFetch from "~/utils/client-fetch";
import { resJson } from "~/utils/server-fetch";

let searchResultsFetchReqAbortController: AbortController;

export async function getSearchResults(params: string, type?: ProjectType) {
    if (searchResultsFetchReqAbortController) searchResultsFetchReqAbortController.abort();
    searchResultsFetchReqAbortController = new AbortController();

    let queryParams = `${params ? "?" : ""}${params}`;
    if (type) queryParams += `${params ? "&" : "?"}type=${type}`;

    const res = await clientFetch(`/api/search${queryParams}`, {
        signal: searchResultsFetchReqAbortController.signal,
    });
    const data = await resJson(res);

    return (data || {}) as SearchResult;
}

export function getSearchResultsQuery(params: string, type?: ProjectType) {
    return {
        queryKey: ["search-results", type],
        queryFn: () => getSearchResults(params, type),
        refetchOnMount: false,
        staleTime: 5 * 1000,
    } satisfies UseQueryOptions;
}
