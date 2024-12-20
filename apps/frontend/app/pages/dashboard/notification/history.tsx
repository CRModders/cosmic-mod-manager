import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@app/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { useTranslation } from "~/locales/provider";
import type { NotificationsData } from "./page";
import { NotificationItem } from "./page";

export default function NotificationsHistoryPage({ notifications, relatedProjects, relatedOrgs, relatedUsers }: NotificationsData) {
    const { t } = useTranslation();

    return (
        <Card className="w-full">
            <CardHeader className="w-full flex flex-col gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/notifications">{t.dashboard.notifications}</BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{t.dashboard.history}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <CardTitle className="w-fit">{t.dashboard.notifHistory}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-panel-cards">
                {!notifications?.length && <span className="text-muted-foreground">{t.dashboard.noUnreadNotifs}</span>}

                <ul className="w-full flex flex-col gap-panel-cards">
                    {notifications?.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            relatedProject={relatedProjects.find((p) => p.id === `${notification.body?.projectId}`)}
                            relatedUser={relatedUsers.find((u) => u.id === `${notification.body?.invitedBy}`)}
                            relatedOrg={relatedOrgs.find((o) => o.id === `${notification.body?.orgId}`)}
                            showDeleteButton={true}
                        />
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}