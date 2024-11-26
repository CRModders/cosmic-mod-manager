import type { LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { Outlet, type ShouldRevalidateFunctionArgs, useLoaderData, useOutletContext } from "@remix-run/react";
import type { AwaitedReturnType } from "@root/types";
import { getOrgPagePathname } from "@root/utils";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import type { Organisation, ProjectListItem, TeamMember } from "@shared/types/api";
import type { RootOutletData } from "~/root";
import NotFoundPage from "../$";

export interface OrgDataContext {
    orgData: Organisation;
    orgProjects: ProjectListItem[];
    currUsersMembership: TeamMember | null;
}

export default function _OrgDataWrapper() {
    const { session } = useOutletContext<RootOutletData>();
    const data = useLoaderData<typeof loader>();

    if (!data.orgData) {
        return (
            <NotFoundPage
                title="Organization not found"
                description={`The organization with the slug/ID "${data?.orgSlug}" does not exist.`}
                linkHref="/"
                linkLabel="Home"
            />
        );
    }

    const currUsersMembership = data.orgData?.members.find((member) => member.userId === session?.id) || null;

    return (
        <Outlet
            context={
                {
                    orgData: data.orgData,
                    orgProjects: data.orgProjects || [],
                    currUsersMembership: currUsersMembership,
                } satisfies OrgDataContext
            }
        />
    );
}

export async function loader(props: LoaderFunctionArgs) {
    const orgSlug = props.params.orgSlug;

    const [orgDataRes, orgProjectsRes] = await Promise.all([
        serverFetch(props.request, `/api/organization/${orgSlug}`),
        serverFetch(props.request, `/api/organization/${orgSlug}/projects`),
    ]);

    const [orgData, orgProjects] = await Promise.all([resJson<Organisation>(orgDataRes), resJson<ProjectListItem[]>(orgProjectsRes)]);

    return { orgSlug, orgData, orgProjects };
}

export function shouldRevalidate({ currentParams, nextParams, nextUrl, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
    const revalidate = nextUrl.searchParams.get("revalidate") === "true";
    if (revalidate) return true;

    const currentId = currentParams.orgSlug;
    const nextId = nextParams.orgSlug;

    if (currentId === nextId) return false;

    return defaultShouldRevalidate;
}

export function meta(props: MetaArgs) {
    const data = props.data as AwaitedReturnType<typeof loader>;
    const orgData = data?.orgData;

    if (!orgData) {
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
        url: `${Config.FRONTEND_URL}${getOrgPagePathname(orgData.slug)}`,
    });
}
