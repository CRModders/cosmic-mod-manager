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

const LoginBtn = ({
	closeNavMenuOnLinkClick = true,
}: {
	closeNavMenuOnLinkClick?: boolean;
}) => {
	return (
		<NavMenuLink
			className="w-full flex items-center justify-center rounded-lg text-foreground dark:text-foreground_dark"
			href="/login"
			closeNavMenuOnLinkClick={closeNavMenuOnLinkClick}
		>
			<Button
				variant="outline"
				size="md"
				className="w-full"
				aria-label="Log In"
			>
				<p className="text-lg text-foreground dark:text-foreground_dark">
					Log In
				</p>
			</Button>
		</NavMenuLink>
	);
};

export default LoginBtn;
