import SearchListItem from "@/components/layout/search-list-item";
import PaginatedNavigation from "@/components/pagination-nav";
import { LoadingSpinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { defaultSearchLimit, pageOffsetParamNamespace, sortByParamNamespace } from "@shared/config/search";
import { isNumber } from "@shared/lib/utils";
import { type ProjectType, SearchResultSortMethod } from "@shared/types";
import type { ProjectListItem } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface SearchResult {
    estimatedTotalHits: number;
    hits: ProjectListItem[];
    limit: number;
    offset: number;
    processingTimeMs: number;
    query: string;
}

let searchResultsFetchReqAbortController: AbortController;

const getSearchResults = async (params: string, type: ProjectType) => {
    if (searchResultsFetchReqAbortController) searchResultsFetchReqAbortController.abort();
    searchResultsFetchReqAbortController = new AbortController();

    const defaultParams = `${params ? "&" : "?"}type=${type}`;
    const res = await useFetch(`/api/search${params}${defaultParams}`, {
        signal: searchResultsFetchReqAbortController.signal,
    });
    const data = await res.json();

    return (data || {}) as SearchResult;
};

type Props = {
    type: ProjectType;
    searchParams: URLSearchParams;
};

const SearchResults = ({ type, searchParams }: Props) => {
    const params = window.location.href.replace(window.location.origin, "").replace(window.location.pathname, "");
    const searchResult = useQuery({ queryKey: [`${type}-search`], queryFn: () => getSearchResults(params, type) });

    const refetchSearchResults = async () => {
        await searchResult.refetch();
    };

    const pagesCount = Math.ceil((searchResult.data?.estimatedTotalHits || 0) / defaultSearchLimit);
    const pageOffsetParamValue = searchParams.get(pageOffsetParamNamespace);
    let activePage = pageOffsetParamValue ? Number.parseInt(pageOffsetParamValue || "1") : 1;
    if (!isNumber(activePage)) activePage = 1;

    const pagination =
        (searchResult.data?.estimatedTotalHits || 0) > defaultSearchLimit ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageOffsetParamNamespace} />
        ) : null;

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        refetchSearchResults();
    }, [params]);

    return (
        <>
            {pagination}

            {searchResult.data?.hits?.map((project: ProjectListItem) => (
                <SearchListItem
                    key={project.id}
                    projectName={project.name}
                    projectType={project.type[0]}
                    projectSlug={project.slug}
                    icon={project.icon}
                    summary={project.summary}
                    loaders={project.loaders}
                    featuredCategories={project.featuredCategories}
                    downloads={project.downloads}
                    followers={project.followers}
                    dateUpdated={new Date(project.dateUpdated)}
                    datePublished={new Date(project.datePublished)}
                    showDatePublished={searchParams.get(sortByParamNamespace) === SearchResultSortMethod.RECENTLY_PUBLISHED}
                    author={project?.author || ""}
                />
            ))}

            {!searchResult.data?.hits?.length && !searchResult.isLoading && !searchResult.isFetching && (
                <div className="w-full flex items-center justify-center py-8">
                    <span className="text-extra-muted-foreground italic text-xl">No results</span>
                </div>
            )}

            {!searchResult.data?.hits?.length && searchResult.isFetching && (
                <div className="w-full flex items-center justify-center py-8">
                    <LoadingSpinner />
                </div>
            )}

            {pagination}
        </>
    );
};

export default SearchResults;
