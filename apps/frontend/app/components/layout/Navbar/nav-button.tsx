import { fallbackUserIcon } from "@app/components/icons";
import { NotificationBadge } from "@app/components/ui/badge";
import { Button } from "@app/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@app/components/ui/popover";
import { Separator } from "@app/components/ui/separator";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { cn } from "@app/components/utils";
import { disableInteractions } from "@app/utils/dom";
import type { LoggedInUserData } from "@app/utils/types";
import type { Notification } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { BellIcon, Building2Icon, LayoutDashboardIcon, LayoutListIcon, LogInIcon, LogOutIcon, Settings2Icon, UserIcon } from "lucide-react";
import { useState } from "react";
import { ImgWrapper } from "~/components/ui/avatar";
import { ButtonLink, VariantButtonLink } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import { UserProfilePath } from "~/utils/urls";

export function LoginButton({
    className,
    onClick,
}: {
    className?: string;
    onClick?: () => void;
}) {
    const { t } = useTranslation();

    return (
        <VariantButtonLink
            prefetch="render"
            url="/login"
            className={className}
            variant="secondary-inverted"
            aria-label={t.form.login_withSpace}
            onClick={onClick}
        >
            <LogInIcon className="w-btn-icon h-btn-icon" />
            {t.form.login_withSpace}
        </VariantButtonLink>
    );
}

interface NavbuttonProps {
    toggleNavMenu: (newState?: boolean) => void;
    session: LoggedInUserData | null;
    notifications: Notification[] | null;
}

export default function NavButton({ session, notifications, toggleNavMenu }: NavbuttonProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    if (session === undefined) {
        return <LoadingSpinner size="sm" />;
    }

    const undreadNotifications = (notifications || [])?.filter((n) => !n.read).length;

    if (!session?.id) {
        return (
            <LoginButton
                onClick={() => {
                    toggleNavMenu(false);
                }}
            />
        );
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    size="lg"
                    variant="ghost"
                    aria-label="Profile icon"
                    className="p-0 m-0 h-fit rounded-full w-fit no_neumorphic_shadow relative"
                >
                    <ImgWrapper
                        src={imageUrl(session.avatar)}
                        alt={session?.userName}
                        fallback={fallbackUserIcon}
                        className="p-0.5 h-nav-item w-nav-item rounded-full border-none bg-shallower-background dark:bg-shallow-background"
                    />
                    {undreadNotifications > 0 ? <NotificationBadge className="min-h-1.5 min-w-1.5" /> : null}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="min-w-52 p-1.5 flex flex-col gap-1">
                {[
                    {
                        icon: <UserIcon className="w-btn-icon h-btn-icon" />,
                        label: t.navbar.profile,
                        url: UserProfilePath(session.userName),
                        matchExactUrl: false,
                    },
                    {
                        icon: <BellIcon className="w-btn-icon h-btn-icon" />,
                        label: t.dashboard.notifications,
                        url: "/dashboard/notifications",
                        matchExactUrl: false,
                        notificationBadge: undreadNotifications,
                    },
                    {
                        icon: <Settings2Icon className="w-btn-icon h-btn-icon" />,
                        label: t.common.settings,
                        url: "/settings/profile",
                        matchExactUrl: false,
                    },
                ].map((item) => {
                    return (
                        <ButtonLink key={item.url} url={item.url} exactTailMatch={false} className="relative">
                            {item.icon}
                            {item.label}

                            {item.notificationBadge ? <NotificationBadge /> : null}
                        </ButtonLink>
                    );
                })}

                <Separator className="my-0.5" />

                {[
                    {
                        icon: <LayoutListIcon className="w-btn-icon h-btn-icon" />,
                        label: t.dashboard.projects,
                        url: "/dashboard/projects",
                        matchExactUrl: false,
                    },
                    {
                        icon: <Building2Icon className="w-btn-icon h-btn-icon" />,
                        label: t.dashboard.organizations,
                        url: "/dashboard/organizations",
                        matchExactUrl: false,
                    },
                    {
                        icon: <LayoutDashboardIcon className="w-btn-icon h-btn-icon" />,
                        label: t.dashboard.dashboard,
                        url: "/dashboard",
                        matchExactUrl: true,
                    },
                ].map((item) => {
                    return (
                        <ButtonLink key={item.url} url={item.url} exactTailMatch={item.matchExactUrl}>
                            {item.icon}
                            {item.label}
                        </ButtonLink>
                    );
                })}

                <Separator className="my-0.5" />

                <SignOutBtn disabled={!isOpen} />
            </PopoverContent>
        </Popover>
    );
}

type Props = {
    className?: string;
    disabled?: boolean;
};

export function SignOutBtn({ className, disabled = false }: Props) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        if (loading || disabled) return;
        setLoading(true);
        disableInteractions();

        await clientFetch("/api/auth/sessions", {
            method: "DELETE",
        });

        window.location.reload();
    }

    return (
        <ButtonLink
            url="#"
            activityIndicator={false}
            onClick={handleClick}
            tabIndex={disabled ? -1 : 0}
            className={cn("h-nav-item text-danger-foreground items-center justify-start", className)}
        >
            {loading ? <LoadingSpinner size="xs" /> : <LogOutIcon className="w-btn-icon h-btn-icon" />}
            {t.navbar.signout}
        </ButtonLink>
    );
}
