//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { auth_locale } from "@/public/locales/interface";
import { NavMenuLink } from "../Navlink";

const LoginBtn = ({
	className,
	btnClassName,
	size = "md",
	closeNavMenuOnLinkClick = true,
	authLocale,
}: {
	className?: string;
	btnClassName?: string;
	size?: "sm" | "md" | "lg";
	closeNavMenuOnLinkClick?: boolean;
	authLocale: auth_locale;
}) => {
	return (
		<NavMenuLink
			className={cn(
				"w-full flex items-center justify-center rounded-lg text-foreground dark:text-foreground_dark link_bg_transition",
				className,
			)}
			href="/login"
			label={authLocale.login}
			closeNavMenuOnLinkClick={closeNavMenuOnLinkClick}
		>
			<Button
				tabIndex={-1}
				variant="outline"
				size={size}
				className={cn("w-full navlink_text hover:bg-transparent dark:hover:bg-transparent text-lg", btnClassName)}
				aria-label={authLocale.login}
			>
				{authLocale.login}
			</Button>
		</NavMenuLink>
	);
};

export default LoginBtn;
