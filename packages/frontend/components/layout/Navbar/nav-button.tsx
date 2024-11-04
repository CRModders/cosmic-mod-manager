import { fallbackUserIcon } from "@/components/icons";
import { ImgWrapper } from "@/components/ui/avatar";
import { NotificationBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ButtonLink } from "@/components/ui/link";
import { LoadingSpinner } from "@/components/ui/spinner";
import { cn, imageUrl } from "@/lib/utils";
import { SessionContext } from "@/src/contexts/auth";
import { BellIcon, Building2Icon, LayoutDashboardIcon, LayoutListIcon, LogInIcon, LogOutIcon, Settings2Icon, UserIcon } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

export const LoginButton = ({
    className,
    onClick,
}: {
    className?: string;
    onClick?: () => void;
}) => {
    return (
        <Button
            className={cn(
                "bg-card-background hover:bg-card-background/90 dark:bg-shallow-background dark:hover:bg-shallow-background/90",
                className,
            )}
            variant={"secondary"}
            // size={"sm"}
            aria-label="Login"
            tabIndex={-1}
            onClick={onClick}
        >
            <LogInIcon className="w-btn-icon h-btn-icon" />
            Log In
        </Button>
    );
};

const NavButton = ({ toggleNavMenu }: { toggleNavMenu: (newState?: boolean) => void }) => {
    const { session, notifications } = useContext(SessionContext);
    const [isOpen, setIsOpen] = useState(false);

    if (session === undefined) {
        return <LoadingSpinner size="sm" />;
    }

    const undreadNotifications = (notifications || [])?.filter((n) => !n.read).length;

    if (!session?.id) {
        return (
            <Link to={"/login"}>
                <LoginButton
                    onClick={() => {
                        toggleNavMenu(false);
                    }}
                />
            </Link>
        );
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    size="lg"
                    variant="ghost"
                    aria-label="Profile icon"
                    className="p-0 m-0 h-fit rounded-full w-fit hover:bg-transparent dark:hover:bg-transparent no_neumorphic_shadow relative"
                >
                    <ImgWrapper
                        src={imageUrl(session.avatarUrl)}
                        alt={session?.userName}
                        fallback={fallbackUserIcon}
                        className="h-nav-item w-nav-item p-0.5 rounded-full"
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
};

export default NavButton;

type Props = {
    className?: string;
    disabled?: boolean;
};

export const SignOutBtn = ({ className, disabled = false }: Props) => {
    const [loading, setLoading] = useState(false);
    const { logout } = useContext(SessionContext);

    const handleClick = async () => {
        if (loading || disabled) return;
        setLoading(true);
        await logout();
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
};
