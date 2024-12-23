import { BrandIcon } from "@app/components/icons";
import { cn } from "@app/components/utils";
import { SITE_NAME_LONG, SITE_NAME_SHORT } from "@app/utils/config";
import { Capitalize } from "@app/utils/string";
import type { LoggedInUserData } from "@app/utils/types";
import type { Notification } from "@app/utils/types/api";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import ClientOnly from "~/components/client-only";
import Link, { ButtonLink } from "~/components/ui/link";
import ThemeSwitch from "~/components/ui/theme-switcher";
import { useTranslation } from "~/locales/provider";
import { HamMenu, MobileNav } from "./mobile-nav";
import NavButton from "./nav-button";
import "./styles.css";

interface NavbarProps {
    session: LoggedInUserData | null;
    notifications: Notification[];
}

export default function Navbar(props: NavbarProps) {
    const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);
    const { t } = useTranslation();
    const nav = t.navbar;

    const toggleNavMenu = (newState?: boolean) => {
        setIsNavMenuOpen((current) => (newState === true || newState === false ? newState : !current));
    };

    const NavLinks = [
        {
            label: Capitalize(nav.mods),
            href: "mods",
        },
        {
            label: Capitalize(nav.datamods),
            href: "datamods",
        },
        {
            label: Capitalize(nav["resource-packs"]),
            href: "resource-packs",
        },
        {
            label: Capitalize(nav.shaders),
            href: "shaders",
        },
        {
            label: Capitalize(nav.modpacks),
            href: "modpacks",
        },
        {
            label: Capitalize(nav.plugins),
            href: "plugins",
        },
    ];

    useEffect(() => {
        if (isNavMenuOpen === true) {
            document.body.classList.add("navmenu-open");
        } else {
            document.body.classList.remove("navmenu-open");
        }
    }, [isNavMenuOpen]);

    const MemoizedThemeSwitch = useMemo(() => <ThemeSwitch />, []);

    return (
        <header className="w-full flex items-start justify-start relative">
            <div
                className={cn(
                    "nav_bg w-full flex items-center justify-center z-50 bg-transparent transition-colors duration-0 delay-300",
                    isNavMenuOpen && "bg-background delay-0",
                )}
            >
                <nav className="container flex flex-wrap items-center justify-between py-3 px-4 sm:px-8">
                    <div className="flex items-center justify-center gap-8">
                        <Link
                            to={"/"}
                            className="flex items-center justify-center h-nav-item gap-1"
                            aria-label="CRMM Home page"
                            title={SITE_NAME_LONG}
                            onClick={() => {
                                toggleNavMenu(false);
                            }}
                        >
                            <BrandIcon size="1.75rem" strokeWidth={26} />
                            <span className="text-lg font-bold px-1 flex items-end justify-center rounded-lg bg-clip-text bg-accent-bg text-transparent bg-cover bg-gradient-to-b from-rose-200 to-accent-background via-accent-background drop-shadow-2xl">
                                {SITE_NAME_SHORT}
                            </span>
                        </Link>

                        <ul className="hidden lg:flex items-center justify-center gap-1">
                            {NavLinks.map((link) => {
                                return (
                                    <li key={link.href} className="flex items-center justify-center">
                                        <Navlink href={link.href} label={link.label} className="h-9">
                                            {link.label}
                                        </Navlink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="flex items-center gap-4">
                        {MemoizedThemeSwitch}

                        <div className="hidden lg:flex">
                            <NavButton session={props.session} notifications={props.notifications} toggleNavMenu={toggleNavMenu} />
                        </div>

                        <div className="flex lg:hidden align-center justify-center">
                            <HamMenu isNavMenuOpen={isNavMenuOpen} toggleNavMenu={toggleNavMenu} />
                        </div>
                    </div>
                </nav>
            </div>

            <ClientOnly
                Element={() => (
                    <MobileNav
                        session={props.session}
                        notifications={props.notifications}
                        isNavMenuOpen={isNavMenuOpen}
                        NavLinks={NavLinks}
                        toggleNavMenu={toggleNavMenu}
                    />
                )}
            />
        </header>
    );
}

type NavlinkProps = {
    href: string;
    label?: string;
    isDisabled?: boolean;
    tabIndex?: number;
    closeNavMenuOnLinkClick?: boolean;
    className?: string;
    toggleNavMenu?: (newState?: boolean) => void;
    children?: React.ReactNode;
};

export function Navlink({ href, label, children, className }: NavlinkProps) {
    return (
        <ButtonLink
            url={href}
            prefetch="render"
            className={cn("hover:bg-card-background/70 dark:hover:bg-shallow-background/75 font-semibold", className)}
            activeClassName="bg-card-background dark:bg-shallow-background"
        >
            {children ? children : label}
        </ButtonLink>
    );
}

export function NavMenuLink({
    href,
    label,
    isDisabled = false,
    tabIndex,
    className,
    closeNavMenuOnLinkClick = true,
    toggleNavMenu,
    children,
}: NavlinkProps) {
    return (
        <ButtonLink
            url={href}
            activeClassName="bg-shallower-background dark:bg-shallow-background"
            className={cn("w-full", className)}
            tabIndex={isDisabled ? -1 : tabIndex}
            onClick={() => {
                if (closeNavMenuOnLinkClick === true) {
                    toggleNavMenu?.(false);
                }
            }}
        >
            {children ? children : label}
        </ButtonLink>
    );
}
