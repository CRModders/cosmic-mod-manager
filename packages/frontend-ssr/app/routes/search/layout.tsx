import type { MetaArgs } from "@remix-run/node";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { SITE_NAME_LONG, SITE_NAME_SHORT } from "@shared/config";
import { getProjectTypeFromName } from "@shared/lib/utils/convertors";
import ClientOnly from "~/components/client-only";
import { SuspenseFallback } from "~/components/ui/spinner";
import SearchPageLayout from "~/pages/search/layout";

export default function _Search() {
    return <ClientOnly fallback={<SuspenseFallback />} Element={SearchPageLayout} />;
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
        image: `${Config.FRONTEND_URL}/favicon.ico`,
    });
}
