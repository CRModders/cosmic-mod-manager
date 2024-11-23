import { ViewType } from "@/components/layout/search-list-item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, TooltipTemplate } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SITE_NAME_LONG, SITE_NAME_SHORT } from "@shared/config";
import { defaultSortBy, pageOffsetParamNamespace, searchQueryParamNamespace, sortByParamNamespace } from "@shared/config/search";
import { Capitalize, CapitalizeAndFormatString } from "@shared/lib/utils";
import { ProjectType, SearchResultSortMethod } from "@shared/types";
import { FilterIcon, ImageIcon, LayoutListIcon, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SearchResults } from "./page";
import FilterSidebar from "./sidebar";
import "./styles.css";

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

export const updateSearchParam = ({
    key,
    value,
    deleteIfMatches,
    deleteIfFalsyValue,
    deleteIfExists,
    deleteParamsWithMatchingValueOnly = false,
    newParamsInsertionMode = "append",
    customURLModifier,
}: UpdateSearchParamProps) => {
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
};

export const deletePageOffsetParam = (url: URL) => {
    url.searchParams.delete(pageOffsetParamNamespace);
    return url;
};

interface Props {
    type: ProjectType;
}

const SearchPageLayout = ({ type }: Props) => {
    const searchInput = useRef<HTMLInputElement>(null);
    const [searchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    const viewType = getSearchDisplayPreference(type);
    const [_, reRender] = useState("0");

    // Param values
    const searchQuery = searchParams.get(searchQueryParamNamespace) || "";
    const sortBy = searchParams.get(sortByParamNamespace);

    // Search box focus
    const handleSearchInputFocus = (e: KeyboardEvent) => {
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        if (e.key === "/") {
            e.stopPropagation();
            if (searchInput.current) searchInput.current.focus();
        }
    };

    useEffect(() => {
        if (searchInput.current) searchInput.current.focus();
    }, [type]);

    useEffect(() => {
        document.addEventListener("keyup", handleSearchInputFocus);

        return () => {
            document.removeEventListener("keyup", handleSearchInputFocus);
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>
                    Search {type}s | {SITE_NAME_LONG}
                </title>
                <meta
                    name="description"
                    content={`Search and download your favorite cosmic reach ${type}s with ease here on ${SITE_NAME_SHORT} (${SITE_NAME_LONG}).`}
                />
            </Helmet>

            <div className="search-page-grid-layout w-full grid gap-panel-cards pb-16">
                <Card className="h-fit p-card-surround flex flex-wrap items-center justify-start gap-2" style={{ gridArea: "header" }}>
                    <label htmlFor="search-input" className="grow relative flex items-center justify-center min-w-full sm:min-w-[32ch]">
                        <SearchIcon
                            aria-label="Search Icon"
                            className="w-btn-icon-md h-btn-icon-md text-extra-muted-foreground absolute left-2.5 top-[50%] translate-y-[-50%]"
                        />
                        <Input
                            autoFocus
                            ref={searchInput}
                            value={searchQuery}
                            onChange={(e) => {
                                const val = e.target.value;
                                const urlPathname = updateSearchParam({
                                    key: searchQueryParamNamespace,
                                    value: val,
                                    deleteIfFalsyValue: true,
                                    newParamsInsertionMode: "replace",
                                    customURLModifier: deletePageOffsetParam,
                                });
                                navigate(urlPathname);
                            }}
                            placeholder={`Search ${type}s...`}
                            className="text-lg font-semibold !pl-9 focus:[&>kbd]:invisible"
                            id="search-input"
                            aria-label={`Search ${type}s`}
                        />

                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 bg-card-background px-1 rounded-[0.2rem] font-mono">
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
                            navigate(urlPathname);
                        }}
                        name="sort-by"
                    >
                        <SelectTrigger className="w-48 lg:min-w-58 dark:text-foreground-muted" aria-label="sort-by">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-foreground font-bold">Sort by</SelectLabel>
                                {[
                                    SearchResultSortMethod.RELEVANCE,
                                    SearchResultSortMethod.DOWNLOADS,
                                    SearchResultSortMethod.FOLLOW_COUNT,
                                    SearchResultSortMethod.RECENTLY_UPDATED,
                                    SearchResultSortMethod.RECENTLY_PUBLISHED,
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

                    <Button
                        className={cn("flex lg:hidden", showFilters && "!ring-[0.13rem] ring-accent-background/75")}
                        variant="secondary"
                        onClick={() => setShowFilters((prev) => !prev)}
                    >
                        <FilterIcon className="w-btn-icon h-btn-icon" />
                        Filters...
                    </Button>

                    <ViewTypeToggle projectType={type} viewType={viewType} reRender={reRender} />
                </Card>

                <FilterSidebar type={type} showFilters={showFilters} searchParams={searchParams} />

                <section
                    id="main"
                    aria-label="Search Results"
                    className="h-fit flex flex-col gap-panel-cards"
                    style={{ gridArea: "content" }}
                >
                    <SearchResults type={type} viewType={viewType} searchParams={searchParams} />
                </section>
            </div>
        </>
    );
};

export const Component = SearchPageLayout;

const ViewTypeToggle = ({
    projectType,
    viewType,
    reRender,
}: { projectType: ProjectType; viewType: ViewType; reRender: (str: string) => void }) => {
    const toggleViewType = () => {
        let newDisplayType = viewType;
        if (viewType === ViewType.LIST) {
            newDisplayType = ViewType.GALLERY;
        } else if (viewType === ViewType.GALLERY) {
            newDisplayType = ViewType.LIST;
        }

        reRender(Math.random().toString());
        saveSearchDisplayPreference(projectType, newDisplayType);
    };

    return (
        <TooltipProvider>
            <TooltipTemplate content={`${Capitalize(viewType)} view`}>
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleViewType}
                    aria-label="Toggle View Type"
                    className="h-nav-item w-nav-item"
                >
                    {viewType === ViewType.GALLERY ? (
                        <ImageIcon className="w-btn-icon-md h-btn-icon-md" />
                    ) : (
                        <LayoutListIcon className="w-btn-icon-md h-btn-icon-md" />
                    )}
                </Button>
            </TooltipTemplate>
        </TooltipProvider>
    );
};

const defaultSearchDisplays = {
    [ProjectType.MOD]: ViewType.LIST,
    [ProjectType.DATAMOD]: ViewType.LIST,
    [ProjectType.RESOURCE_PACK]: ViewType.GALLERY,
    [ProjectType.SHADER]: ViewType.GALLERY,
    [ProjectType.MODPACK]: ViewType.LIST,
    [ProjectType.PLUGIN]: ViewType.LIST,
};
const searchDisplayPrefsNamespace = "searchDisplayPrefs";

const saveSearchDisplayPreference = (projectType: ProjectType, viewType: ViewType) => {
    let prefs = defaultSearchDisplays;

    try {
        const savedPrefs = localStorage.getItem(searchDisplayPrefsNamespace);
        if (savedPrefs) prefs = { ...prefs, ...JSON.parse(savedPrefs) };
    } catch (error) {
        prefs = defaultSearchDisplays;
    }

    prefs[projectType] = viewType;

    localStorage.setItem(searchDisplayPrefsNamespace, JSON.stringify(prefs));
};

const getSearchDisplayPreference = (projectType: ProjectType) => {
    let prefs = defaultSearchDisplays;

    try {
        const savedPrefs = localStorage.getItem(searchDisplayPrefsNamespace);
        if (savedPrefs) prefs = { ...prefs, ...JSON.parse(savedPrefs) };
    } catch (error) {
        prefs = defaultSearchDisplays;
    }

    return prefs[projectType];
};
