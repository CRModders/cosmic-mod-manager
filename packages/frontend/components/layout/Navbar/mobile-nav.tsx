import { fallbackUserIcon } from "@/components/icons";
import { ImgWrapper } from "@/components/ui/avatar";
import { NotificationBadge } from "@/components/ui/badge";
import { imageUrl } from "@/lib/utils";
import { useSession } from "@/src/contexts/auth";
import { BellIcon, Building2Icon, LayoutListIcon, Settings2Icon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { LoginButton, SignOutBtn } from "./nav-button";
import { NavMenuLink } from "./navbar";

interface MobileNavProps {
    isNavMenuOpen: boolean;
    toggleNavMenu: (newState?: boolean) => void;
    NavLinks: {
        label: string;
        href: string;
    }[];
}

export const MobileNav = ({ isNavMenuOpen, toggleNavMenu, NavLinks }: MobileNavProps) => {
    const { session, notifications } = useSession();
    const unreadNotifications = (notifications || [])?.filter((n) => !n.read).length;

    return (
        <div className={`mobile_navmenu w-full absolute top-[100%] left-0 duration-300 ${isNavMenuOpen && "menu_open"}`}>
            <div className="w-full flex flex-col items-center justify-center row-span-2 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-background opacity-[0.975] dark:opacity-[0.985] z-[3]" />

                <div className="navlink_list_wrapper overscroll-contain w-full flex items-start justify-center z-20 h-[100vh] overflow-y-auto">
                    <ul className="navlink_list container pt-8 pb-28 px-6 flex flex-col items-start justify-start z-20 gap-1">
                        {NavLinks.map((link) => {
                            return (
                                <li key={`${link.href}`} className="w-full group">
                                    <NavMenuLink
                                        href={link.href}
                                        label={link.label}
                                        isDisabled={!isNavMenuOpen}
                                        toggleNavMenu={toggleNavMenu}
                                        className="h-nav-item items-center justify-center hover:bg-shallower-background dark:hover:bg-shallow-background"
                                    >
                                        {link.label}
                                    </NavMenuLink>
                                </li>
                            );
                        })}
                        {!!session?.id && (
                            <>
                                <li className="w-full h-px bg-shallower-background dark:bg-shallow-background my-2"> </li>

                                <li className="w-full flex flex-col gap-1 items-center justify-center mb-2">
                                    <div className="w-full flex items-center justify-center gap-2">
                                        <ImgWrapper
                                            src={imageUrl(session?.avatarUrl)}
                                            alt={session.userName}
                                            className="w-10 h-10 rounded-full"
                                            fallback={fallbackUserIcon}
                                        />
                                        <div className="flex flex-col items-start justify-center gap-1.5">
                                            <span className="leading-none font-semibold text-foreground/90">{session?.name}</span>
                                            <span className="leading-none text-muted-foreground text-[0.93rem]">
                                                <em className="select-none not-italic text-extra-muted-foreground">@</em>
                                                {session?.userName}
                                            </span>
                                        </div>
                                    </div>
                                </li>

                                {[
                                    {
                                        icon: <UserIcon className="w-btn-icon h-btn-icon" />,
                                        label: "Profile",
                                        url: `/user/${session.userName}`,
                                    },
                                    {
                                        icon: <BellIcon className="w-btn-icon h-btn-icon" />,
                                        label: "Notifications",
                                        url: "/dashboard/notifications",
                                        notificationBadge: unreadNotifications,
                                    },
                                    {
                                        icon: <Settings2Icon className="w-btn-icon h-btn-icon" />,
                                        label: "Settings",
                                        url: "/settings/account",
                                    },
                                    {
                                        icon: <LayoutListIcon className="w-btn-icon h-btn-icon" />,
                                        label: "Projects",
                                        url: "/dashboard/projects",
                                    },
                                    {
                                        icon: <Building2Icon className="w-btn-icon h-btn-icon" />,
                                        label: "Organizations",
                                        url: "/dashboard/organizations",
                                    },
                                ]?.map((link) => {
                                    return (
                                        <li key={`${link.url}`} className="w-full group flex items-center justify-center relative">
                                            <NavMenuLink
                                                href={link.url}
                                                label={link.label}
                                                isDisabled={!isNavMenuOpen}
                                                toggleNavMenu={toggleNavMenu}
                                                className="h-nav-item items-center justify-center hover:bg-shallower-background dark:hover:bg-shallow-background"
                                            >
                                                {link?.icon || null}
                                                {link.label}

                                                {link.notificationBadge && unreadNotifications > 0 ? (
                                                    <NotificationBadge>{unreadNotifications}</NotificationBadge>
                                                ) : null}
                                            </NavMenuLink>
                                        </li>
                                    );
                                })}
                                <li className="w-full">
                                    <SignOutBtn
                                        disabled={!isNavMenuOpen}
                                        className="justify-center hover:bg-shallower-background dark:hover:bg-shallow-background"
                                    />
                                </li>
                            </>
                        )}
                        {!session?.id && (
                            <li className="w-full flex group">
                                <Link to="/login" className="w-full" tabIndex={!isNavMenuOpen ? -1 : 0}>
                                    <LoginButton onClick={() => toggleNavMenu(false)} className="w-full" />
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

interface HamMenuProps {
    isNavMenuOpen: boolean;
    toggleNavMenu: (newState?: boolean) => void;
}

export const HamMenu = ({ isNavMenuOpen, toggleNavMenu }: HamMenuProps) => {
    const handleHamMenuClick = () => {
        toggleNavMenu();
    };

    return (
        <button
            type="button"
            className="navItemHeight w-10 flex items-center justify-center hover:bg-card-background dark:hover:bg-shallow-background cursor-pointer rounded text-foreground"
            onClick={handleHamMenuClick}
            aria-label="Menu"
        >
            <div className={`ham_menu_icon ${isNavMenuOpen && "ham_menu_open"} aspect-square w-full relative`}>
                <i className="ham_menu_line_1 block absolute top-[33%] left-1/2 h-[0.12rem] w-[50%] bg-current rounded-full translate-y-[-50%] translate-x-[-50%]" />
                <i className="ham_menu_line_2 block absolute top-[50%] left-1/2 h-[0.12rem] w-[50%] bg-current rounded-full translate-y-[-50%] translate-x-[-50%]" />
                <i className="ham_menu_line_3 block absolute top-[67%] left-1/2 h-[0.12rem] w-[50%] bg-current rounded-full translate-y-[-50%] translate-x-[-50%]" />
            </div>
        </button>
    );
};
