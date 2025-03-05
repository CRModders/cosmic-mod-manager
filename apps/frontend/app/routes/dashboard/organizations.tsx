import { SITE_NAME_SHORT } from "@app/utils/constants";
import type { Organisation } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import OrganisationDashboardPage from "~/pages/dashboard/organization/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/organizations";

export default function _Organizations() {
    const session = useSession();
    const orgs = useLoaderData<typeof loader>();

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
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/dashboard/organizations`,
        suffixTitle: true,
    });
}
