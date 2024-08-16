import { BrandIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/link";
import ThemeSwitch from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";
import "@/src/globals.css";
import { projectTypes } from "@shared/config/project";
import { CapitalizeAndFormatString, createURLSafeSlug } from "@shared/lib/utils";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { HamMenu, MobileNav } from "./mobile-nav";
import NavButton from "./nav-button";
import "./styles.css";

const Navbar = () => {
    const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);

    const toggleNavMenu = (newState?: boolean) => {
        setIsNavMenuOpen((current) => (newState === true || newState === false ? newState : !current));
    };

    const NavLinks = projectTypes.map((projectType) => {
        return {
            label: `${CapitalizeAndFormatString(projectType)}s`,
            href: `/${createURLSafeSlug(projectType).value}s`,
        };
    });

    useEffect(() => {
        if (isNavMenuOpen === true) {
            document.body.classList.add("navmenu-open");
        } else {
            document.body.classList.remove("navmenu-open");
        }
    }, [isNavMenuOpen]);

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
                            className="flex items-center justify-center h-nav-item"
                            onClick={() => {
                                toggleNavMenu(false);
                            }}
                        >
                            <BrandIcon size="2.2rem" />
                            <span className="text-lg font-bold px-1 flex items-end justify-center rounded-lg bg-clip-text bg-accent-bg text-transparent bg-cover bg-gradient-to-b from-rose-200 to-accent-background via-accent-background drop-shadow-2xl">
                                CRMM
                            </span>
                        </Link>

                        <ul className="hidden lg:flex items-center justify-center gap-3">
                            {NavLinks.map((link) => {
                                return (
                                    <li key={link.href} className="flex px-2 items-center justify-center">
                                        <Navlink
                                            href={link.href}
                                            label={link.label}
                                            className="h-nav-item navLinkText flex items-center justify-center"
                                        >
                                            <span className="relative flex items-center justify-center">
                                                {link.label}
                                                <span className="activityIndicator" />
                                            </span>
                                        </Navlink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeSwitch />
                        <div className="hidden lg:flex">
                            <NavButton toggleNavMenu={toggleNavMenu} />
                        </div>
                        <div className="flex lg:hidden align-center justify-center">
                            <HamMenu isNavMenuOpen={isNavMenuOpen} toggleNavMenu={toggleNavMenu} />
                        </div>
                    </div>
                </nav>
            </div>

            <MobileNav isNavMenuOpen={isNavMenuOpen} NavLinks={NavLinks} toggleNavMenu={toggleNavMenu} />
        </header>
    );
};

export default Navbar;

type Props = {
    href: string;
    label?: string;
    isDisabled?: boolean;
    tabIndex?: number;
    closeNavMenuOnLinkClick?: boolean;
    className?: string;
    toggleNavMenu?: (newState?: boolean) => void;
    children?: React.ReactNode;
};

export const Navlink = ({ href, label, children, className }: Props) => {
    return (
        <RouterNavLink aria-label={label} to={href} className={cn("routerNavLink", className)}>
            {children ? children : label}
        </RouterNavLink>
    );
};

export const NavMenuLink = ({
    href,
    label,
    isDisabled = false,
    tabIndex,
    className,
    closeNavMenuOnLinkClick = true,
    toggleNavMenu,
    children,
}: Props) => {
    return (
        <ButtonLink
            url={href}
            activeClassName="bg-shallower-background dark:bg-shallow-background"
            className={cn("w-full", className)}
            tabIndex={tabIndex || isDisabled ? -1 : 0}
            onClick={() => {
                if (closeNavMenuOnLinkClick === true) {
                    toggleNavMenu?.(false);
                }
            }}
        >
            {children ? children : label}
        </ButtonLink>
    );
};
