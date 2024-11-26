import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import type { Organisation } from "@shared/types/api";
import ProjectMemberSettingsPage from "~/pages/project/settings/members/page";

export default function _MemberSettings() {
    const orgs = useLoaderData<typeof loader>();

    return <ProjectMemberSettingsPage userOrgs={orgs} />;
}

export async function loader(props: LoaderFunctionArgs) {
    const orgsRes = await serverFetch(props.request, "/api/organization");
    const orgs = await resJson<Organisation[]>(orgsRes);

    return orgs || [];
}
