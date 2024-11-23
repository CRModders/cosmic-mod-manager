import { BrandIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/link";
import ThemeSwitch from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";
import "@/src/globals.css";
import { SITE_NAME_SHORT } from "@shared/config";
import { projectTypes } from "@shared/config/project";
import { CapitalizeAndFormatString, createURLSafeSlug } from "@shared/lib/utils";
import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
                            aria-label="CRMM Home page"
                            onClick={() => {
                                toggleNavMenu(false);
                            }}
                        >
                            <BrandIcon size="2.2rem" />
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
        <ButtonLink
            url={href}
            className={cn("hover:bg-card-background/70 dark:hover:bg-shallow-background/70 font-semibold", className)}
            activeClassName="bg-card-background dark:bg-shallow-background"
        >
            {children ? children : label}
        </ButtonLink>
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
};
