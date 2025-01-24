import { fallbackUserIcon } from "@app/components/icons";
import { Button } from "@app/components/ui/button";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@app/components/ui/tooltip";
import type { Notification } from "@app/utils/types/api";
import { CalendarIcon, CheckCheckIcon, CheckIcon, Trash2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import { ImgWrapper } from "~/components/ui/avatar";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import Link, { useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import { acceptTeamInvite, leaveTeam } from "~/pages/project/settings/members/utils";
import { UserProfilePath } from "~/utils/urls";

interface Props {
    notification: Notification;
    markNotificationAsRead: (refresh?: boolean) => Promise<void>;
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
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean | "accept" | "decline">(false);

    async function acceptInvite() {
        if (isLoading) return;
        setIsLoading("accept");

        try {
            const teamId = notification.body?.teamId as string;
            const result = await acceptTeamInvite(teamId);
            markNotificationAsRead(false);

            if (!result?.success) {
                return toast.error(result?.message || "Failed to accept team invite");
            }

            toast.success(result?.message || "");
            if (navigateTo) navigate(navigateTo);
        } finally {
            setIsLoading(false);
        }
    }

    async function declineInvite() {
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
    }

    return (
        <li className="w-full flex flex-col gap-2 bg-background/75 rounded p-card-surround" aria-label="Team Invite">
            <div className="w-full flex flow-row items-center justify-between">
                <div className="grow flex flex-wrap items-center justify-start gap-1">
                    <Link to={pageUrl} className="me-1.5" aria-label={title}>
                        <ImgWrapper src={icon || ""} alt={title} fallback={fallbackIcon} className="w-11 h-11" />
                    </Link>
                    <div className="flex items-center justify-start gap-x-1 flex-wrap">
                        <Link
                            aria-label={invitedBy.userName || (notification.body?.invitedBy as string)}
                            to={UserProfilePath(invitedBy.userName)}
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
                        {notification.read === false && concise === true && (
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
                                                <CheckIcon aria-hidden strokeWidth={2.2} className="w-btn-icon-md h-btn-icon-md" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{t.common.accept}</TooltipContent>
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
                                                <XIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{t.common.decline}</TooltipContent>
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
                                        onClick={() => markNotificationAsRead()}
                                    >
                                        <CheckCheckIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{t.dashboard.markRead}</TooltipContent>
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
                                        <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{t.dashboard.deleteNotif}</TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </TooltipProvider>
            </div>
            {notification.read === false && concise === false && (
                <div className="w-fit flex items-center justify-start gap-x-2 gap-y-1">
                    <Button size="sm" disabled={!!isLoading} onClick={acceptInvite}>
                        {isLoading === "accept" ? (
                            <LoadingSpinner size="xs" />
                        ) : (
                            <CheckIcon aria-hidden strokeWidth={2.2} className="w-btn-icon h-btn-icon" />
                        )}
                        {t.common.accept}
                    </Button>

                    <Button variant={"secondary-destructive-inverted"} size="sm" disabled={!!isLoading} onClick={declineInvite}>
                        {isLoading === "decline" ? <LoadingSpinner size="xs" /> : <XIcon aria-hidden className="w-btn-icon h-btn-icon" />}
                        {t.common.decline}
                    </Button>
                </div>
            )}

            <div className="w-fit flex items-baseline-with-fallback justify-center gap-1.5 text-extra-muted-foreground">
                <CalendarIcon aria-hidden className="h-btn-icon-sm w-btn-icon-sm" />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                {t.dashboard.received} <TimePassedSince date={notification.dateCreated} />
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
