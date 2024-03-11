"use client";

import { useTheme } from "next-themes";

const ThemeChangerButton = ({ themeName }) => {
	const { setTheme } = useTheme();

	return (
		<div>
			<button
				type="button"
				data-hide-on-theme={themeName}
				onClick={() => {
					setTheme(themeName);
				}}
			>
				{themeName} Theme
			</button>
		</div>
	);
};

export { ThemeChangerButton };
