//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import React from "react";
import { Button } from "@/components/ui/button";
import { NavMenuLink } from "../Navlink";
import { cn } from "@/lib/utils";

const LoginBtn = ({
	className,
	size = "md",
	closeNavMenuOnLinkClick = true,
}: {
	className?: string;
	size?: "sm" | "md" | "lg";
	closeNavMenuOnLinkClick?: boolean;
}) => {
	return (
		<NavMenuLink
			className={cn(
				"w-full flex items-center justify-center rounded-lg text-foreground dark:text-foreground_dark",
				className,
			)}
			href="/login"
			closeNavMenuOnLinkClick={closeNavMenuOnLinkClick}
		>
			<Button variant="outline" size={size} className="w-full link_bg_transition" aria-label="Log In">
				<p className="text-lg text-foreground dark:text-foreground_dark">Log In</p>
			</Button>
		</NavMenuLink>
	);
};

export default LoginBtn;
