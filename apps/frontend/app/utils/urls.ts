import { append, prepend, removeLeading, removeTrailing } from "@app/utils/string";
import { useLocation } from "react-router";
import { parseLocale } from "~/locales";

export const HINT_LOCALE_KEY = "hl";

export { isCurrLinkActive } from "@app/utils/string";
export { append, prepend, removeLeading, removeTrailing };

export function getHintLocale(searchParams?: URLSearchParams) {
    const params = searchParams ? searchParams : getCurrLocation().searchParams;
    const hlParam = params.get(HINT_LOCALE_KEY);
    const localeCode = parseLocale(hlParam);

    if (localeCode === parseLocale(undefined) && !hlParam) return "";
    return localeCode;
}

export function getCurrLocation() {
    const loc = globalThis?.window ? window.location : useLocation();
    return new URL(`https://example.com${loc.pathname}${loc.search}${loc.hash}`);
}

// ? URL Formatters

/**
 * Constructs a URL path with an optional language prefix and additional path segment.
 *
 * @param _path - The main path segment of the URL.
 * @param extra - An optional additional path segment to append to the URL.
 * @param _hl - An optional language prefix to prepend to the URL.
 * @returns The constructed URL path as a string.
 */
export function FormatUrl_WithHintLocale(path: string, hl?: string) {
    if (path.startsWith("http") || path.startsWith("mailto:")) return path;

    const hintLocale = hl ? hl : getHintLocale();
    const searchParams = new URLSearchParams(path.split("?")[1] || `?${HINT_LOCALE_KEY}=${hintLocale}`);

    if (!hintLocale) searchParams.delete(HINT_LOCALE_KEY);
    else searchParams.set(HINT_LOCALE_KEY, hintLocale);

    return prepend("/", `${path.split("?")[0]}?${searchParams.toString()}`);
}

export function ProjectPagePath(type: string, projectSlug: string, extra?: string) {
    let path = `${type}/${projectSlug}`;
    if (extra) path += `/${extra}`;

    return FormatUrl_WithHintLocale(path);
}

export function VersionPagePath(type: string, projectSlug: string, versionSlug: string, extra?: string) {
    const projectPgPath = ProjectPagePath(type, projectSlug);

    let appendStr = `version/${versionSlug}`;
    if (extra) appendStr += `/${extra}`;

    return appendPathInUrl(projectPgPath, appendStr);
}

export function OrgPagePath(orgSlug: string, extra?: string) {
    let pathname = FormatUrl_WithHintLocale(`organization/${orgSlug}`);
    if (extra) pathname += `/${extra}`;
    return pathname;
}

export function UserProfilePath(username: string, extra?: string) {
    let pathname = FormatUrl_WithHintLocale(`user/${username}`);
    if (extra) pathname += `/${extra}`;
    return pathname;
}

export function CollectionPagePath(id: string, extra?: string) {
    let pathname = FormatUrl_WithHintLocale(`collection/${id}`);
    if (extra) pathname += `/${extra}`;
    return pathname;
}

export function appendPathInUrl(_url: string | URL, str: string) {
    let url: URL;
    if (typeof _url === "string") {
        if (_url.startsWith("/")) url = new URL(`https://example.com${_url}`);
        else if (_url.startsWith("http")) url = new URL(_url);
        else url = new URL(`https://example.com/${_url}`);
    } else {
        url = _url;
    }

    if (url.pathname.endsWith("/") || str.startsWith("/")) url.pathname = `${url.pathname}${str}`;
    else url.pathname = `${url.pathname}/${str}`;

    return url.href.replace(url.origin, "");
}
