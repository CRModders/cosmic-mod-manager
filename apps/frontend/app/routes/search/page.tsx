import type { SearchResult } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import { SpinnerCtxProvider } from "~/components/global-spinner";
import SearchPage from "~/pages/search/page";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/page";
import { SearchProvider } from "~/pages/search/provider";
import { SITE_NAME_LONG, SITE_NAME_SHORT } from "@app/utils/constants";
import { useProjectType } from "~/hooks/project";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { PageUrl } from "~/utils/urls";

export default function _() {
    const initialData = useLoaderData<typeof loader>();

    return (
        <SpinnerCtxProvider>
            <SearchProvider initialSearchResult={initialData}>
                <SearchPage />
            </SearchProvider>
        </SpinnerCtxProvider>
    );
}

export async function loader(props: Route.LoaderArgs) {
    const reqUrl = new URL(props.request.url);
    const pathFrags = reqUrl.pathname.split("?")[0].split("/").filter(Boolean);
    const type = (pathFrags.at(-1) || "")?.slice(0, -1);

    let queryParams = reqUrl.search.length > 0 ? reqUrl.search : "";
    if (type !== "project") queryParams += `${reqUrl.search.length > 0 ? "&" : "?"}type=${type}`;

    const res = await serverFetch(props.request, `/api/search${queryParams}`);
    const data = await resJson<SearchResult>(res);

    if (!data) return null;
    data.projectType = type;

    return data;
}

export function shouldRevalidate() {
    return false;
}

export function meta() {
    const type = `${useProjectType()}s`;

    return MetaTags({
        title: `Search ${type}`,
        description: `Search and download your favorite cosmic reach ${type} with ease here on ${SITE_NAME_SHORT} (${SITE_NAME_LONG}).`,
        url: `${Config.FRONTEND_URL}${PageUrl(type)}`,
        image: Config.SITE_ICON,
        suffixTitle: true,
    });
}
