import PaginatedNavigation from "@app/components/misc/pagination-nav";
import { cn } from "@app/components/utils";
import { pageOffsetParamNamespace } from "@app/utils/config/search";
import { SearchResultSortMethod } from "@app/utils/types";
import type { ProjectListItem } from "@app/utils/types/api";
import { useOutletContext } from "react-router";
import SearchListItem, { ViewType } from "~/components/search-list-item";
import { useTranslation } from "~/locales/provider";
import type { SearchOutlet } from "./layout";
import { useSearchContext } from "./provider";

export function SearchResultsPage() {
    const { t } = useTranslation();
    const { viewType } = useOutletContext<SearchOutlet>();
    const { result: searchResult, sortBy, projectsPerPage, pageOffset, pagesCount, isLoading, isFetching } = useSearchContext();

    const pagination =
        (searchResult?.estimatedTotalHits || 0) > projectsPerPage ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={pageOffset} searchParamKey={pageOffsetParamNamespace} />
        ) : null;

    return (
        <>
            {pagination}

            <section
                className={cn("w-full h-fit grid grid-cols-1 gap-panel-cards", viewType === ViewType.GALLERY && "sm:grid-cols-2")}
                // biome-ignore lint/a11y/useSemanticElements: <explanation>
                role="list"
                aria-label="Search Results"
            >
                {searchResult?.hits?.map((project: ProjectListItem) => (
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
                        showDatePublished={sortBy === SearchResultSortMethod.RECENTLY_PUBLISHED}
                        author={project?.author || ""}
                        isOrgOwned={project.isOrgOwned}
                        visibility={project.visibility}
                    />
                ))}
            </section>

            {!searchResult?.hits?.length && !isLoading && !isFetching && (
                <div className="w-full flex items-center justify-center py-8">
                    <span className="text-extra-muted-foreground italic text-xl">{t.common.noResults}</span>
                </div>
            )}

            {!searchResult?.hits?.length && isFetching && <div className="w-full flex items-center justify-center py-8">...</div>}

            {pagination}
        </>
    );
}
