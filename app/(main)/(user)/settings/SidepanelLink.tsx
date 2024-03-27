//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 

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
			className="w-full px-4 py-2 relative flex items-center justify-start gap-1 rounded-lg hover:text-foreground dark:hover:text-foreground_dark text-foreground/60 dark:text-foreground_dark/60 data-[active=true]:text-foreground dark:data-[active=true]:text-foreground_dark transition-colors hover:bg-background_hover dark:hover:bg-background_hover_dark data-[active=true]:bg-background_hover/75 dark:data-[active=true]:bg-background_hover_dark overflow-hidden"
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
