import { SearchResultSortMethod } from "../types";

// Defaults
export const defaultSearchLimit = 20;
export const MAX_SEARCH_LIMIT = 100;
export const defaultSortBy = SearchResultSortMethod.RELEVANCE;

// Namespaces
export const searchQueryParamNamespace = "q";
export const sortByParamNamespace = "sortby";
export const pageOffsetParamNamespace = "page";
export const searchLimitParamNamespace = "limit";
export const loaderFilterParamNamespace = "l";
export const gameVersionFilterParamNamespace = "v";
export const environmentFilterParamNamespace = "e";
export const categoryFilterParamNamespace = "c";
export const licenseFilterParamNamespace = "li";
