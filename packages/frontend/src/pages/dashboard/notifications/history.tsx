import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FullWidthSpinner } from "@/components/ui/spinner";
import { useContext } from "react";
import { NotificationsContext } from "./context";
import { NotificationItem } from "./page";

const NotificationsHistory = () => {
    const { notifications, relatedProjects, relatedUsers, isLoading, refetchNotifications } = useContext(NotificationsContext);

    if (isLoading) {
        return <FullWidthSpinner />;
    }

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

                {notifications?.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        relatedProject={relatedProjects?.get(`${notification.body?.projectId}`)}
                        relatedUser={relatedUsers?.get(`${notification.body?.invitedBy}`)}
                        refetchNotifications={refetchNotifications}
                        showDeleteButton={true}
                    />
                ))}
            </CardContent>
        </Card>
    );
};

export const Component = NotificationsHistory;
