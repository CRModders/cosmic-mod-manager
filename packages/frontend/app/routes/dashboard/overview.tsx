import { useLoaderData, useOutletContext } from "react-router";
import clientFetch from "@root/utils/client-fetch";
import { resJson } from "@root/utils/server-fetch";
import type { ProjectListItem } from "@shared/types/api";
import { WanderingCubesSpinner } from "~/components/ui/spinner";
import OverviewPage from "~/pages/dashboard/overview";
import type { RootOutletData } from "~/root";
import { clientLoader as NotificationsLoader } from "./notifications/page";

export default function _Overview() {
    const { session } = useOutletContext<RootOutletData>();
    const loaderData = useLoaderData<typeof clientLoader>();

    if (!session) return;

    return (
        <OverviewPage
            session={session}
            userProjects={loaderData.userProjects}
            notifications={loaderData.notifications || []}
            relatedUsers={loaderData.users || []}
            relatedOrgs={loaderData.orgs || []}
            relatedProjects={loaderData.projects || []}
        />
    );
}

export function HydrateFallback() {
    return <WanderingCubesSpinner />;
}

export async function clientLoader() {
    const [userProjectsRes, notificationData] = await Promise.all([clientFetch("/api/project"), NotificationsLoader()]);
    const userProjects = await resJson<ProjectListItem[]>(userProjectsRes);

    return {
        userProjects: userProjects || [],
        ...notificationData,
    };
}
