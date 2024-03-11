"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "../Icons";

export default function ThemeSwitch({ themeName }) {
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
				className="hover:bg-[var(--background-hover-light)] hover:dark:bg-[var(--background-hover-dark)] flex items-center justify-center p-2 rounded-full"
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
