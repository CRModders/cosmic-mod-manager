import { useNavigate } from "@remix-run/react";
import type { Notification } from "@shared/types/api";
import { CalendarIcon, CheckCheckIcon, CheckIcon, Trash2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { fallbackUserIcon } from "~/components/icons";
import { ImgWrapper } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import Link from "~/components/ui/link";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { acceptTeamInvite, leaveTeam } from "~/pages/project/settings/members/utils";

interface Props {
    notification: Notification;
    markNotificationAsRead: () => Promise<void>;
    deleteNotification: () => Promise<void>;
    markingAsRead: boolean;
    deletingNotification: boolean;
    concise?: boolean;
    showMarkAsReadButton?: boolean;
    showDeleteButton?: boolean;
    pageUrl: string;
    invitedBy: {
        userName: string;
        avatar: string | null;
    };
    title: string;
    icon: string | null;
    navigateTo?: string;
    fallbackIcon?: React.ReactNode;
}

export function TeamInviteNotification({
    notification,
    markNotificationAsRead,
    deleteNotification,
    markingAsRead,
    deletingNotification,
    concise = false,
    showMarkAsReadButton = true,
    showDeleteButton = false,
    navigateTo,
    invitedBy,
    pageUrl,
    title,
    icon,
    fallbackIcon,
}: Props) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean | "accept" | "decline">(false);

    const acceptInvite = async () => {
        if (isLoading) return;
        setIsLoading("accept");

        try {
            const teamId = notification.body?.teamId as string;
            const result = await acceptTeamInvite(teamId);
            markNotificationAsRead();

            if (!result?.success) {
                return toast.error(result?.message || "Failed to accept team invite");
            }

            toast.success(result?.message || "");
            if (navigateTo) navigate(navigateTo);
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

    return (
        <li className="w-full flex flex-col gap-2 bg-background/75 rounded p-card-surround" aria-label="Team Invite">
            <div className="w-full flex flow-row items-center justify-between">
                <div className="grow flex flex-wrap items-center justify-start gap-1">
                    <Link to={pageUrl} className="mr-1.5" aria-label={title}>
                        <ImgWrapper src={icon || ""} alt={title} fallback={fallbackIcon} className="w-11 h-11" />
                    </Link>
                    <div className="flex items-center justify-start gap-x-1 flex-wrap">
                        <Link
                            aria-label={invitedBy.userName || (notification.body?.invitedBy as string)}
                            to={`/user/${invitedBy.userName}`}
                            className="flex items-center justify-center gap-1 font-semibold hover:underline"
                        >
                            <ImgWrapper
                                src={invitedBy?.avatar || ""}
                                alt={invitedBy.userName || (notification.body?.invitedBy as string)}
                                fallback={fallbackUserIcon}
                                className="w-6 h-6 rounded-full"
                            />

                            {invitedBy.userName || notification.body?.invitedBy}
                        </Link>
                        <span className="text-muted-foreground">has invited you to join</span>
                        <Link to={pageUrl} className="font-semibold hover:underline">
                            {title}
                        </Link>
                    </div>
                </div>

                <TooltipProvider>
                    <div className="flex items-center justify-center gap-2">
                        {concise === true && (
                            <>
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
                            </>
                        )}
                        {showMarkAsReadButton && !notification.read && (
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
                        )}
                        {showDeleteButton && (
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
                        )}
                    </div>
                </TooltipProvider>
            </div>

            {concise === false && (
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
                            <span>
                                Received <TimePassedSince date={notification.dateCreated} />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <FormattedDate date={notification.dateCreated} />
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </li>
    );
}
