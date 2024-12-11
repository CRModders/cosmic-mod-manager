import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import type { Organisation } from "@shared/types/api";
import { useLoaderData } from "react-router";
import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import OrganisationDashboardPage from "~/pages/dashboard/organization/page";
import type { Route } from "./+types/organizations";

export default function _Organizations() {
    const session = useSession();
    const orgs = useLoaderData<typeof loader>() as Organisation[];

    if (!session?.id) return <Redirect to="/login" />;
    return <OrganisationDashboardPage organisations={orgs} />;
}

export async function loader(props: Route.LoaderArgs): Promise<Organisation[]> {
    const res = await serverFetch(props.request, "/api/organization");
    const orgs = await resJson<Organisation[]>(res);

    return orgs || [];
}

export function meta() {
    return MetaTags({
        title: "Organizations",
        description: `Your ${SITE_NAME_SHORT} organizations`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/dashboard/organizations`,
        suffixTitle: true,
    });
}
