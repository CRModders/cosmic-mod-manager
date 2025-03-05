import { append, prepend, removeLeading, removeTrailing } from "@app/utils/string";
import { useLocation } from "react-router";
import { formatLocaleCode, parseLocale } from "~/locales";
import SupportedLocales, { DefaultLocale } from "~/locales/meta";

export { isCurrLinkActive } from "@app/utils/string";
export { append, prepend, removeLeading, removeTrailing };

// The url lang prefix can be any of the supported locales which follows a / after it or it's the end of the string
// eg: /en/search, /en
const langCodes = SupportedLocales.map((l) => formatLocaleCode(l));
const langRegex = new RegExp(`^\\/(${langCodes.join("|")})(?=\\/|$)`);

export function useUrlLocale(trimLeadingSlash = true, customPathname?: string) {
    const pathname = customPathname ? customPathname : usePathname();

    const match = pathname.match(langRegex);
    const matchString = match ? match[0] : "";

    let urlPrefix = parseLocale(removeLeading("/", matchString));
    if (urlPrefix === DefaultLocale.code && !matchString.includes(DefaultLocale.code)) urlPrefix = "";

    if (trimLeadingSlash === true) return urlPrefix;
    return prepend("/", urlPrefix);
}

export function usePathname() {
    // Can't use hooks outside of components, so we need to check if we're in a browser environment
    if (globalThis.window) {
        return window.location.pathname;
    }

    // We can totally use the hook during server-side rendering
    return useLocation().pathname;
}

// ? URL Formatters

/**
 * Constructs a URL path with an optional language prefix and additional path segment.
 *
 * @param _path - The main path segment of the URL.
 * @param extra - An optional additional path segment to append to the URL.
 * @param prefix - An optional language prefix to prepend to the URL.
 * @returns The constructed URL path as a string.
 */
export function PageUrl(_path: string, extra?: string, prefix?: string) {
    if (_path.startsWith("http") || _path.startsWith("mailto:")) return _path;

    const langPrefix = typeof prefix === "string" ? prefix : useUrlLocale(false);
    let p = _path === "/" ? "" : prepend("/", _path);

    // Make sure not to overwrite the language prefix if it already exists
    const match = p.match(langRegex);
    if (!match) p = prepend(langPrefix, p);

    if (extra) {
        p = removeTrailing("/", p);
        extra = removeLeading("/", extra);
        p += `/${extra}`;
    }

    return p;
}

export function ProjectPagePath(type: string, projectSlug: string, extra?: string) {
    let pathname = PageUrl(type, projectSlug);
    if (extra) pathname += `/${extra}`;
    return pathname;
}

export function VersionPagePath(type: string, projectSlug: string, versionSlug: string, extra?: string) {
    let pathname = `${ProjectPagePath(type, projectSlug)}/version/${versionSlug}`;
    if (extra) pathname += `/${extra}`;
    return pathname;
}

export function OrgPagePath(orgSlug: string, extra?: string) {
    let pathname = PageUrl("organization", orgSlug);
    if (extra) pathname += `/${extra}`;
    return pathname;
}

export function UserProfilePath(username: string, extra?: string) {
    let pathname = PageUrl("user", username);
    if (extra) pathname += `/${extra}`;
    return pathname;
}

export function CollectionPagePath(id: string, extra?: string) {
    let pathname = PageUrl("collection", id);
    if (extra) pathname += `/${extra}`;
    return pathname;
}
