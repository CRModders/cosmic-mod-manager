"use client";

import { StoreContext } from "@/contexts/StoreContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";

type NavLinkProps = {
	href: string;
	children: React.ReactNode;
	className?: string;
};

const Navlink = ({ children, href, className }: NavLinkProps) => {
	const pathname = usePathname();
	let isActive = pathname === href;
	if (href === "/") {
		if (pathname === "/") isActive = true;
		else isActive = false;
	}

	return (
		<Link
			href={href}
			className={cn(
				"text-foreground dark:text-foreground_dark data-[active=true]:text-foreground dark:data-[active=true]:text-foreground_dark data-[active=true]:font-semibold",
				className,
			)}
			data-active={isActive}
		>
			{children}
		</Link>
	);
};

export default Navlink;

export function NavMenuLink({ href, children, className }: NavLinkProps) {
	const { toggleNavMenu } = useContext(StoreContext);

	const pathname = usePathname();
	let isActive = pathname === href;
	if (href === "/") {
		if (pathname === "/") isActive = true;
		else isActive = false;
	}

	const CloseNavMenu = () => {
		toggleNavMenu(false);
	};

	return (
		<li
			key={`${href}`}
			className={`w-full flex items-center justify-center rounded-lg hover:bg-background_hover dark:hover:bg-background_hover_dark ${className}`}
		>
			<Link
				className="w-full h-full flex items-center justify-center text-foreground dark:text-foreground_dark dark:data-[active=true]:text-primary_accent data-[active=true]:text-primary_accent data-[active=true]:font-bold"
				color={"foreground"}
				href={href}
				data-active={isActive}
				onClick={CloseNavMenu}
			>
				{children}
			</Link>
		</li>
	);
}
