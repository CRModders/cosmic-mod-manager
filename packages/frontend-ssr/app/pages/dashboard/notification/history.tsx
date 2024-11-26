import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { NotificationsData } from "./page";
import { NotificationItem } from "./page";

export default function NotificationsHistoryPage({ notifications, relatedProjects, relatedOrgs, relatedUsers }: NotificationsData) {
    return (
        <Card className="w-full">
            <CardHeader className="w-full flex flex-col gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/notifications">Notifications</BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>History</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <CardTitle className="w-fit">Notification History</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-panel-cards">
                {!notifications?.length && <span className="text-muted-foreground">You don't have any notifications.</span>}

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
