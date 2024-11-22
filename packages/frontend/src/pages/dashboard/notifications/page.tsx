import { fallbackOrgIcon, fallbackProjectIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VariantButtonLink } from "@/components/ui/link";
import { FullWidthSpinner, LoadingSpinner } from "@/components/ui/spinner";
import { getOrgPagePathname, getProjectPagePathname } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import { NotificationType } from "@shared/types";
import type { Notification, OrganisationListItem, ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import { CheckCheckIcon, HistoryIcon } from "lucide-react";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import { NotificationsContext } from "./context";
import { TeamInviteNotification } from "./notification-cards";

const NotificationsPage = () => {
    const { notifications, relatedProjects, relatedOrgs, relatedUsers, isLoading, refetchNotifications } = useContext(NotificationsContext);
    const [markingAsRead, setMarkingAsRead] = useState(false);

    if (isLoading) {
        return <FullWidthSpinner />;
    }

    const unreadNotifications = notifications?.filter((notification) => !notification.read);

    const markAllAsRead = async () => {
        if (!unreadNotifications?.length || markingAsRead) return;
        setMarkingAsRead(true);
        try {
            const unreadNotificationIds = unreadNotifications.map((n) => n.id);
            const result = await useFetch(`/api/notifications?ids=${encodeURIComponent(JSON.stringify(unreadNotificationIds))}`, {
                method: "PATCH",
            });

            if (!result.ok) {
                return toast.error("Failed to mark notifications as read");
            }

            await refetchNotifications();
        } finally {
            setMarkingAsRead(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Notifications | {SITE_NAME_SHORT}</title>
                <meta name="description" content="Your notifications" />
            </Helmet>

            <Card className="w-full">
                <CardHeader className="w-full flex flex-row flex-wrap gap-x-4 gap-y-2 items-center justify-between">
                    <CardTitle className="w-fit">Notifications</CardTitle>

                    {(notifications?.length || 0) > 0 && (
                        <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1">
                            <VariantButtonLink url="/dashboard/notifications/history" className="w-fit">
                                <HistoryIcon className="w-btn-icon-md h-btn-icon-md" />
                                View history
                            </VariantButtonLink>

                            {(unreadNotifications?.length || 0) > 1 && (
                                <Button variant={"secondary-destructive"} disabled={markingAsRead} onClick={markAllAsRead}>
                                    {markingAsRead ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <CheckCheckIcon className="w-btn-icon-md h-btn-icon-md" />
                                    )}
                                    Mark all as read
                                </Button>
                            )}
                        </div>
                    )}
                </CardHeader>

                <CardContent className="flex flex-col gap-panel-cards">
                    {!unreadNotifications?.length && (
                        <span className="text-muted-foreground">You don't have any unread notifications.</span>
                    )}

                    <ul aria-label="Notifications list" className="w-full flex flex-col gap-panel-cards">
                        {unreadNotifications?.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                relatedProject={relatedProjects?.get(`${notification.body?.projectId}`)}
                                relatedOrg={relatedOrgs?.get(`${notification.body?.orgId}`)}
                                relatedUser={relatedUsers?.get(`${notification.body?.invitedBy}`)}
                                refetchNotifications={refetchNotifications}
                            />
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </>
    );
};

export const Component = NotificationsPage;

export const NotificationItem = ({
    notification,
    relatedProject,
    relatedOrg,
    relatedUser,
    refetchNotifications,
    ...props
}: {
    notification: Notification;
    refetchNotifications: () => Promise<void>;
    relatedProject?: ProjectListItem;
    relatedOrg?: OrganisationListItem;
    relatedUser?: UserProfileData;
    concise?: boolean;
    showMarkAsReadButton?: boolean;
    showDeleteButton?: boolean;
}) => {
    const [markingAsRead, setMarkingAsRead] = useState(false);
    const [deletingNotification, setDeletingNotification] = useState(false);

    const markNotificationAsRead = async () => {
        if (deletingNotification || markingAsRead) return;
        setMarkingAsRead(true);
        try {
            const result = await useFetch(`/api/notifications/${notification.id}`, {
                method: "PATCH",
            });

            if (!result.ok) {
                toast.error("Failed to mark notifications as read");
                return;
            }

            await refetchNotifications();
        } finally {
            setMarkingAsRead(false);
        }
    };

    const deleteNotification = async () => {
        if (markingAsRead) return;
        setDeletingNotification(true);
        try {
            const result = await useFetch(`/api/notifications/${notification.id}`, {
                method: "DELETE",
            });

            if (!result.ok) {
                toast.error("Failed to delete notification");
                return;
            }

            await refetchNotifications();
        } finally {
            setDeletingNotification(false);
        }
    };

    switch (notification.type) {
        case NotificationType.TEAM_INVITE:
            return (
                <TeamInviteNotification
                    notification={notification}
                    markNotificationAsRead={markNotificationAsRead}
                    deleteNotification={deleteNotification}
                    markingAsRead={markingAsRead}
                    deletingNotification={deletingNotification}
                    navigateTo={getProjectPagePathname(relatedProject?.type[0] || "project", relatedProject?.slug || "")}
                    pageUrl={getProjectPagePathname(relatedProject?.type[0] || "project", relatedProject?.slug || "")}
                    invitedBy={{
                        userName: relatedUser?.userName || (notification.body?.invitedBy as string),
                        avatarUrl: relatedUser?.avatarUrl || null,
                    }}
                    title={relatedProject?.name || (notification.body?.projectId as string)}
                    icon={relatedProject?.icon || null}
                    fallbackIcon={fallbackProjectIcon}
                    {...props}
                />
            );

        case NotificationType.ORGANIZATION_INVITE:
            return (
                <TeamInviteNotification
                    notification={notification}
                    markNotificationAsRead={markNotificationAsRead}
                    deleteNotification={deleteNotification}
                    markingAsRead={markingAsRead}
                    deletingNotification={deletingNotification}
                    navigateTo={getOrgPagePathname(relatedOrg?.slug || "")}
                    pageUrl={getOrgPagePathname(relatedOrg?.slug || "")}
                    invitedBy={{
                        userName: relatedUser?.userName || (notification.body?.invitedBy as string),
                        avatarUrl: relatedUser?.avatarUrl || null,
                    }}
                    title={relatedOrg?.name || (notification.body?.orgId as string)}
                    icon={relatedOrg?.icon || null}
                    fallbackIcon={fallbackOrgIcon}
                    {...props}
                />
            );
    }
};
