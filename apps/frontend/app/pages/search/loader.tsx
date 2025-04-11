import type { ProjectType } from "@app/utils/types";
import type { SearchResult } from "@app/utils/types/api";
import clientFetch from "~/utils/client-fetch";
import { resJson } from "~/utils/server-fetch";

let searchResultsFetchReqAbortController: AbortController;

export async function getSearchResults(params: string, type?: ProjectType) {
    if (searchResultsFetchReqAbortController) searchResultsFetchReqAbortController.abort("Aborted due to new request");
    searchResultsFetchReqAbortController = new AbortController();

    let queryParams = `${params ? "?" : ""}${params}`;
    if (type) queryParams += `${params ? "&" : "?"}type=${type}`;

    const res = await clientFetch(`/api/search${queryParams}`, {
        signal: searchResultsFetchReqAbortController.signal,
    });
    const data = await resJson(res);

    return (data || {}) as SearchResult;
}
