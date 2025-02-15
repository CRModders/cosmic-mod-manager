import { SITE_NAME_SHORT } from "@app/utils/constants";
import type { Organisation, ProjectListItem } from "@app/utils/types/api";
import { Outlet, type ShouldRevalidateFunctionArgs } from "react-router";
import { useOrgData } from "~/hooks/org";
import NotFoundPage from "~/pages/not-found";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import { OrgPagePath } from "~/utils/urls";
import type { Route } from "./+types/data-wrapper";

export default function _OrgDataWrapper() {
    const ctx = useOrgData();

    if (!ctx?.orgData?.id) {
        return (
            <NotFoundPage
                title="Organization not found"
                description={`The organization with the slug/ID "${ctx?.orgSlug}" does not exist.`}
                linkHref="/"
                linkLabel="Home"
            />
        );
    }

    return <Outlet />;
}

export interface OrgLoaderData {
    orgSlug?: string;
    orgData: Organisation | null;
    orgProjects: ProjectListItem[];
}

export async function loader(props: Route.LoaderArgs): Promise<OrgLoaderData> {
    const orgSlug = props.params.orgSlug;

    const [orgDataRes, orgProjectsRes] = await Promise.all([
        serverFetch(props.request, `/api/organization/${orgSlug}`),
        serverFetch(props.request, `/api/organization/${orgSlug}/projects`),
    ]);
    const [orgData, orgProjects] = await Promise.all([resJson<Organisation>(orgDataRes), resJson<ProjectListItem[]>(orgProjectsRes)]);

    return {
        orgSlug,
        orgData,
        orgProjects: orgProjects || [],
    };
}

export function shouldRevalidate({ currentParams, nextParams, nextUrl, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
    const revalidate = nextUrl.searchParams.get("revalidate") === "true";
    if (revalidate) return true;

    const currentId = currentParams.orgSlug?.toLowerCase();
    const nextId = nextParams.orgSlug?.toLowerCase();

    if (currentId === nextId) return false;

    return defaultShouldRevalidate;
}

export function meta(props: Route.MetaArgs) {
    const data = props.data as OrgLoaderData;
    const orgData = data?.orgData;

    if (!orgData?.id) {
        return MetaTags({
            title: "Organization Not Found",
            description: "The organization you are looking for could not be found.",
            image: `${Config.FRONTEND_URL}/icon.png`,
            url: Config.FRONTEND_URL,
            suffixTitle: true,
        });
    }

    return MetaTags({
        title: `${orgData.name} - Organization`,
        description: `${orgData.description} - View the organization ${orgData.name} on ${SITE_NAME_SHORT}`,
        image: orgData.icon || "",
        url: `${Config.FRONTEND_URL}${OrgPagePath(orgData.slug)}`,
    });
}
