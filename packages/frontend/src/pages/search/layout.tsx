import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { defaultSortBy, pageOffsetParamNamespace, searchQueryParamNamespace, sortByParamNamespace } from "@shared/config/search";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { type ProjectType, SearchResultSortMethod } from "@shared/types";
import { FilterIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchResults from "./page";
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
    const [searchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    // Param values
    const searchQuery = searchParams.get(searchQueryParamNamespace) || "";
    const sortBy = searchParams.get(sortByParamNamespace);

    return (
        <div className="search-page-grid-layout w-full grid gap-panel-cards">
            <Card
                className="h-fit p-card-surround flex flex-wrap items-center justify-start gap-x-3 gap-y-2"
                style={{ gridArea: "header" }}
            >
                <Button
                    className={cn("flex lg:hidden", showFilters && "!ring-[0.13rem] ring-accent-background/75")}
                    variant="secondary"
                    onClick={() => setShowFilters((prev) => !prev)}
                >
                    <FilterIcon className="w-btn-icon h-btn-icon" />
                    Filters...
                </Button>

                <label htmlFor="search-input" className="grow relative flex items-center justify-center min-w-full sm:min-w-[32ch]">
                    <SearchIcon className="w-btn-icon-md h-btn-icon-md text-extra-muted-foreground absolute left-2.5 top-[50%] translate-y-[-50%]" />
                    <Input
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
                        className="text-lg font-semibold !pl-9"
                        id="search-input"
                    />
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
                >
                    <SelectTrigger className="w-48 lg:min-w-58 dark:text-foreground-muted">
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
            </Card>

            <FilterSidebar type={type} showFilters={showFilters} searchParams={searchParams} />

            <div className="h-fit flex flex-col gap-panel-cards" style={{ gridArea: "content" }}>
                <SearchResults type={type} searchParams={searchParams} />
            </div>
        </div>
    );
};

export default SearchPageLayout;