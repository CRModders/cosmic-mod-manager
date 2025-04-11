import type { ProjectType, SearchResultSortMethod } from "@app/utils/types";
import type { SearchResult } from "@app/utils/types/api";
import { createContext, use, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router";
import {
    defaultSearchLimit,
    pageOffsetParamNamespace,
    searchLimitParamNamespace,
    searchQueryParamNamespace,
    sortByParamNamespace,
} from "@app/utils/config/search";
import { useNavigate } from "~/components/ui/link";
import { useProjectType } from "~/hooks/project";
import { getProjectTypeFromName } from "@app/utils/convertors";
import { getSearchResults } from "./loader";
import { isNumber } from "@app/utils/number";
import { useSpinnerCtx } from "~/components/global-spinner";

interface SearchContext {
    searchTerm: string | undefined;
    setSearchTerm: (searchTerm: string) => void;

    params: URLSearchParams;
    projectType: ProjectType | "project";
    projectType_Coerced: ProjectType;
    sortBy: SearchResultSortMethod | undefined;

    projectsPerPage: number;
    pageOffset: number;
    pagesCount: number;

    isLoading: boolean;
    isFetching: boolean;
    result: SearchResult;
}

const SearchContext = createContext<SearchContext>(null as unknown as SearchContext);

interface SearchProviderProps {
    children: React.ReactNode;
    initialSearchResult: SearchResult | null;
}

let updateSearchParam_timeoutRef: number | undefined;

export function SearchProvider(props: SearchProviderProps) {
    const { setShowSpinner } = useSpinnerCtx();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Params
    const searchQueryParam = searchParams.get(searchQueryParamNamespace) || "";
    const [searchTerm_state, setSearchTerm_state] = useState(searchQueryParam);
    const pageSize = searchParams.get(searchLimitParamNamespace);
    const sortBy = searchParams.get(sortByParamNamespace);

    const navigate = useNavigate(undefined, { viewTransition: false });
    const projectType = useProjectType();
    const projectType_Coerced = getProjectTypeFromName(projectType);

    const [query, setQuery] = useState({
        isLoading: false,
        isFetching: false,
        data: props.initialSearchResult,
    });

    async function fetchQuery() {
        setQuery({
            isLoading: !!query.data,
            isFetching: true,
            data: query.data || null,
        });

        const res = await getSearchResults(searchParams.toString(), projectType_Coerced === projectType ? projectType_Coerced : undefined);
        setQuery({ isLoading: false, isFetching: false, data: res });
    }

    const searchResults = query.data;
    const projectsPerPage = Number.parseInt(pageSize || "0") || defaultSearchLimit;

    const pagesCount = Math.ceil((searchResults?.estimatedTotalHits || 0) / projectsPerPage);
    const pageOffsetParamValue = searchParams.get(pageOffsetParamNamespace);
    let activePage = pageOffsetParamValue ? Number.parseInt(pageOffsetParamValue || "1") : 1;
    if (!isNumber(activePage)) activePage = 1;

    useEffect(() => {
        fetchQuery();
    }, [searchParams.toString()]);

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
        }, 250);
    }, [searchTerm_state]);

    // Update the state when the search param changes
    useEffect(() => {
        setSearchTerm_state(searchQueryParam);
    }, [location.pathname]);

    // Handle showing and hiding loading spinner
    useEffect(() => {
        setShowSpinner(query.isFetching);
    }, [query.isFetching]);

    return (
        <SearchContext
            value={{
                searchTerm: searchTerm_state,
                setSearchTerm: setSearchTerm_state,
                params: searchParams,
                projectType: projectType,
                projectType_Coerced: projectType_Coerced,
                sortBy: sortBy as SearchResultSortMethod,
                projectsPerPage: projectsPerPage,
                pageOffset: activePage,
                pagesCount: pagesCount,
                isLoading: query.isLoading,
                isFetching: query.isFetching,
                result: searchResults || ({} as SearchResult),
            }}
        >
            {props.children}
        </SearchContext>
    );
}

export function useSearchContext() {
    return use(SearchContext);
}

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
