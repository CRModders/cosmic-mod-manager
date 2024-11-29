import type { MetaArgs } from "@remix-run/node";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { SITE_NAME_LONG, SITE_NAME_SHORT } from "@shared/config";
import { getProjectTypeFromName } from "@shared/lib/utils/convertors";
import { SearchResultsPage } from "~/pages/search/page";

export default function _Search() {
    return <SearchResultsPage />;
}

export function meta(props: MetaArgs) {
    const firstPath = props.location.pathname.split("/")?.[1];
    const typeStr = firstPath?.slice(0, -1);
    if (!typeStr) return null;

    const type = getProjectTypeFromName(typeStr);

    return MetaTags({
        title: `Search ${type}s`,
        description: `Search and download your favorite cosmic reach ${type}s with ease here on ${SITE_NAME_SHORT} (${SITE_NAME_LONG}).`,
        url: `${Config.FRONTEND_URL}/${type}s`,
        image: `${Config.FRONTEND_URL}/icon.png`,
    });
}
