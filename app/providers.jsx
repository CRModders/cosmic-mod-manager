"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import Themes from "@/constants/themes";

export function Providers({ children }) {
	return (
		<NextUIProvider>
			<NextThemeProvider attribute="class" themes={Themes}>
				{children}
			</NextThemeProvider>
		</NextUIProvider>
	);
}
