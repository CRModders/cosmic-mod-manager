import type { ProjectListItem } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import ProjectsPage from "~/pages/dashboard/projects/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/projects";

export default function () {
    const projects = useLoaderData() as ProjectListItem[];

    return <ProjectsPage projects={projects} />;
}

export async function loader(props: Route.LoaderArgs): Promise<ProjectListItem[]> {
    const res = await serverFetch(props.request, "/api/project");
    const projects = await resJson<ProjectListItem[]>(res);

    return projects || [];
}

export function meta() {
    return MetaTags({
        title: "Projects",
        description: `Your ${Config.SITE_NAME_SHORT} projects`,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/dashboard/projects`,
        suffixTitle: true,
    });
}
