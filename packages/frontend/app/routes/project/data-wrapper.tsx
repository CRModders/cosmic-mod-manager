import { getProjectPagePathname } from "@root/utils";
import Config from "@root/utils/config";
import { MetaTags, OrganizationLdJson, ProjectLdJson, UserLdJson } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import { CapitalizeAndFormatString, getCurrMember } from "@shared/lib/utils";
import { combineProjectMembers } from "@shared/lib/utils/project";
import type { LoggedInUserData } from "@shared/types";
import type { ProjectDetailsData, ProjectListItem, ProjectVersionData, TeamMember } from "@shared/types/api";
import { Outlet, type ShouldRevalidateFunctionArgs, useLoaderData, useOutletContext } from "react-router";
import type { RootOutletData } from "~/root";
import NotFoundPage from "../$";
import type { Route } from "./+types/data-wrapper";

export interface ProjectDataWrapperContext {
    session: LoggedInUserData | null;
    projectData: ProjectDetailsData;
    allProjectVersions: ProjectVersionData[];
    featuredProjectVersions: ProjectVersionData[] | null;
    currUsersMembership: TeamMember | null;
    dependencies: {
        projects: ProjectListItem[];
        versions: ProjectVersionData[];
    };
}

export default function _ProjectDataWrapper() {
    const { session } = useOutletContext<RootOutletData>();
    const data = useLoaderData() as LoaderData;

    const projectData = data?.projectData;
    if (!projectData)
        return (
            <NotFoundPage
                title="Project not found"
                description={`The project with the slug/ID "${data?.projectSlug}" does not exist.`}
                linkHref="/mods"
                linkLabel="Browse Mods"
            />
        );

    const featuredProjectVersions: ProjectVersionData[] = [];
    for (const version of data.versions || []) {
        if (version.featured) {
            featuredProjectVersions.push(version);
        }
    }

    let currUsersMembership: TeamMember | null = null;
    if (!session?.id) currUsersMembership = null;
    else {
        const membership = getCurrMember(session.id, projectData.members, projectData.organisation?.members || []);

        if (membership?.id) {
            currUsersMembership = membership;
        } else {
            currUsersMembership = null;
        }
    }

    return (
        <Outlet
            context={{
                session: session,
                projectData: data.projectData,
                allProjectVersions: data.versions,
                featuredProjectVersions: featuredProjectVersions,
                currUsersMembership: currUsersMembership,
                dependencies: data.dependencies,
            }}
        />
    );
}

export interface LoaderData {
    projectSlug: string | undefined;
    projectData?: ProjectDetailsData | null;
    versions?: ProjectVersionData[];
    dependencies?: {
        projects: ProjectListItem[];
        versions: ProjectVersionData[];
    };
}

export async function loader(props: Route.LoaderArgs): Promise<LoaderData> {
    const projectSlug = props.params.projectSlug;

    if (!projectSlug) {
        return {
            projectSlug: projectSlug,
        };
    }

    const [projectRes, versionsRes, depsRes] = await Promise.all([
        serverFetch(props.request, `/api/project/${projectSlug}`),
        serverFetch(props.request, `/api/project/${projectSlug}/version`),
        serverFetch(props.request, `/api/project/${projectSlug}/dependencies`),
    ]);

    if (!projectRes.ok) {
        return {
            projectSlug: projectSlug,
        };
    }

    const projectData = (await resJson<{ project: ProjectDetailsData }>(projectRes))?.project;
    const versions = await resJson<{ data: ProjectVersionData[] }>(versionsRes);
    const dependencies = (await resJson(depsRes)) as {
        projects: ProjectListItem[];
        versions: ProjectVersionData[];
    };

    return {
        projectSlug: projectSlug,
        projectData: projectData || null,
        versions: versions?.data || [],
        dependencies: dependencies || [],
    };
}

export function meta(props: Route.MetaArgs) {
    const data = props.data as LoaderData;
    const project = data?.projectData;

    if (!project) {
        return MetaTags({
            title: "Project Not Found",
            description: "The project you are looking for could not be found.",
            image: `${Config.FRONTEND_URL}/icon.png`,
            url: Config.FRONTEND_URL,
            suffixTitle: true,
        });
    }

    const allMembers = Array.from(combineProjectMembers(project.members, project.organisation?.members || []).values());
    const creator = allMembers.find((member) => member.isOwner);
    const contributors = project.members.filter((member) => !member.isOwner);

    const creatorJson = creator
        ? UserLdJson(
              {
                  ...creator,
                  id: creator.userId,
                  name: creator.userName,
                  bio: "",
              },
              {
                  role: "Creator",
              },
          )
        : {};

    const projectMembersJson = contributors.map((member) =>
        UserLdJson(
            {
                ...member,
                id: member.userId,
                name: member.userName,
                bio: "",
            },
            { role: member.role },
        ),
    );

    const orgJson = project.organisation ? OrganizationLdJson(project.organisation) : null;

    let contributorObj = {};
    if (projectMembersJson.length > 0) contributorObj = { contributor: projectMembersJson };

    let orgObj = {};
    if (orgJson) orgObj = { publisher: orgJson };

    const ldJson = ProjectLdJson(project, {
        "@context": "https://schema.org",
        creator: creatorJson,
        ...contributorObj,
        ...orgObj,
    });

    return MetaTags({
        title: `${project.name} - Cosmic Reach ${CapitalizeAndFormatString(project.type?.[0])}`,
        description: project.summary,
        siteMetaDescription: `${project.summary} - Download the Cosmic Reach ${CapitalizeAndFormatString(project.type[0])} ${project.name} by ${creator?.userName} on ${SITE_NAME_SHORT}`,
        image: project.icon || "",
        url: `${Config.FRONTEND_URL}${getProjectPagePathname(project.type?.[0], project.slug)}`,
        ldJson: ldJson,
    });
}

export function shouldRevalidate({ currentParams, nextParams, nextUrl, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
    const revalidate = nextUrl.searchParams.get("revalidate") === "true";
    if (revalidate) return true;

    const currentId = currentParams.projectSlug;
    const nextId = nextParams.projectSlug;

    if (currentId === nextId) return false;

    return defaultShouldRevalidate;
}
