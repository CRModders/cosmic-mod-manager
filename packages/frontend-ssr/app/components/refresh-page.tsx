import type { Location, NavigateFunction } from "@remix-run/react";

export default function RefreshPage(navigate: NavigateFunction, location: Location | string) {
    let url = "";
    if (typeof location === "string") {
        const _url = new URL(`https://example.com${location}`);
        _url.searchParams.set("revalidate", "true");
        url = _url.toString().replace(_url.origin, "");
    } else {
        url = `${location.pathname}${location.search}`;
        if (location.search) url += "&revalidate=true";
        else url += "?revalidate=true";

        url += location.hash;
    }

    navigate(url, { replace: true });
}
