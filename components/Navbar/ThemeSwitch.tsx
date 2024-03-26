//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 

"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@/components/Icons";

export default function ThemeSwitch() {
	const { theme, setTheme } = useTheme();

	const switchTheme = () => {
		if (theme === "dark") {
			setTheme("light");
		} else {
			setTheme("dark");
		}
	};

	return (
		<div className="theme_switcher flex items-center justify-center">
			<button
				type="button"
				aria-label="Toggle theme"
				className="hover:bg-background_hover dark:hover:bg-background_hover_dark text-foreground dark:text-foreground_dark flex items-center justify-center h-12 w-12 rounded-full"
				onClick={switchTheme}
			>
				<div className="sun_icon_wrapper" data-hide-on-theme="light">
					<SunIcon size={"1.3rem"} />
				</div>
				<div className="sun_icon_wrapper" data-hide-on-theme="dark">
					<MoonIcon size={"1.3rem"} />
				</div>
			</button>
		</div>
	);
}
