import type { ProjectListItem } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import DashboardAnalyticsPage from "~/pages/dashboard/analytics";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/analytics";

export default function () {
    const data = useLoaderData<typeof loader>();
    const userProjectIds = data.map((p) => p.id);

    return <DashboardAnalyticsPage userProjects={userProjectIds} />;
}

export async function loader(props: Route.LoaderArgs) {
    const res = await serverFetch(props.request, "/api/project");
    if (!res.ok) return [];

    return (await resJson<ProjectListItem[]>(res)) || [];
}

export function shouldRevalidate() {
    return false;
}

export function meta() {
    return MetaTags({
        title: "Analytics",
        description: `Your ${Config.SITE_NAME_SHORT} project's analytics`,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/dashboard/analytics`,
        suffixTitle: true,
    });
}
