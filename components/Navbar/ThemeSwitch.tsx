"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@/components/icons";

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
