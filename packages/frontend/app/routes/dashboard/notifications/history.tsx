import { useLoaderData } from "react-router";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { SITE_NAME_SHORT } from "@shared/config";
import NotificationsHistoryPage from "~/pages/dashboard/notification/history";
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

export async function clientLoader() {
    return await NotificationsDataLoader();
}

export function meta() {
    return MetaTags({
        title: "Notifications history",
        description: `Your ${SITE_NAME_SHORT} notifications history`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/dashboard/notifications`,
        suffixTitle: true,
    });
}
