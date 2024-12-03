import { cn, imageUrl } from "@root/utils";
import clientFetch from "@root/utils/client-fetch";
import type { LoggedInUserData } from "@shared/types";
import type { Notification } from "@shared/types/api";
import { BellIcon, Building2Icon, LayoutDashboardIcon, LayoutListIcon, LogInIcon, LogOutIcon, Settings2Icon, UserIcon } from "lucide-react";
import { useState } from "react";
import { fallbackUserIcon } from "~/components/icons";
import { ImgWrapper } from "~/components/ui/avatar";
import { NotificationBadge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { ButtonLink, VariantButtonLink } from "~/components/ui/link";
import { LoadingSpinner } from "~/components/ui/spinner";

export function LoginButton({
    className,
    onClick,
}: {
    className?: string;
    onClick?: () => void;
}) {
    return (
        <VariantButtonLink
            prefetch="render"
            url="/login"
            className={className}
            variant="secondary-inverted"
            aria-label="Login"
            onClick={onClick}
        >
            <LogInIcon className="w-btn-icon h-btn-icon" />
            Log In
        </VariantButtonLink>
    );
}

interface NavbuttonProps {
    toggleNavMenu: (newState?: boolean) => void;
    session: LoggedInUserData | null;
    notifications: Notification[] | null;
}

export default function NavButton({ session, notifications, toggleNavMenu }: NavbuttonProps) {
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
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    size="lg"
                    variant="ghost"
                    aria-label="Profile icon"
                    className="p-0 m-0 h-fit rounded-full w-fit no_neumorphic_shadow relative"
                >
                    <ImgWrapper
                        src={imageUrl(session.avatarUrl)}
                        alt={session?.userName}
                        fallback={fallbackUserIcon}
                        className="p-0.5 h-nav-item w-nav-item rounded-full border-none bg-shallower-background dark:bg-shallow-background"
                    />
                    {undreadNotifications > 0 ? <NotificationBadge className="min-h-1.5 min-w-1.5" /> : null}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52 p-2 flex flex-col gap-1">
                {[
                    {
                        icon: <UserIcon className="w-btn-icon h-btn-icon" />,
                        label: "Profile",
                        url: `/user/${session.userName}`,
                        matchExactUrl: false,
                    },
                    {
                        icon: <BellIcon className="w-btn-icon h-btn-icon" />,
                        label: "Notifications",
                        url: "/dashboard/notifications",
                        matchExactUrl: false,
                        notificationBadge: undreadNotifications,
                    },
                    {
                        icon: <Settings2Icon className="w-btn-icon h-btn-icon" />,
                        label: "Settings",
                        url: "/settings/account",
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
                <DropdownMenuSeparator />
                {[
                    {
                        icon: <LayoutListIcon className="w-btn-icon h-btn-icon" />,
                        label: "Projects",
                        url: "/dashboard/projects",
                        matchExactUrl: false,
                    },
                    {
                        icon: <Building2Icon className="w-btn-icon h-btn-icon" />,
                        label: "Organizations",
                        url: "/dashboard/organizations",
                        matchExactUrl: false,
                    },
                    {
                        icon: <LayoutDashboardIcon className="w-btn-icon h-btn-icon" />,
                        label: "Dashboard",
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
                <DropdownMenuSeparator />
                <SignOutBtn disabled={!isOpen} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

type Props = {
    className?: string;
    disabled?: boolean;
};

export function SignOutBtn({ className, disabled = false }: Props) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (loading || disabled) return;
        setLoading(true);

        await clientFetch("/api/auth/sessions", {
            method: "DELETE",
        });

        window.location.reload();
    };

    return (
        <ButtonLink
            url="#"
            activityIndicator={false}
            onClick={handleClick}
            tabIndex={disabled ? -1 : 0}
            className={cn("h-nav-item text-danger-foreground items-center justify-start", className)}
        >
            {loading ? <LoadingSpinner size="xs" /> : <LogOutIcon className="w-btn-icon h-btn-icon" />}
            Sign out
        </ButtonLink>
    );
}
