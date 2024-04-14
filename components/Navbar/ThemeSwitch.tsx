"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@/components/Icons";
import { useEffect } from "react";
import "@/app/globals.css";
import { cn } from "@/lib/utils";

type Props = {
	className?: string;
	iconWrapperClassName?: string;
	label?: string;
};
export default function ThemeSwitch({ className, iconWrapperClassName, label }: Props) {
	const { theme, setTheme } = useTheme();

	const switchTheme = () => {
		if (theme === "dark") {
			setTheme("light");
		} else {
			setTheme("dark");
		}
	};

	const setInitialTheme = () => {
		if (theme !== "system") return;

		const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

		if (prefersDarkTheme) {
			setTheme("dark");
		} else {
			setTheme("light");
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		try {
			setInitialTheme();
		} catch (error) {}
	}, []);

	return (
		<div className="theme_switcher flex items-center justify-center">
			<button
				type="button"
				aria-label="Toggle theme"
				className={cn(
					"flex items-center overflow-hidden justify-center hover:bg-background_hover dark:hover:bg-background_hover_dark text-foreground dark:text-foreground_dark rounded-full",
					className,
				)}
				onClick={switchTheme}
			>
				<div className={cn("h-12 w-12 relative flex items-center justify-center", iconWrapperClassName)}>
					<div className="sun_icon_wrapper" data-hide-on-theme="light">
						<SunIcon size={"1.3rem"} />
					</div>

					<div className="moon_icon_wrapper" data-hide-on-theme="dark">
						<MoonIcon size={"1.3rem"} />
					</div>
				</div>
				{label && <p className="pr-4">{label}</p>}
			</button>
		</div>
	);
}
