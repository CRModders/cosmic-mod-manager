import type { Collection } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import CollectionsDashboardPage from "~/pages/dashboard/collections/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "../+types/root-wrapper";

export default function _() {
    const session = useSession();
    const collections = useLoaderData<typeof loader>();

    if (!session?.id) return <Redirect to="/login" />;
    return <CollectionsDashboardPage collections={collections} />;
}

export async function loader(props: Route.LoaderArgs): Promise<Collection[]> {
    const res = await serverFetch(props.request, "/api/collections");
    const collections = await resJson<Collection[]>(res);

    return collections || [];
}

export function meta() {
    return MetaTags({
        title: "Collections",
        description: `Your ${Config.SITE_NAME_SHORT} project collections`,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/dashboard/collections`,
        suffixTitle: true,
    });
}
