import { ContentWrapperCard, PanelContent, PanelLayout, SidePanel } from "@/components/panel-layout";
import { Button } from "@/components/ui/button";
import { LabelledCheckBox } from "@/components/ui/checkbox";
import { CalendarIcon, CrossCircledIcon, CubeIcon, MagnifyingGlassIcon, UpdateIcon } from "@radix-ui/react-icons";
import {
    CapitalizeAndFormatString,
    createURLSafeSlug,
    formatDate,
    GetProjectLoadersDataFromName,
    GetProjectTagsFromNames,
    timeSince,
} from "@root/lib/utils";
import {
    type ProjectType,
    type SearchResult,
    SearchResultSortTypes,
    TagHeaderTypes,
    time_past_phrases,
} from "@root/types";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    getAllLoaderFilters,
    getAllTaggedFilters,
    getSelectedCategoryFilters,
    getSelectedLoaderFilters,
} from "@root/lib/search-helpers";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CategoryIconWrapper from "@/components/category-icon-wrapper";
import { useQuery } from "@tanstack/react-query";
import useFetch from "../hooks/fetch";
import { TooltipWrapper } from "../settings/session/timestamp";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import "./styles.css";
import "@/src/globals.css";
import { cn } from "@/lib/utils";
import { FunnelIcon } from "@/components/icons";
import { defaultSearchPageSize, defaultSortType } from "@root/config";
import { Helmet } from "react-helmet";
import PaginatedNavigation from "@/components/pagination";
import { Label } from "@/components/ui/label";

let searchResultsFetchReqAbortController: AbortController;
const timestamp_template = "${month} ${day}, ${year} at ${hours}:${minutes} ${amPm}";
const categoryFilterKey = "tags";
const searchQueryKey = "query";
const pageOffsetParamKey = "page";
let newSearchQueryTimeout: number | undefined;

type UpdateParamOptions = {
    deleteParamOnFalsyValue?: boolean;
    deleteParamIfValueMatches?: string;
    deleteParamIfNewValueMatchesOldOne?: boolean;
    newParamsAdditionMode?: "replace" | "append";
    deleteParamWithMatchingValOnly?: boolean;
    customUrlModifierFunc?: (currUrl: URL) => URL;
};

const updateSearchParam = (
    key: string,
    value: string,
    {
        deleteParamOnFalsyValue = true,
        newParamsAdditionMode = "append",
        deleteParamIfValueMatches,
        deleteParamWithMatchingValOnly = true,
        deleteParamIfNewValueMatchesOldOne = true,
        customUrlModifierFunc,
    }: UpdateParamOptions = {},
) => {
    let currUrl = new URL(window.location.href);

    if (
        (deleteParamOnFalsyValue === true && !value) ||
        (deleteParamIfValueMatches !== undefined && deleteParamIfValueMatches === value) ||
        (deleteParamIfNewValueMatchesOldOne === true && currUrl.searchParams.getAll(key).includes(value))
    ) {
        if (deleteParamWithMatchingValOnly === true && value && deleteParamIfValueMatches !== value)
            currUrl.searchParams.delete(key, value);
        else currUrl.searchParams.delete(key);
    } else {
        if (newParamsAdditionMode === "replace") currUrl.searchParams.set(key, value);
        else if (newParamsAdditionMode === "append") currUrl.searchParams.append(key, value);
    }

    if (customUrlModifierFunc) currUrl = customUrlModifierFunc(currUrl);

    return currUrl.href.replace(window.location.origin, "");
};

const deletePageOffsetParam = (url: URL) => {
    url.searchParams.delete(pageOffsetParamKey);
    return url;
};

const getSearchResults = async (searchQuery: string, projectType: string) => {
    try {
        if (searchResultsFetchReqAbortController) searchResultsFetchReqAbortController.abort();
        searchResultsFetchReqAbortController = new AbortController();

        const url = new URL(window.location.href);
        const categoryFilters = url.searchParams.getAll(categoryFilterKey) || [];
        const loaderFilers = url.searchParams.getAll("l") || [];
        const page = url.searchParams.get(pageOffsetParamKey);

        let paramsString = "";
        if (searchQuery) paramsString += `&query=${encodeURIComponent(searchQuery)}`;
        if ((categoryFilters || []).length > 0) paramsString += "&tags=";
        paramsString += categoryFilters.join("&tags=");
        if ((loaderFilers || []).length > 0) paramsString += "&loaders=";
        paramsString += loaderFilers.join("&loaders=");
        if (url.searchParams.get("oss") === "true") paramsString += "&oss=true";
        paramsString += `&sortBy=${encodeURIComponent(url.searchParams.get("sortBy") || defaultSortType)}`;
        if (page) paramsString += `&page=${encodeURIComponent(page)}`;

        const res = await useFetch(`/api/search?projectType=${projectType}${paramsString}`, {
            signal: searchResultsFetchReqAbortController.signal,
        });
        return await res.json();
    } catch {
        return null;
    }
};

export default function SearchPage({ projectType }: { projectType: ProjectType }) {
    const [searchParams] = useSearchParams();
    const [isFiltersPanelVisible, setIsFiltersPanelVisible] = useState(false);
    const selectedLoaderFilters = new Set(getSelectedLoaderFilters(searchParams.getAll("l")));
    const selectedCategoryFilters = new Set(getSelectedCategoryFilters(searchParams.getAll(categoryFilterKey)));
    const navigate = useNavigate();

    const searchResults = useQuery({
        queryKey: [`${projectType}-search`],
        queryFn: () => getSearchResults(searchParams.get(searchQueryKey) || "", projectType),
        refetchOnMount: true,
    });

    const refetchSearchQueryResults = async () => {
        if (newSearchQueryTimeout) clearTimeout(newSearchQueryTimeout);
        newSearchQueryTimeout = window.setTimeout(() => {
            searchResults.refetch();
        }, 50);
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        refetchSearchQueryResults();
    }, [searchParams]);

    return (
        <>
            <Helmet>
                <title>Search {CapitalizeAndFormatString(projectType)?.toLowerCase()}s | CRMM</title>
                <meta name="description" content="A hosting platform for cosmic reach mods" />
            </Helmet>
            <div className="w-full pb-32">
                <PanelLayout>
                    <SidePanel className={cn("px-6 py-5", !isFiltersPanelVisible && "hidden lg:flex")}>
                        <div className="w-full flex flex-col items-start justify-start gap-4">
                            <Button
                                variant={"secondary"}
                                disabled={
                                    !(
                                        searchParams.get(categoryFilterKey) ||
                                        searchParams.get("l") ||
                                        searchParams.get("oss")
                                    )
                                }
                                onClick={() => {
                                    const currUrl = new URL(window.location.href);
                                    currUrl.searchParams.delete(categoryFilterKey);
                                    currUrl.searchParams.delete("l");
                                    currUrl.searchParams.delete("oss");

                                    navigate(currUrl.href.replace(window.location.origin, ""));
                                }}
                            >
                                <CrossCircledIcon className="w-4 h-4" />
                                Clear filters
                            </Button>

                            {!getAllTaggedFilters(projectType, [TagHeaderTypes.CATEGORY])?.length ? null : (
                                <div className="w-full flex flex-col items-start justify-start">
                                    <p className="text-foreground text-lg font-semibold">Categories</p>
                                    {getAllTaggedFilters(projectType, [TagHeaderTypes.CATEGORY]).map((category) => {
                                        return (
                                            <LabelledCheckBox
                                                className="w-full"
                                                checkBoxId={`category-filter-checkbox-${category.name}`}
                                                key={category.name}
                                                checked={selectedCategoryFilters.has(category.name)}
                                                onCheckedChange={() => {
                                                    const urlPathname = updateSearchParam(
                                                        categoryFilterKey,
                                                        category.name,
                                                        {
                                                            customUrlModifierFunc: deletePageOffsetParam,
                                                        },
                                                    );
                                                    navigate(urlPathname);
                                                }}
                                                label={
                                                    <span className="flex items-center justify-center gap-1">
                                                        <CategoryIconWrapper name={category.icon} />
                                                        {CapitalizeAndFormatString(category.name)?.replaceAll(
                                                            "-",
                                                            " ",
                                                        ) || ""}
                                                    </span>
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {!getAllTaggedFilters(projectType, [TagHeaderTypes.FEATURE])?.length ? null : (
                                <div className="w-full flex flex-col items-start justify-start">
                                    <p className="text-foreground text-lg font-semibold">Features</p>
                                    {getAllTaggedFilters(projectType, [TagHeaderTypes.FEATURE]).map((category) => {
                                        return (
                                            <LabelledCheckBox
                                                className="w-full"
                                                checkBoxId={`category-filter-checkbox-${category.name}`}
                                                key={category.name}
                                                checked={selectedCategoryFilters.has(category.name)}
                                                onCheckedChange={() => {
                                                    const urlPathname = updateSearchParam(
                                                        categoryFilterKey,
                                                        category.name,
                                                        {
                                                            customUrlModifierFunc: deletePageOffsetParam,
                                                        },
                                                    );
                                                    navigate(urlPathname);
                                                }}
                                                label={
                                                    <span className="flex items-center justify-center gap-1">
                                                        <CategoryIconWrapper name={category.icon} />
                                                        {CapitalizeAndFormatString(category.name)?.replaceAll(
                                                            "-",
                                                            " ",
                                                        ) || ""}
                                                    </span>
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {!getAllTaggedFilters(projectType, [TagHeaderTypes.PERFORMANCE_IMPACT])?.length ? null : (
                                <div className="w-full flex flex-col items-start justify-start">
                                    <p className="text-foreground text-lg font-semibold">Performance impact</p>
                                    {getAllTaggedFilters(projectType, [TagHeaderTypes.PERFORMANCE_IMPACT]).map(
                                        (category) => {
                                            return (
                                                <LabelledCheckBox
                                                    className="w-full"
                                                    checkBoxId={`category-filter-checkbox-${category.name}`}
                                                    key={category.name}
                                                    checked={selectedCategoryFilters.has(category.name)}
                                                    onCheckedChange={() => {
                                                        const urlPathname = updateSearchParam(
                                                            categoryFilterKey,
                                                            category.name,
                                                            {
                                                                customUrlModifierFunc: deletePageOffsetParam,
                                                            },
                                                        );
                                                        navigate(urlPathname);
                                                    }}
                                                    label={
                                                        <span className="flex items-center justify-center gap-1">
                                                            <CategoryIconWrapper name={category.icon} />
                                                            {CapitalizeAndFormatString(category.name)?.replaceAll(
                                                                "-",
                                                                " ",
                                                            ) || ""}
                                                        </span>
                                                    }
                                                />
                                            );
                                        },
                                    )}
                                </div>
                            )}

                            {!getAllTaggedFilters(projectType, [TagHeaderTypes.RESOLUTION])?.length ? null : (
                                <div className="w-full flex flex-col items-start justify-start">
                                    <p className="text-foreground text-lg font-semibold">Resolutions</p>
                                    {getAllTaggedFilters(projectType, [TagHeaderTypes.RESOLUTION]).map((category) => {
                                        return (
                                            <LabelledCheckBox
                                                className="w-full"
                                                checkBoxId={`category-filter-checkbox-${category.name}`}
                                                key={category.name}
                                                checked={selectedCategoryFilters.has(category.name)}
                                                onCheckedChange={() => {
                                                    const urlPathname = updateSearchParam(
                                                        categoryFilterKey,
                                                        category.name,
                                                        {
                                                            customUrlModifierFunc: deletePageOffsetParam,
                                                        },
                                                    );
                                                    navigate(urlPathname);
                                                }}
                                                label={
                                                    CapitalizeAndFormatString(category.name)
                                                        ?.replaceAll("-", " or lower")
                                                        .replaceAll("+", " or higher") || ""
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            )}
                            {getAllLoaderFilters(projectType)?.length > 0 && (
                                <div className="w-full flex flex-col items-start justify-start">
                                    <p className="text-foreground text-lg font-semibold">Loaders</p>
                                    {getAllLoaderFilters(projectType).map((loader) => {
                                        return (
                                            <LabelledCheckBox
                                                className="w-full"
                                                checkBoxId={`loader-filter-checkbox-${loader.name}`}
                                                key={loader.name}
                                                checked={selectedLoaderFilters.has(loader.name)}
                                                onCheckedChange={() => {
                                                    const loaderName = createURLSafeSlug(loader.name).value;
                                                    const urlPathname = updateSearchParam("l", loaderName, {
                                                        customUrlModifierFunc: deletePageOffsetParam,
                                                    });

                                                    navigate(urlPathname);
                                                }}
                                                label={
                                                    <span className="flex items-center justify-center gap-1">
                                                        <CategoryIconWrapper name={loader.icon} />
                                                        {CapitalizeAndFormatString(loader.name)?.replaceAll("-", " ") ||
                                                            ""}
                                                    </span>
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            <div className="w-full flex flex-col items-start justify-start">
                                <p className="text-foreground text-lg font-semibold">Open source</p>

                                <LabelledCheckBox
                                    className="w-full"
                                    checkBoxId={"oss-only-filter-checkbox"}
                                    checked={searchParams.get("oss") === "true"}
                                    onCheckedChange={(e) => {
                                        const urlPathname = updateSearchParam("oss", `${!!e}`, {
                                            deleteParamIfValueMatches: "false",
                                            customUrlModifierFunc: deletePageOffsetParam,
                                        });
                                        navigate(urlPathname);
                                    }}
                                    label="Open source only"
                                />
                            </div>
                        </div>
                    </SidePanel>
                    <PanelContent>
                        <SearchPageContent
                            isLoadingInitialData={searchResults.isLoading}
                            isFetchingData={searchResults.isFetching}
                            selectedLoaderFilters={selectedLoaderFilters}
                            selectedCategoryFilters={selectedCategoryFilters}
                            projectType={projectType}
                            searchResults={searchResults.data?.data?.hits as SearchResult[] | null | undefined}
                            totalEstimatedHits={searchResults.data?.data?.estimatedTotalHits || 0}
                            setIsFiltersPanelVisible={setIsFiltersPanelVisible}
                            isFiltersPanelVisible={isFiltersPanelVisible}
                        />
                    </PanelContent>
                </PanelLayout>
            </div>
        </>
    );
}

type SearchPageContentProps = {
    projectType: string;
    selectedLoaderFilters: Set<string>;
    selectedCategoryFilters: Set<string>;
    searchResults: SearchResult[] | null | undefined;
    totalEstimatedHits: number;
    isLoadingInitialData: boolean;
    isFetchingData: boolean;
    setIsFiltersPanelVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isFiltersPanelVisible: boolean;
};

let searchQuerySyncTimeout: number | undefined;

const SearchPageContent = ({
    projectType,
    searchResults,
    totalEstimatedHits,
    isLoadingInitialData,
    isFetchingData,
    isFiltersPanelVisible,
    setIsFiltersPanelVisible,
}: SearchPageContentProps) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(searchParams.get(searchQueryKey) || "");
    const totalPages = Math.ceil(totalEstimatedHits / defaultSearchPageSize);

    const Pagination = (
        <PaginatedNavigation
            activePage={Number.parseInt(searchParams.get(pageOffsetParamKey) || "1") || 1}
            pagesCount={totalPages}
            searchParamKey={pageOffsetParamKey}
        />
    );

    useEffect(() => {
        const handleSearchInputFocus = (e: KeyboardEvent) => {
            if (e.shiftKey || e.altKey) return;

            if (e.key === "/" || (e.ctrlKey && e.key === "k")) {
                if (e.key !== "/") e.preventDefault();
                // @ts-ignore
                if (e.target?.closest("#searchpage-query-input")) return;
                e.preventDefault();

                const input = document.querySelector("#searchpage-query-input") as Element;
                // @ts-ignore
                input.focus();
            }
        };

        document.addEventListener("keydown", handleSearchInputFocus);
        return () => {
            document.removeEventListener("keydown", handleSearchInputFocus);
        };
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (searchQuerySyncTimeout) clearTimeout(searchQuerySyncTimeout);

        searchQuerySyncTimeout = window.setTimeout(() => {
            const urlPathname = updateSearchParam(searchQueryKey, searchQuery, {
                deleteParamOnFalsyValue: true,
                newParamsAdditionMode: "replace",
                deleteParamIfNewValueMatchesOldOne: false,
                customUrlModifierFunc: deletePageOffsetParam,
            });
            navigate(urlPathname);
        }, 100);

        return () => {
            if (searchQuerySyncTimeout) clearTimeout(searchQuerySyncTimeout);
        };
    }, [searchQuery]);

    return (
        <div className="w-full flex items-start justify-start flex-col gap-card-gap">
            <ContentWrapperCard>
                <div className="w-full flex items-start justify-start gap-x-3 gap-y-2 flex-wrap md:flex-nowrap">
                    <div className="flex items-start justify-center gap-x-3 gap-y-2 w-full md:w-fit grow">
                        <Button
                            variant={"secondary"}
                            className={cn(
                                "flex lg:hidden h-10 py-4 text-foreground-muted",
                                isFiltersPanelVisible &&
                                    "bg-accent-bg/15 no_neumorphic_shadow accent_surround_shadow hover:bg-accent-bg/10",
                            )}
                            style={{
                                // @ts-ignore
                                "--surround-width": "0.1rem",
                            }}
                            onClick={() => {
                                setIsFiltersPanelVisible((prev) => !prev);
                            }}
                        >
                            <FunnelIcon size="1.1rem" />
                            <span className="text-base">Filters...</span>
                        </Button>

                        <div className="w-full flex items-center justify-center relative">
                            <Label
                                className="h-full flex items-center justify-start px-3 cursor-text absolute left-0"
                                htmlFor="searchpage-query-input"
                            >
                                <MagnifyingGlassIcon className="w-5 h-5 text-foreground/50" />
                            </Label>
                            <Input
                                id="searchpage-query-input"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                }}
                                placeholder={`Search ${CapitalizeAndFormatString(projectType)?.toLowerCase()}s...`}
                                className="pl-10 text-lg"
                            />
                        </div>
                    </div>

                    <Select
                        value={searchParams.get("sortBy") || defaultSortType}
                        onValueChange={(val) => {
                            const urlPathname = updateSearchParam("sortBy", val, {
                                deleteParamIfValueMatches: defaultSortType,
                                newParamsAdditionMode: "replace",
                                deleteParamIfNewValueMatchesOldOne: false,
                                customUrlModifierFunc: deletePageOffsetParam,
                            });
                            navigate(urlPathname);
                        }}
                    >
                        <SelectTrigger className="w-48 lg:w-64 dark:text-foreground-muted">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-foreground font-bold">Sort by</SelectLabel>
                                {[
                                    SearchResultSortTypes.RELEVANCE,
                                    SearchResultSortTypes.DOWNLOADS,
                                    SearchResultSortTypes.FOLLOW_COUNT,
                                    SearchResultSortTypes.RECENTLY_UPDATED,
                                    SearchResultSortTypes.RECENTLY_PUBLISHED,
                                ].map((option) => {
                                    return (
                                        <SelectItem key={option} value={option}>
                                            {CapitalizeAndFormatString(option)}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </ContentWrapperCard>

            <div className="w-full relative flex flex-col items-start justify-start gap-card-gap pb-20">
                {totalPages > 1 && Pagination}

                <>
                    {!!searchResults?.length &&
                        searchResults.map((project) => {
                            const projectTags = Array.from(
                                GetProjectTagsFromNames(project.featured_tags, ...[project?.type || []]),
                            );

                            const projectLoaders = Array.from(
                                GetProjectLoadersDataFromName(...[project?.loaders || []]) || [],
                            );

                            return (
                                <ContentWrapperCard
                                    key={project.id}
                                    className="searchItemWrapperGrid grid gap-x-3 gap-y-2 rounded-xl"
                                >
                                    <Link
                                        to={`/${createURLSafeSlug(project.type[0]).value}/${project.url_slug}`}
                                        className="flex relative items-center justify-center bg-background-shallow dark:bg-background-shallower/55 rounded-2xl size-24 mr-1 overflow-hidden"
                                        style={{
                                            gridArea: "icon",
                                        }}
                                        tabIndex={-1}
                                    >
                                        {project.icon ? (
                                            <img
                                                src={`${project.icon.startsWith("http") ? "" : window.location.origin}${project.icon}`}
                                                alt={project.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <CubeIcon className="w-[60%] h-[60%] text-foreground/65" />
                                        )}
                                    </Link>

                                    <div
                                        className="flex flex-wrap gap-2 items-baseline justify-start"
                                        style={{ gridArea: "title" }}
                                    >
                                        <Link to={`/${createURLSafeSlug(project.type[0]).value}/${project.url_slug}`}>
                                            <h2 className="text-2xl font-semibold leading-none break-words sm:text-wrap">
                                                {project.name}
                                            </h2>
                                        </Link>
                                        <p className="text-foreground-muted leading-none">
                                            <span>by</span>
                                            <Link to={`/user/${project.author}`} className="underline px-1">
                                                {project.author}
                                            </Link>
                                        </p>
                                    </div>

                                    <p
                                        className="text-base text-foreground-muted leading-tight sm:text-pretty max-w-[80ch]"
                                        style={{ gridArea: "summary" }}
                                    >
                                        {project.summary}
                                    </p>

                                    <div
                                        className="w-full flex items-center justify-start gap-x-4 gap-y-0 flex-wrap"
                                        style={{
                                            gridArea: "tags",
                                        }}
                                    >
                                        {[...projectTags].map((tag) => {
                                            if (tag.header === TagHeaderTypes.RESOLUTION) return null;

                                            return (
                                                <span
                                                    className="flex gap-1 items-center justify-center font-[400] text-foreground-extra-muted"
                                                    key={tag.name}
                                                >
                                                    <CategoryIconWrapper name={tag.icon} />
                                                    {CapitalizeAndFormatString(tag.name)}
                                                </span>
                                            );
                                        })}
                                        {[...projectLoaders].map((loader) => {
                                            if (["RESOURCE_PACK", "DATAPACK"].includes(loader.name)) return null;

                                            return (
                                                <span
                                                    className="flex gap-1 items-center justify-center font-[400] text-foreground-extra-muted"
                                                    key={loader.name}
                                                >
                                                    <CategoryIconWrapper name={loader.icon} />
                                                    {CapitalizeAndFormatString(loader.name)}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    <div
                                        className="xl:ml-4"
                                        style={{
                                            gridArea: "stats",
                                        }}
                                    >
                                        <div className="flex flex-col items-end justify-start gap-x-2 gap-y-1 dark:text-foreground-muted">
                                            {/* <p>
                                                <em className="not-italic font-semibold text-xl dark:text-foreground-muted">
                                                    {project.total_downloads}
                                                </em>
                                            </p> */}

                                            {searchParams.get("sortBy") === SearchResultSortTypes.RECENTLY_PUBLISHED ? (
                                                <TooltipWrapper
                                                    text={formatDate(new Date(project?.created_on), timestamp_template)}
                                                    asChild={true}
                                                >
                                                    <Button
                                                        variant={"link"}
                                                        className="flex items-center justify-center gap-1.5 no-underline decoration-transparent h-fit w-fit p-0"
                                                        tabIndex={-1}
                                                    >
                                                        <CalendarIcon className="w-4 h-4 block" />

                                                        <span className="leading-none text-sm sm:text-base">
                                                            Created{" "}
                                                            {timeSince(
                                                                new Date(project?.created_on),
                                                                time_past_phrases,
                                                            )}
                                                        </span>
                                                    </Button>
                                                </TooltipWrapper>
                                            ) : (
                                                <TooltipWrapper
                                                    text={formatDate(new Date(project?.updated_on), timestamp_template)}
                                                    asChild={true}
                                                >
                                                    <Button
                                                        variant={"link"}
                                                        className="flex items-center justify-center gap-1.5 no-underline decoration-transparent h-fit w-fit p-0"
                                                        tabIndex={-1}
                                                    >
                                                        <UpdateIcon className="w-4 h-4 block" />

                                                        <span className="leading-none text-sm sm:text-base">
                                                            Updated{" "}
                                                            {timeSince(
                                                                new Date(project?.updated_on),
                                                                time_past_phrases,
                                                            )}
                                                        </span>
                                                    </Button>
                                                </TooltipWrapper>
                                            )}
                                        </div>
                                    </div>
                                </ContentWrapperCard>
                            );
                        })}
                </>

                {isLoadingInitialData || (!searchResults?.length && isFetchingData) ? (
                    <AbsolutePositionedSpinner
                        className="h-full"
                        backdropBgClassName="opacity-0"
                        spinnerWrapperClassName="backdrop-blur-none"
                    />
                ) : null}

                {!searchResults?.length && !isFetchingData && (
                    <div className="w-full flex items-center justify-center py-12">
                        <h3 className="text-xl text-foreground-muted">No results found!</h3>
                    </div>
                )}

                {totalPages > 1 && Pagination}
            </div>
        </div>
    );
};
