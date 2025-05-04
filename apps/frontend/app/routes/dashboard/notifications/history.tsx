import { SuspenseFallback } from "@app/components/ui/spinner";
import { useLoaderData } from "react-router";
import NotificationsHistoryPage from "~/pages/dashboard/notification/history";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { clientLoader as NotificationsDataLoader } from "./page";

export default function _NotificationsHistory() {
    const data = useLoaderData<typeof clientLoader>();

    return (
        <NotificationsHistoryPage
            notifications={data.notifications || []}
            relatedProjects={data.projects || []}
            relatedUsers={data.users || []}
            relatedOrgs={data.orgs || []}
        />
    );
}

export const clientLoader = NotificationsDataLoader;

export function HydrateFallback() {
    return <SuspenseFallback />;
}

export function meta() {
    return MetaTags({
        title: "Notifications history",
        description: `Your ${Config.SITE_NAME_SHORT} notifications history`,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/dashboard/notifications`,
        suffixTitle: true,
    });
}
