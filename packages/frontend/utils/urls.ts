import { useLocation } from "react-router";

export function isCurrLinkActive(targetUrl: string, currUrl: string, exactEnds = true) {
    if (exactEnds === true) {
        return currUrl === targetUrl || currUrl === `${targetUrl}/`;
    }
    return currUrl.includes(targetUrl);
}

// A lang code will either be empty, a 2-letter code or a 2-letter code followed by specific region code
const langRegex = /^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/;

export function useUrlLocale(trimLeadingSlash = true, customPathname?: string) {
    const pathname = customPathname ? customPathname : usePathname();

    const match = pathname.match(langRegex);
    const locale = match ? match[0] : "";

    if (trimLeadingSlash) return removeLeading("/", locale);
    return locale;
}

export function usePathname() {
    // Can't use hooks outside of components, so we need to check if we're in a browser environments
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
 * @returns The constructed URL path as a string.
 */
export function PageUrl(_path: string, extra?: string) {
    if (_path.startsWith("http") || _path.startsWith("mailto:")) return _path;

    const langPrefix = useUrlLocale(false);
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

export function prepend(str: string, path: string) {
    return path.startsWith(str) ? path : `${str}${path}`;
}

export function append(str: string, path: string) {
    return path.endsWith(str) ? path : `${path}${str}`;
}

export function removeLeading(str: string, path: string) {
    if (!path.startsWith(str)) return path;

    return removeLeading(str, path.slice(str.length));
}

export function removeTrailing(str: string, path: string) {
    if (!path.endsWith(str)) return path;

    return removeTrailing(str, path.slice(0, -1 * str.length));
}
