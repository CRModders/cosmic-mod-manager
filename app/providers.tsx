"use client";
import StoreContextProvider from "@/contexts/StoreContext";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemeProvider attribute="class">
			<StoreContextProvider>
				<SessionProvider>{children}</SessionProvider>
			</StoreContextProvider>
		</NextThemeProvider>
	);
}
