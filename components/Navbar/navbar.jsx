import React, { Suspense } from "react";

import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
} from "@nextui-org/navbar";
import NextLink from "next/link";
import NavSkeleton from "./NavSkeleton";
import { NavLinks, NavMenuLinks } from "@/constants/NavLinks";
import NavLink, { NavMenuLink } from "./NavLinks";
import ThemeSwitch from "./ThemeSwitch";
import "@/app/globals.css";

const Navbar = async () => {
	return (
		<NextUINavbar
			maxWidth="full"
			isBlurred={true}
			className="fixed top-0 left-0 right-0 bg-[var(--background-light)] dark:bg-[var(--background-dark)]"
			position="sticky"
			isBordered={true}
			shouldHideOnScroll
		>
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit mr-4">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<p className="text-[var(--regular-text-dark)] text-lg bg-[var(--primary-accent-light)] dark:bg-[var(--primary-accent-dark)] px-3 py-1 rounded-lg">
							Cosmic Reach
						</p>
					</NextLink>
				</NavbarBrand>

				<div className="hidden md:flex gap-4 justify-start ml-2">
					{NavLinks.map((link) => {
						return (
							<React.Fragment key={link.name}>
								<NavLink href={link.href}>
									<p className="text-medium">{link.name}</p>
								</NavLink>
							</React.Fragment>
						);
					})}
				</div>
			</NavbarContent>

			<NavbarContent className="basis-1 pl-4" justify="end">
				<ThemeSwitch />
				<NavbarMenuToggle className="md:hidden text-[var(--regular-text-light)] dark:text-[var(--regular-text-dark)]" />
			</NavbarContent>

			<NavbarMenu className="bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
				<div className="mx-4 mt-2 flex flex-col gap-2">
					{NavMenuLinks.map((link) => {
						return (
							<React.Fragment key={link.name}>
								<NavMenuLink href={link.href}>
									<p className="text-lg">{link.name}</p>
								</NavMenuLink>
							</React.Fragment>
						);
					})}
				</div>
			</NavbarMenu>
		</NextUINavbar>
	);
};

// Wrapper for main navbar to show a loading skeleton when the actual navbar is still loading
const NavbarContainer = async () => {
	return (
		<>
			<Suspense fallback={<NavSkeleton />}>
				<Navbar />
			</Suspense>
		</>
	);
};

export { NavbarContainer };
