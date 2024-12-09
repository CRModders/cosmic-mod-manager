import { useLocation, useOutletContext } from "react-router";
import { cn } from "@root/utils";
import { defaultSearchLimit, pageOffsetParamNamespace, sortByParamNamespace } from "@shared/config/search";
import { isNumber } from "@shared/lib/utils";
import { SearchResultSortMethod } from "@shared/types";
import type { ProjectListItem } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import SearchListItem, { ViewType } from "~/components/layout/search-list-item";
import PaginatedNavigation from "~/components/pagination-nav";
import { LoadingSpinner } from "~/components/ui/spinner";
import type { SearchOutlet } from "./layout";
import { getSearchResultsQuery } from "./loader";

export function SearchResultsPage() {
    const { type, typeStr, viewType, searchParams } = useOutletContext<SearchOutlet>();

    const location = useLocation();
    const searchResult = useQuery(getSearchResultsQuery(location.search?.replace("?", ""), type === typeStr ? type : undefined));

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

    useEffect(() => {
        refetchSearchResults();
    }, [searchParams]);

    return (
        <>
            {pagination}

            <section
                className={cn("w-full h-fit grid grid-cols-1 gap-panel-cards", viewType === ViewType.GALLERY && "sm:grid-cols-2")}
                role="list"
                aria-label="Search Results"
            >
                {searchResult.data?.hits?.map((project: ProjectListItem) => (
                    <SearchListItem
                        key={project.id}
                        vtId={project.id}
                        viewType={viewType}
                        projectName={project.name}
                        projectType={project.type[0]}
                        projectSlug={project.slug}
                        icon={project.icon}
                        featuredGallery={project.featured_gallery}
                        color={project.color}
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
            </section>

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
}
