"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }) {
	return (
		<NextUIProvider>
			<NextThemeProvider attribute="class">{children}</NextThemeProvider>
		</NextUIProvider>
	);
}
