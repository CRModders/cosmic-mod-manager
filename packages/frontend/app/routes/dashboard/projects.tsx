import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import type { ProjectListItem } from "@shared/types/api";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import ProjectsPage from "~/pages/dashboard/projects/page";

export default function _Projects() {
    const projects = useLoaderData() as ProjectListItem[];

    return <ProjectsPage projects={projects} />;
}

export async function loader(props: LoaderFunctionArgs): Promise<ProjectListItem[]> {
    const res = await serverFetch(props.request, "/api/project");
    const projects = await resJson<ProjectListItem[]>(res);

    return projects || [];
}

export function meta() {
    return MetaTags({
        title: "Projects",
        description: `Your ${SITE_NAME_SHORT} projects`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/dashboard/projects`,
        suffixTitle: true,
    });
}
