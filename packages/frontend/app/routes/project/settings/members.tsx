import { resJson, serverFetch } from "@root/utils/server-fetch";
import type { Organisation } from "@shared/types/api";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import ProjectMemberSettingsPage from "~/pages/project/settings/members/page";

export default function _MemberSettings() {
    const orgs = useLoaderData() as Organisation[];

    return <ProjectMemberSettingsPage userOrgs={orgs} />;
}

export async function loader(props: LoaderFunctionArgs): Promise<Organisation[]> {
    const orgsRes = await serverFetch(props.request, "/api/organization");
    const orgs = await resJson<Organisation[]>(orgsRes);

    return orgs || [];
}
