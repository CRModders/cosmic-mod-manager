import PaginatedNavigation from "@app/components/misc/pagination-nav";
import { cn } from "@app/components/utils";
import { defaultSearchLimit, pageOffsetParamNamespace, searchLimitParamNamespace, sortByParamNamespace } from "@app/utils/config/search";
import { isNumber } from "@app/utils/number";
import { SearchResultSortMethod } from "@app/utils/types";
import type { ProjectListItem } from "@app/utils/types/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useOutletContext } from "react-router";
import { useSpinnerCtx } from "~/components/global-spinner";
import SearchListItem, { ViewType } from "~/components/search-list-item";
import { useTranslation } from "~/locales/provider";
import type { SearchOutlet } from "./layout";
import { getSearchResultsQuery } from "./loader";

export function SearchResultsPage() {
    const { t } = useTranslation();
    const { projectType_Coerced, projectType, viewType, searchParams, initialSearchData } = useOutletContext<SearchOutlet>();

    const { setShowSpinner } = useSpinnerCtx();
    const location = useLocation();

    const searchQuery = useQuery(
        getSearchResultsQuery(location.search?.replace("?", ""), projectType_Coerced === projectType ? projectType_Coerced : undefined),
    );
    const validInitData = searchQuery.isLoading && projectType === initialSearchData?.projectType && initialSearchData;
    const searchResults = validInitData ? initialSearchData : searchQuery.data;

    let showPerPage = Number.parseInt(searchParams.get(searchLimitParamNamespace) || defaultSearchLimit.toString());
    if (!isNumber(showPerPage)) showPerPage = defaultSearchLimit;

    const pagesCount = Math.ceil((searchResults?.estimatedTotalHits || 0) / showPerPage);
    const pageOffsetParamValue = searchParams.get(pageOffsetParamNamespace);
    let activePage = pageOffsetParamValue ? Number.parseInt(pageOffsetParamValue || "1") : 1;
    if (!isNumber(activePage)) activePage = 1;

    const pagination =
        (searchResults?.estimatedTotalHits || 0) > showPerPage ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageOffsetParamNamespace} />
        ) : null;

    async function refetchSearchResults() {
        await searchQuery.refetch();
    }

    useEffect(() => {
        refetchSearchResults();
    }, [searchParams.toString()]);

    useEffect(() => {
        if (validInitData) return setShowSpinner(false);

        setShowSpinner(searchQuery.isFetching);
    }, [searchQuery.isFetching]);

    return (
        <>
            {pagination}

            <section
                className={cn("w-full h-fit grid grid-cols-1 gap-panel-cards", viewType === ViewType.GALLERY && "sm:grid-cols-2")}
                // biome-ignore lint/a11y/useSemanticElements: <explanation>
                role="list"
                aria-label="Search Results"
            >
                {searchResults?.hits?.map((project: ProjectListItem) => (
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
                        visibility={project.visibility}
                    />
                ))}
            </section>

            {!searchResults?.hits?.length && !searchQuery.isLoading && !searchQuery.isFetching && (
                <div className="w-full flex items-center justify-center py-8">
                    <span className="text-extra-muted-foreground italic text-xl">{t.common.noResults}</span>
                </div>
            )}

            {!searchResults?.hits?.length && searchQuery.isFetching && (
                <div className="w-full flex items-center justify-center py-8">...</div>
            )}

            {pagination}
        </>
    );
}
