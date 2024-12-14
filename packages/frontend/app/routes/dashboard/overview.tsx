import clientFetch from "@root/utils/client-fetch";
import { resJson } from "@root/utils/server-fetch";
import type { ProjectListItem } from "@shared/types/api";
import { useLoaderData } from "react-router";
import { useSession } from "~/hooks/session";
import OverviewPage from "~/pages/dashboard/overview";
import { clientLoader as NotificationsLoader } from "./notifications/page";

export default function _Overview() {
    const session = useSession();
    const loaderData = useLoaderData<typeof clientLoader>();

    if (!session?.id) return;

    return (
        <OverviewPage
            userProjects={loaderData.userProjects}
            notifications={loaderData.notifications || []}
            relatedUsers={loaderData.users || []}
            relatedOrgs={loaderData.orgs || []}
            relatedProjects={loaderData.projects || []}
        />
    );
}

export async function clientLoader() {
    const [userProjectsRes, notificationData] = await Promise.all([clientFetch("/api/project"), NotificationsLoader()]);
    const userProjects = await resJson<ProjectListItem[]>(userProjectsRes);

    return {
        userProjects: userProjects || [],
        ...notificationData,
    };
}
