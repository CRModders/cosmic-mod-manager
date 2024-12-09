import { useLoaderData } from "react-router";
import clientFetch from "@root/utils/client-fetch";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson } from "@root/utils/server-fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import type { Notification, OrganisationListItem, ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import NotificationsPage from "~/pages/dashboard/notification/page";

export default function _Notifications() {
    const data = useLoaderData() as LoaderData;

    return (
        <NotificationsPage
            notifications={data.notifications || []}
            relatedProjects={data.projects || []}
            relatedUsers={data.users || []}
            relatedOrgs={data.orgs || []}
        />
    );
}

interface LoaderData {
    notifications: Notification[] | null;
    projects?: ProjectListItem[];
    orgs?: OrganisationListItem[];
    users?: UserProfileData[];
}

export async function clientLoader(): Promise<LoaderData> {
    const notificationsRes = await clientFetch("/api/notifications");
    const notifications = ((await resJson(notificationsRes)) as Notification[]) || [];

    if (!notifications?.length) return { notifications: null };

    const projectIds: string[] = [];
    const orgIds: string[] = [];
    const userIds: string[] = [];

    for (const notification of notifications) {
        const projectId = notification.body?.projectId;
        if (projectId && typeof projectId === "string") projectIds.push(projectId);

        const orgId = notification.body?.orgId;
        if (orgId && typeof orgId === "string") orgIds.push(orgId);

        const userId = notification.body?.invitedBy;
        if (userId && typeof userId === "string") userIds.push(userId);
    }

    const [projectsRes, orgsRes, usersRes] = await Promise.all([
        clientFetch(`/api/projects?ids=${encodeURIComponent(JSON.stringify(projectIds))}`),
        clientFetch(`/api/organizations?ids=${encodeURIComponent(JSON.stringify(orgIds))}`),
        clientFetch(`/api/users?ids=${encodeURIComponent(JSON.stringify(userIds))}`),
    ]);

    const projects = ((await resJson(projectsRes)) as ProjectListItem[]) || null;
    const orgs = ((await resJson(orgsRes)) as OrganisationListItem[]) || null;
    const users = ((await resJson(usersRes)) as UserProfileData[]) || null;

    return {
        notifications,
        projects,
        orgs,
        users,
    };
}

export function meta() {
    return MetaTags({
        title: "Notifications",
        description: `Your ${SITE_NAME_SHORT} notifications`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/dashboard/notifications`,
        suffixTitle: true,
    });
}
