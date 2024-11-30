import type { LoaderFunctionArgs } from "@remix-run/node";
import { Navigate, useLoaderData, useOutletContext } from "@remix-run/react";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import type { Organisation } from "@shared/types/api";
import OrganisationDashboardPage from "~/pages/dashboard/organization/page";
import type { RootOutletData } from "~/routes/layout";

export default function _Organizations() {
    const orgs = useLoaderData<typeof loader>();
    const { session } = useOutletContext<RootOutletData>();

    if (!session?.id) return <Navigate to="/login" />;

    return <OrganisationDashboardPage organisations={orgs} session={session} />;
}

export async function loader(props: LoaderFunctionArgs) {
    const res = await serverFetch(props.request, "/api/organization");
    const orgs = ((await resJson(res)) as Organisation[]) || [];

    return orgs;
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
