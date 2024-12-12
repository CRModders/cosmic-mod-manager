import Config from "@root/utils/config";
import { MetaTags, OrganizationLdJson, ProjectLdJson, UserLdJson } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { OrgPagePath } from "@root/utils/urls";
import { SITE_NAME_SHORT } from "@shared/config";
import type { Organisation, ProjectListItem, TeamMember } from "@shared/types/api";
import { Outlet, type ShouldRevalidateFunctionArgs } from "react-router";
import { useOrgData } from "~/hooks/org";
import NotFoundPage from "../$";
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

    const owner = orgData.members.find((member) => member.isOwner) as TeamMember;
    const members = orgData.members.filter((member) => !member.isOwner);

    const membersLdJson = members.map((member) =>
        UserLdJson({
            ...member,
            id: member.userId,
            name: member.userName,
            bio: "",
        }),
    );

    const projectsJson = data.orgProjects?.map((project) => ProjectLdJson(project));
    let projectObj = {};
    if ((projectsJson?.length || 0) > 0) projectObj = { memberOf: projectsJson };

    const ldJson = OrganizationLdJson(orgData, {
        "@context": "https://schema.org",
        founder: UserLdJson({
            ...owner,
            id: owner.userId,
            name: owner.userName,
            bio: "",
        }),
        member: membersLdJson,
        ...projectObj,
    });

    return MetaTags({
        title: `${orgData.name} - Organization`,
        description: `${orgData.description} - View the organization ${orgData.name} on ${SITE_NAME_SHORT}`,
        image: orgData.icon || "",
        url: `${Config.FRONTEND_URL}${OrgPagePath(orgData.slug)}`,
        ldJson: ldJson,
    });
}
