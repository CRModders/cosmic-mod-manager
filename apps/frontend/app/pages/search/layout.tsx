import { ViewType } from "@app/components/misc/search-list-item";
import { Button } from "@app/components/ui/button";
import { Card } from "@app/components/ui/card";
import { Input } from "@app/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { TooltipProvider, TooltipTemplate } from "@app/components/ui/tooltip";
import { cn } from "@app/components/utils";
import { projectTypes } from "@app/utils/config/project";
import {
    MAX_SEARCH_LIMIT,
    defaultSearchLimit,
    defaultSortBy,
    pageOffsetParamNamespace,
    searchLimitParamNamespace,
    searchQueryParamNamespace,
    sortByParamNamespace,
} from "@app/utils/config/search";
import { getProjectTypeFromName } from "@app/utils/convertors";
import { type ProjectType, SearchResultSortMethod } from "@app/utils/types";
import type { SearchResult } from "@app/utils/types/api";
import { FilterIcon, ImageIcon, LayoutListIcon, SearchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigation, useSearchParams } from "react-router";
import { useSpinnerCtx } from "~/components/global-spinner";
import { useNavigate } from "~/components/ui/link";
import { useProjectType } from "~/hooks/project";
import { type UserConfig, setUserConfig, useUserConfig } from "~/hooks/user-config";
import { useTranslation } from "~/locales/provider";
import FilterSidebar from "./sidebar";

interface UpdateSearchParamProps {
    key: string;
    value: string;
    newParamsInsertionMode?: "replace" | "append";
    deleteIfMatches?: string;
    deleteIfExists?: boolean;
    deleteIfFalsyValue?: boolean;
    deleteParamsWithMatchingValueOnly?: boolean;
    customURLModifier?: (url: URL) => URL;
}

let updateSearchParam_timeoutRef: number | undefined;

export default function SearchPageLayout(props: { initialSearchData: SearchResult | null }) {
    const { t } = useTranslation();
    const searchInput = useRef<HTMLInputElement>(null);
    const [showFilters, setShowFilters] = useState(false);

    const nextLocation = useNavigation().location;
    const nextSearchParams = new URLSearchParams(nextLocation?.search);
    const [currSearchParams] = useSearchParams();
    const searchParams = nextLocation?.search ? nextSearchParams : currSearchParams;

    // Param values
    const searchQueryParam = searchParams.get(searchQueryParamNamespace) || "";
    const sortBy = searchParams.get(sortByParamNamespace);
    const showPerPage = searchParams.get(searchLimitParamNamespace);
    const [searchTerm_state, setSearchTerm_state] = useState(searchQueryParam);

    const navigate = useNavigate(undefined, { viewTransition: false });
    const projectType = useProjectType();
    const projectType_Coerced = getProjectTypeFromName(projectType);

    const viewType = getSearchDisplayPreference(projectType_Coerced);
    const [_, reRender] = useState("0");

    // Search box focus
    function handleSearchInputFocus(e: KeyboardEvent) {
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        if (e.key === "/") {
            e.stopPropagation();
            if (searchInput.current) searchInput.current.focus();
        }
    }

    useEffect(() => {
        if (searchQueryParam === searchTerm_state) return;
        if (updateSearchParam_timeoutRef) window.clearTimeout(updateSearchParam_timeoutRef);

        updateSearchParam_timeoutRef = window.setTimeout(() => {
            const urlPathname = updateSearchParam({
                key: searchQueryParamNamespace,
                value: searchTerm_state,
                deleteIfFalsyValue: true,
                newParamsInsertionMode: "replace",
                customURLModifier: deletePageOffsetParam,
            });
            navigate(urlPathname, { viewTransition: false });
        }, 200);
    }, [searchTerm_state]);

    // Update the state when the search param changes
    useEffect(() => {
        setSearchTerm_state(searchQueryParam);
    }, [nextLocation?.pathname]);

    useEffect(() => {
        document.addEventListener("keyup", handleSearchInputFocus);
        return () => document.removeEventListener("keyup", handleSearchInputFocus);
    }, []);

    const searchLabel = t.search[projectType];

    return (
        <div className="search-page-grid-layout w-full grid gap-panel-cards pb-16">
            {useMemo(() => {
                return (
                    <FilterSidebar
                        type={projectType_Coerced === projectType ? [projectType_Coerced] : projectTypes}
                        showFilters={showFilters}
                        searchParams={searchParams}
                    />
                );
            }, [projectType_Coerced, showFilters, searchParams.toString()])}

            <main id="main" style={{ gridArea: "content" }} className="h-fit grid grid-cols-1 gap-panel-cards">
                <Card className="h-fit p-card-surround flex flex-wrap items-center justify-start gap-2">
                    <label htmlFor="search-input" className="grow relative flex items-center justify-center min-w-full sm:min-w-[32ch]">
                        <SearchBarIcon />
                        <Input
                            ref={searchInput}
                            value={searchTerm_state}
                            onChange={(e) => setSearchTerm_state(e.target.value || "")}
                            placeholder={`${searchLabel}...`}
                            className="text-md font-medium !ps-9 focus:[&>kbd]:invisible"
                            id="search-input"
                            aria-label={searchLabel}
                        />

                        <kbd className="absolute end-3 top-1/2 -translate-y-1/2 px-1 rounded-[0.3rem] bg-shallower-background/50 border border-shallower-background/85">
                            /
                        </kbd>
                    </label>

                    <Select
                        value={sortBy || defaultSortBy}
                        onValueChange={(val) => {
                            const urlPathname = updateSearchParam({
                                key: sortByParamNamespace,
                                value: val,
                                deleteIfMatches: defaultSortBy,
                                newParamsInsertionMode: "replace",
                                customURLModifier: deletePageOffsetParam,
                            });
                            navigate(urlPathname, { viewTransition: false });
                        }}
                        name="sort-by"
                    >
                        <SelectTrigger className="w-48 lg:min-w-58 dark:text-foreground-muted" title={t.search.sortBy}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-foreground font-bold">{t.search.sortBy}</SelectLabel>
                                {[
                                    SearchResultSortMethod.RELEVANCE,
                                    SearchResultSortMethod.DOWNLOADS,
                                    SearchResultSortMethod.FOLLOW_COUNT,
                                    SearchResultSortMethod.RECENTLY_UPDATED,
                                    SearchResultSortMethod.RECENTLY_PUBLISHED,
                                ].map((option) => {
                                    return (
                                        <SelectItem key={option} value={option}>
                                            {t.search[option]}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        value={showPerPage || defaultSearchLimit.toString()}
                        onValueChange={(val) => {
                            const urlPathname = updateSearchParam({
                                key: searchLimitParamNamespace,
                                value: val,
                                deleteIfMatches: `${defaultSearchLimit}`,
                                newParamsInsertionMode: "replace",
                                customURLModifier: deletePageOffsetParam,
                            });
                            navigate(urlPathname, { viewTransition: false });
                        }}
                        name="Show per page"
                    >
                        <SelectTrigger className="w-fit dark:text-foreground-muted" title={t.search.showPerPage}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-foreground font-bold">{t.search.showPerPage}</SelectLabel>
                                {[10, defaultSearchLimit, 50, MAX_SEARCH_LIMIT].map((option) => {
                                    const optionStr = option.toString();
                                    return (
                                        <SelectItem key={option} value={optionStr}>
                                            {optionStr}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Button
                        className={cn("flex lg:hidden", showFilters && "!ring-[0.13rem] ring-accent-background/75")}
                        variant="secondary"
                        onClick={() => setShowFilters((prev) => !prev)}
                    >
                        <FilterIcon aria-hidden className="w-btn-icon h-btn-icon" />
                        {t.search.filters}
                    </Button>

                    <ViewTypeToggle projectType={projectType_Coerced} viewType={viewType} reRender={reRender} />
                </Card>

                <Outlet
                    context={
                        {
                            projectType_Coerced,
                            projectType,
                            viewType,
                            searchParams,
                            initialSearchData: props.initialSearchData,
                        } satisfies SearchOutlet
                    }
                />
            </main>
        </div>
    );
}

function SearchBarIcon() {
    const { showSpinner } = useSpinnerCtx();

    return (
        <span className="absolute start-2.5 top-[50%] translate-y-[-50%] grid grid-cols-1 grid-rows-1">
            <Spinner className={cn("col-span-full row-span-full opacity-0", showSpinner && "opacity-100")} />
            <SearchIcon
                aria-hidden
                className={cn(
                    "w-btn-icon-md h-btn-icon-md text-extra-muted-foreground col-span-full row-span-full opacity-100 transition-opacity duration-500",
                    showSpinner && "opacity-0",
                )}
            />
        </span>
    );
}

function Spinner({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "w-[1.17rem] h-[1.17rem] border-[0.17rem] rounded-full border-accent-background border-t-transparent transition-opacity animate-spin duration-500",
                className,
            )}
        />
    );
}

export interface SearchOutlet {
    projectType_Coerced: ProjectType;
    projectType: string;
    viewType: ViewType;
    searchParams: URLSearchParams;
    initialSearchData: SearchResult | null;
}

function ViewTypeToggle({
    projectType,
    viewType,
    reRender,
}: { projectType: ProjectType; viewType: ViewType; reRender: (str: string) => void }) {
    const userConfig = useUserConfig();
    const { t } = useTranslation();

    function toggleViewType() {
        let newDisplayType = viewType;
        if (viewType === ViewType.LIST) {
            newDisplayType = ViewType.GALLERY;
        } else if (viewType === ViewType.GALLERY) {
            newDisplayType = ViewType.LIST;
        }

        reRender(Math.random().toString());
        saveSearchDisplayPreference(projectType, newDisplayType, userConfig);
    }

    return (
        <TooltipProvider>
            <TooltipTemplate content={t.search.view[viewType]}>
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleViewType}
                    aria-label="Toggle View Type"
                    className="h-nav-item w-nav-item"
                >
                    {viewType === ViewType.GALLERY ? (
                        <ImageIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    ) : (
                        <LayoutListIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    )}
                </Button>
            </TooltipTemplate>
        </TooltipProvider>
    );
}

function saveSearchDisplayPreference(projectType: ProjectType, viewType: ViewType, userConfig: UserConfig) {
    userConfig.viewPrefs[projectType] = viewType;
    setUserConfig(userConfig);
}

function getSearchDisplayPreference(projectType: ProjectType) {
    return useUserConfig().viewPrefs[projectType];
}

export function updateSearchParam({
    key,
    value,
    deleteIfMatches,
    deleteIfFalsyValue,
    deleteIfExists,
    deleteParamsWithMatchingValueOnly = false,
    newParamsInsertionMode = "append",
    customURLModifier,
}: UpdateSearchParamProps) {
    let currUrl = new URL(window.location.href);

    if (deleteIfExists === true && currUrl.searchParams.has(key, value)) {
        if (deleteParamsWithMatchingValueOnly === true) currUrl.searchParams.delete(key, value);
        else currUrl.searchParams.delete(key);
    } else if ((deleteIfFalsyValue === true && !value) || (deleteIfMatches !== undefined && deleteIfMatches === value)) {
        if (deleteParamsWithMatchingValueOnly === true) currUrl.searchParams.delete(key, value);
        else currUrl.searchParams.delete(key);
    } else {
        if (newParamsInsertionMode === "replace") currUrl.searchParams.set(key, value);
        else currUrl.searchParams.append(key, value);
    }

    if (customURLModifier) currUrl = customURLModifier(currUrl);

    return currUrl.href.replace(window.location.origin, "");
}

export function deletePageOffsetParam(url: URL) {
    url.searchParams.delete(pageOffsetParamNamespace);
    return url;
}
