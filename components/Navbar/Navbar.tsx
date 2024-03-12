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
			className="fixed top-0 left-0 right-0 bg-[var(--background)]"
			position="sticky"
			isBordered={true}
			shouldHideOnScroll
		>
			<NavbarContent
				className="gap-8 w-fit basis-1/5 sm:basis-full"
				justify="start"
			>
				<NavbarBrand
					as="li"
					className="flex items-center justify-center max-w-fit"
				>
					<NextLink
						className="flex justify-start items-center gap-1 rounded-lg"
						href="/"
					>
						<p className="text-2xl font-semibold text-[var(--primary-accent-text)] px-3 h-10 flex items-center justify-center rounded-lg">
							Cosmic Reach
						</p>
					</NextLink>
				</NavbarBrand>

				<div className="hidden md:flex gap-2 justify-start">
					{NavLinks.map((link) => {
						return (
							<React.Fragment key={link.name}>
								<NavLink href={link.href} className="rounded-lg">
									<p className="text-lg px-2 py-1 h-10 flex items-center justify-center">
										{link.name}
									</p>
								</NavLink>
							</React.Fragment>
						);
					})}
				</div>
			</NavbarContent>

			<NavbarContent className="basis-1 pl-4" justify="end">
				<ThemeSwitch />
				<NavbarMenuToggle className="md:hidden text-[var(--regular-text)] hover:bg-[var(--background-hover)] h-10 w-10 rounded-lg" />
			</NavbarContent>

			<NavbarMenu className="bg-[var(--background)]">
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
