import PaginatedNavigation from "@app/components/misc/pagination-nav";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { cn } from "@app/components/utils";
import { defaultSearchLimit, pageOffsetParamNamespace, searchLimitParamNamespace, sortByParamNamespace } from "@app/utils/config/search";
import { isNumber } from "@app/utils/number";
import { SearchResultSortMethod } from "@app/utils/types";
import type { ProjectListItem } from "@app/utils/types/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigation, useOutletContext } from "react-router";
import SearchListItem, { ViewType } from "~/components/search-list-item";
import type { SearchOutlet } from "./layout";
import { getSearchResultsQuery } from "./loader";

export function SearchResultsPage() {
    const { type, typeStr, viewType, searchParams } = useOutletContext<SearchOutlet>();

    const currLocation = useLocation();
    const nextLocation = useNavigation().location;

    const location = nextLocation || currLocation;
    const searchResult = useQuery(getSearchResultsQuery(location.search?.replace("?", ""), type === typeStr ? type : undefined));

    let showPerPage = Number.parseInt(searchParams.get(searchLimitParamNamespace) || defaultSearchLimit.toString());
    if (!isNumber(showPerPage)) showPerPage = defaultSearchLimit;

    const pagesCount = Math.ceil((searchResult.data?.estimatedTotalHits || 0) / showPerPage);
    const pageOffsetParamValue = searchParams.get(pageOffsetParamNamespace);
    let activePage = pageOffsetParamValue ? Number.parseInt(pageOffsetParamValue || "1") : 1;
    if (!isNumber(activePage)) activePage = 1;

    const pagination =
        (searchResult.data?.estimatedTotalHits || 0) > showPerPage ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageOffsetParamNamespace} />
        ) : null;

    async function refetchSearchResults() {
        await searchResult.refetch();
    }

    useEffect(() => {
        refetchSearchResults();
    }, [searchParams]);

    return (
        <>
            {pagination}

            <section
                className={cn("w-full h-fit grid grid-cols-1 gap-panel-cards", viewType === ViewType.GALLERY && "sm:grid-cols-2")}
                // biome-ignore lint/a11y/useSemanticElements: <explanation>
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
                        isOrgOwned={project.isOrgOwned}
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
