import { cn } from "@/lib/utils";
import "@/src/globals.css";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { BrandIcon } from "../icons";
import HamMenu, { MobileNav } from "./mobile-menu";
import NavButton from "./nav-button";
import { MenuProfileLinks } from "./profile-dropdown";
import "./styles.css";
import ThemeSwitch from "./theme-switcher";

const Navbar = () => {
    const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);

    const toggleNavMenu = (newState?: boolean) => {
        setIsNavMenuOpen((current) =>
            newState === true || newState === false ? newState : !current,
        );
    };

    const NavLinks = [
        {
            label: "Mods",
            href: "/mods",
        },
        {
            label: "Resource Packs",
            href: "/resource-packs",
        },
        {
            label: "Modpacks",
            href: "/modpacks",
        },
        {
            label: "Shaders",
            href: "/shaders",
        },
    ];

    useEffect(() => {
        if (isNavMenuOpen === true) {
            document.body.classList.add("navmenu-open");
        }
        else {
            document.body.classList.remove("navmenu-open");
        }
    }, [isNavMenuOpen])


    return (
        <header className="w-full flex items-start justify-start relative">
            <div className="w-full flex items-center justify-center z-50 shadow-md shadow-bg-hover bg-background">
                <nav className="container flex flex-wrap items-center justify-between py-2 px-4 sm:px-8">
                    <div className="flex items-center justify-center gap-8">
                        <Link
                            to={"/"}
                            className="flex items-center justify-center navItemHeight"
                            onClick={() => {
                                toggleNavMenu(false);
                            }}
                        >
                            <BrandIcon size="2.2rem" />
                            <span
                                className={cn(
                                    "font-frijole",
                                    "text-xl lg:text-lg px-1 flex items-end justify-center rounded-lg",
                                    "bg-clip-text bg-accent-bg text-transparent bg-cover bg-gradient-to-b from-rose-200 to-accent-bg via-accent-bg",
                                    "drop-shadow-2xl",
                                )}
                            >
                                CRMM
                            </span>
                        </Link>

                        <ul className="hidden lg:flex items-center justify-center gap-4">
                            {NavLinks.map((link) => {
                                return (
                                    <li
                                        key={link.href}
                                        className="flex items-center justify-center"
                                    >
                                        <Navlink href={link.href} label={link.label}>
                                            <span className="navLinkText navItemHeight px-2 flex items-center justify-center">
                                                {link.label}
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
                            <NavButton />
                        </div>
                        <div className="flex lg:hidden align-center justify-center">
                            <HamMenu
                                isNavMenuOpen={isNavMenuOpen}
                                toggleNavMenu={toggleNavMenu}
                            />
                        </div>
                    </div>
                </nav>
            </div>

            <MobileNav
                isNavMenuOpen={isNavMenuOpen}
                NavMenuLinks={NavLinks}
                toggleNavMenu={toggleNavMenu}
            >
                <MenuProfileLinks isNavMenuOpen={isNavMenuOpen} toggleNavMenu={toggleNavMenu} />
            </MobileNav>
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

export const Navlink = ({ href, label, children }: Props) => {
    return (
        <RouterNavLink aria-label={label} to={href} className="routerNavLink">
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
        <RouterNavLink
            className={cn("routerNavLink w-full", className)}
            to={href}
            aria-label={label}
            tabIndex={tabIndex || isDisabled ? -1 : 0}
            aria-disabled={isDisabled}
            onClick={() => {
                if (closeNavMenuOnLinkClick === true) {
                    toggleNavMenu?.(false);
                }
            }}
        >
            {children ? children : label}
        </RouterNavLink>
    );
};
