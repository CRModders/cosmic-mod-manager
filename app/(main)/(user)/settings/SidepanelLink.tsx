"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
	href: string;
	label: string;
	icon?: React.JSX.Element;
};

const SidepanelLink = ({ href, icon, label }: Props) => {
	const pathname = usePathname();
	let isActive = pathname === href;
	if (href === "/") {
		if (pathname === "/") isActive = true;
		else isActive = false;
	}

	return (
		<Link
			href={href}
			data-active={isActive}
			className="w-full px-4 py-2 relative flex items-center justify-start gap-1 rounded-lg hover:text-foreground dark:hover:text-foreground_dark text-foreground/60 dark:text-foreground_dark/60 data-[active=true]:text-foreground dark:data-[active=true]:text-foreground_dark hover:transition-colors hover:duration-default hover:bg-background_hover dark:hover:bg-background_hover_dark data-[active=true]:bg-background_hover/75 dark:data-[active=true]:bg-background_hover_dark overflow-hidden"
		>
			{isActive && (
				<div className="absolute top-[50%] left-0 translate-y-[-50%] h-full w-[0.4rem] bg-primary_accent dark:bg-primary_accent_dark" />
			)}
			<div className="w-6 h-6 flex items-center justify-start">{icon}</div>
			<p className="text-lg">{label}</p>
		</Link>
	);
};

export default SidepanelLink;
