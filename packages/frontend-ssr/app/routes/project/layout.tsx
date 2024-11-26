import type { LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { type ShouldRevalidateFunctionArgs, useLoaderData, useOutletContext } from "@remix-run/react";
import type { AwaitedReturnType } from "@root/types";
import { getProjectPagePathname } from "@root/utils";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { getCurrMember } from "@shared/lib/utils";
import type { ProjectDetailsData, ProjectListItem, ProjectVersionData, TeamMember } from "@shared/types/api";
import ClientOnly from "~/components/client-only";
import { SuspenseFallback } from "~/components/ui/spinner";
import ProjectPageLayout from "~/pages/project/layout";
import type { RootOutletData } from "~/root";
import NotFoundPage from "../$";

export default function _ProjectLayout() {
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
        <ClientOnly
            fallback={<SuspenseFallback />}
            Element={() => (
                <ProjectPageLayout
                    session={session}
                    projectData={projectData}
                    allProjectVersions={data.versions}
                    featuredProjectVersions={featuredProjectVersions}
                    dependencies={data.dependencies}
                    currUsersMembership={currUsersMembership}
                />
            )}
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
        title: projectData.name,
        description: projectData.summary,
        image: projectData.icon || "",
        url: `${Config.FRONTEND_URL}${getProjectPagePathname(projectData.type?.[0], projectData.slug)}`,
        suffixTitle: true,
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
