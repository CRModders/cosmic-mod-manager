import { fallbackProjectIcon, fallbackUserIcon } from "@/components/icons";
import { ImgWrapper } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VariantButtonLink } from "@/components/ui/link";
import { FullWidthSpinner, LoadingSpinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { constructProjectPageUrl, formatDate, getProjectPagePathname, timeSince } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import { NotificationType } from "@shared/types";
import type { Notification, ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import { CalendarIcon, CheckCheckIcon, CheckIcon, HistoryIcon, Trash2Icon, XIcon } from "lucide-react";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { acceptTeamInvite, leaveTeam } from "../../project/settings/members/utils";
import { NotificationsContext } from "./context";

const NotificationsPage = () => {
    const { notifications, relatedProjects, relatedUsers, isLoading, refetchNotifications } = useContext(NotificationsContext);
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

                    {unreadNotifications?.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            relatedProject={relatedProjects?.get(`${notification.body?.projectId}`)}
                            relatedUser={relatedUsers?.get(`${notification.body?.invitedBy}`)}
                            refetchNotifications={refetchNotifications}
                        />
                    ))}
                </CardContent>
            </Card>
        </>
    );
};

export default NotificationsPage;

export const NotificationItem = ({
    notification,
    relatedProject,
    relatedUser,
    refetchNotifications,
    ...props
}: {
    notification: Notification;
    refetchNotifications: () => Promise<void>;
    relatedProject?: ProjectListItem;
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
                    relatedProject={relatedProject}
                    relatedUser={relatedUser}
                    markNotificationAsRead={markNotificationAsRead}
                    deleteNotification={deleteNotification}
                    markingAsRead={markingAsRead}
                    deletingNotification={deletingNotification}
                    {...props}
                />
            );
    }
};

export const TeamInviteNotification = ({
    notification,
    relatedProject,
    relatedUser,
    markNotificationAsRead,
    deleteNotification,
    markingAsRead,
    deletingNotification,
    concise = false,
    showMarkAsReadButton = true,
    showDeleteButton = false,
}: {
    notification: Notification;
    relatedProject: ProjectListItem | undefined;
    relatedUser: UserProfileData | undefined;
    markNotificationAsRead: () => Promise<void>;
    deleteNotification: () => Promise<void>;
    markingAsRead: boolean;
    deletingNotification: boolean;
    concise?: boolean;
    showMarkAsReadButton?: boolean;
    showDeleteButton?: boolean;
}) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean | "accept" | "decline">(false);

    const acceptInvite = async () => {
        if (!relatedProject || isLoading) return;
        setIsLoading("accept");

        try {
            const teamId = notification.body?.teamId as string;
            const result = await acceptTeamInvite(teamId);
            markNotificationAsRead();

            if (!result?.success) {
                return toast.error(result?.message || "Failed to accept team invite");
            }

            toast.success(result?.message || "");
            navigate(constructProjectPageUrl(relatedProject.type[0], relatedProject.slug));
        } finally {
            setIsLoading(false);
        }
    };

    const declineInvite = async () => {
        if (isLoading) return;
        setIsLoading("decline");

        try {
            const teamId = notification.body?.teamId as string;
            const result = await leaveTeam(teamId);
            markNotificationAsRead();

            if (!result?.success) {
                return toast.error(result?.message || "Error");
            }

            toast.success(result?.message || "");
        } finally {
            setIsLoading(false);
        }
    };

    const projectPageUrl = getProjectPagePathname(
        relatedProject?.type[0] || "project",
        relatedProject?.slug || (notification.body?.projectId as string),
    );

    return (
        <div className="w-full flex flex-col gap-2 bg-background/75 rounded p-card-surround">
            <div className="w-full flex flow-row items-center justify-between">
                <div className="grow flex flex-wrap items-center justify-start gap-1">
                    <Link to={projectPageUrl} className="mr-1.5">
                        <ImgWrapper
                            src={relatedProject?.icon || ""}
                            alt={relatedProject?.name || (notification.body?.projectId as string)}
                            fallback={fallbackProjectIcon}
                            className="w-11 h-11"
                        />
                    </Link>
                    <div className="flex items-center justify-start gap-x-1 flex-wrap">
                        <Link
                            to={`/user/${relatedUser?.userName}`}
                            className="flex items-center justify-center gap-1 font-semibold hover:underline"
                        >
                            <ImgWrapper
                                src={relatedUser?.avatarUrl || ""}
                                alt={relatedUser?.userName || (notification.body?.invitedBy as string)}
                                fallback={fallbackUserIcon}
                                className="w-6 h-6 rounded-full"
                            />

                            {relatedUser?.userName || notification.body?.invitedBy}
                        </Link>
                        <span className="text-muted-foreground">has invited you to join</span>
                        <Link to={projectPageUrl} className="font-semibold hover:underline">
                            {relatedProject?.name || notification.body?.projectId}
                        </Link>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                    {concise === true && relatedProject && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant={"ghost-inverted"}
                                        className="text-success-foreground"
                                        disabled={!!isLoading}
                                        onClick={acceptInvite}
                                    >
                                        {isLoading === "accept" ? (
                                            <LoadingSpinner size="xs" />
                                        ) : (
                                            <CheckIcon strokeWidth={2.2} className="w-btn-icon-md h-btn-icon-md" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Accept</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={"ghost-inverted"}
                                        size="icon"
                                        className="text-danger-foreground"
                                        disabled={!!isLoading}
                                        onClick={declineInvite}
                                    >
                                        {isLoading === "decline" ? (
                                            <LoadingSpinner size="xs" />
                                        ) : (
                                            <XIcon className="w-btn-icon-md h-btn-icon-md" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Decline</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    {showMarkAsReadButton && !notification.read && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost-inverted"
                                        className="text-extra-muted-foreground"
                                        disabled={deletingNotification || markingAsRead}
                                        onClick={markNotificationAsRead}
                                    >
                                        <CheckCheckIcon className="w-btn-icon h-btn-icon" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Mark as read</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    {showDeleteButton && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost-inverted"
                                        className="text-danger-foreground"
                                        disabled={deletingNotification}
                                        onClick={deleteNotification}
                                    >
                                        <Trash2Icon className="w-btn-icon h-btn-icon" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete notification</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>

            {concise === false && relatedProject && (
                <div className="w-fit flex items-center justify-start gap-x-2 gap-y-1">
                    <Button size="sm" disabled={!!isLoading} onClick={acceptInvite}>
                        {isLoading === "accept" ? (
                            <LoadingSpinner size="xs" />
                        ) : (
                            <CheckIcon strokeWidth={2.2} className="w-btn-icon h-btn-icon" />
                        )}
                        Accept
                    </Button>

                    <Button variant={"secondary-destructive-inverted"} size="sm" disabled={!!isLoading} onClick={declineInvite}>
                        {isLoading === "decline" ? <LoadingSpinner size="xs" /> : <XIcon className="w-btn-icon h-btn-icon" />}
                        Decline
                    </Button>
                </div>
            )}

            <div className="w-fit flex items-baseline-with-fallback justify-center gap-1.5 text-extra-muted-foreground">
                <CalendarIcon className="h-btn-icon-sm w-btn-icon-sm" />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>Received {timeSince(new Date(notification.dateCreated))}</span>
                        </TooltipTrigger>
                        <TooltipContent>{formatDate(new Date(notification.dateCreated))}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};
