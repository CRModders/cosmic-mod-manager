import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { NavMenuLink } from "./navbar";
import "./styles.css";

type HamMenuProps = {
    isNavMenuOpen: boolean;
    toggleNavMenu: (newState?: boolean) => void;
};

const HamMenu = ({ isNavMenuOpen, toggleNavMenu }: HamMenuProps) => {
    const handleHamMenuClick = () => {
        toggleNavMenu();
    };

    return (
        <button
            type="button"
            className="navItemHeight w-10 flex items-center justify-center hover:bg-background cursor-pointer rounded-lg"
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

export default HamMenu;

type Props = {
    isNavMenuOpen: boolean;
    toggleNavMenu: (newState?: boolean) => void;
    children: React.ReactNode;
    NavMenuLinks: {
        label: string;
        href: string;
    }[];
};

const MobileNav = ({ isNavMenuOpen, toggleNavMenu, children, NavMenuLinks }: Props) => {
    return (
        <>
            {
                <div
                    className={`mobile_navmenu w-full absolute top-0 left-0 duration-300 ${isNavMenuOpen && "menu_open"}`}
                >
                    <div className="w-full flex flex-col items-center justify-center row-span-2 relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-background opacity-[0.975] dark:opacity-[0.985] z-[3]" />

                        <ScrollArea className="w-full flex items-start justify-center z-20 h-[100vh]">
                            <ul className="navlink_list container pt-32 sm:pt-24 pb-28 px-6 flex flex-col items-start justify-start z-20 gap-2">
                                {NavMenuLinks.map((link) => {
                                    return (
                                        <React.Fragment key={link.href}>
                                            <li
                                                key={`${link.href}`}
                                                className="w-full group flex items-center justify-center rounded-lg bg_stagger_animation hover:bg-bg-hover"
                                            >
                                                <NavMenuLink
                                                    href={link.href}
                                                    label={link.label}
                                                    isDisabled={!isNavMenuOpen}
                                                    toggleNavMenu={toggleNavMenu}
                                                >
                                                    <span className="navLinkText navItemHeight w-full text-lg px-2 flex items-center justify-center">
                                                        {link.label}
                                                    </span>
                                                </NavMenuLink>
                                            </li>
                                        </React.Fragment>
                                    );
                                })}
                                {children}
                            </ul>
                        </ScrollArea>
                    </div>
                </div>
            }
        </>
    );
};

export { MobileNav };
