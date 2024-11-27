import type { LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { Outlet, type ShouldRevalidateFunctionArgs, useLoaderData, useOutletContext } from "@remix-run/react";
import type { AwaitedReturnType } from "@root/types";
import { getProjectPagePathname } from "@root/utils";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { CapitalizeAndFormatString, getCurrMember } from "@shared/lib/utils";
import type { LoggedInUserData } from "@shared/types";
import type { ProjectDetailsData, ProjectListItem, ProjectVersionData, TeamMember } from "@shared/types/api";
import type { RootOutletData } from "~/root";
import NotFoundPage from "../$";

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
    const data = useLoaderData<typeof loader>();

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

export async function loader(props: LoaderFunctionArgs) {
    const projectSlug = props.params.projectSlug;

    if (!projectSlug) {
        return { projectSlug: projectSlug };
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

export function meta(props: MetaArgs) {
    const data = props.data as AwaitedReturnType<typeof loader>;
    const projectData = data?.projectData;

    if (!projectData) {
        return MetaTags({
            title: "Project Not Found",
            description: "The project you are looking for could not be found.",
            image: `${Config.FRONTEND_URL}/icon.png`,
            url: Config.FRONTEND_URL,
            suffixTitle: true,
        });
    }

    return MetaTags({
        title: `${projectData.name} - Cosmic Reach ${CapitalizeAndFormatString(projectData.type?.[0])}`,
        description: projectData.summary,
        image: projectData.icon || "",
        url: `${Config.FRONTEND_URL}${getProjectPagePathname(projectData.type?.[0], projectData.slug)}`,
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
