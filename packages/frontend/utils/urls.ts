export function isCurrLinkActive(targetUrl: string, currUrl: string, exactEnds = true) {
    if (exactEnds === true) {
        return currUrl === targetUrl || currUrl === `${targetUrl}/`;
    }
    return currUrl.includes(targetUrl);
}

// ? URL Formatters

/**
 * Constructs a URL path with an optional language prefix and additional path segment.
 *
 * @param path - The main path segment of the URL.
 * @param extra - An optional additional path segment to append to the URL.
 * @returns The constructed URL path as a string.
 */
export function PageUrl(path: string, extra?: string) {
    const langPrefix = "";
    // TODO: Add language prefix

    let pathname = `${langPrefix}/${path}`;
    if (extra?.length) pathname += `/${extra}`;

    return pathname;
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
