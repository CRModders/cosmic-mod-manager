"use client";

import { NavbarItem, NavbarMenuItem } from "@nextui-org/navbar";
import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import React from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import "@/app/globals.css";

type NavLinkProps = {
	href: string;
	children: React.ReactNode;
	className?: string;
};

const NavLink = ({ href, children, className }: NavLinkProps) => {
	const pathname = usePathname();
	let isActive = pathname === href;
	if (href === "/") {
		if (pathname === "/") isActive = true;
		else isActive = false;
	}

	return (
		<NavbarItem className={className}>
			<NextLink
				className={clsx(
					linkStyles({ color: "foreground" }),
					"data-[active=true]:text-[var(--primary-accent-text)] data-[active=true]:font-semibold rounded-sm focus-visible:outline-2 outline-0 outline-[var(--regular-text)] no-underline",
				)}
				color="foreground"
				href={href}
				data-active={isActive}
			>
				{children}
			</NextLink>
		</NavbarItem>
	);
};

export function NavMenuLink({ href, children, className }: NavLinkProps) {
	const pathname = usePathname();
	let isActive = pathname === href;
	if (href === "/") {
		if (pathname === "/") isActive = true;
		else isActive = false;
	}

	return (
		<NavbarMenuItem
			key={`${href}`}
			className={`w-full flex items-center justify-center hover:bg-[var(--background-hover)] rounded-lg ${className}`}
		>
			<Link
				className={clsx(
					linkStyles({ color: "foreground" }),
					"data-[active=true]:text-[var(--primary-accent)] data-[active=true]:font-semibold w-full h-full flex items-center justify-center py-2 ",
				)}
				color={"foreground"}
				href={href}
				size="lg"
				data-active={isActive}
			>
				{children}
			</Link>
		</NavbarMenuItem>
	);
}

export default NavLink;
