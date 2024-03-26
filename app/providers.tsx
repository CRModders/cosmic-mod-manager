import StoreContextProvider from "@/contexts/StoreContext";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";

const LoaderColor = "#f43f5e";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemeProvider attribute="class">
			<StoreContextProvider>
				<SessionProvider>
					<NextTopLoader
						color={LoaderColor}
						shadow={`0 0 12px 2px ${LoaderColor},0 0 8px 1px ${LoaderColor}`}
						showSpinner={false}
						height={2}
						crawlSpeed={300}
						speed={300}
						initialPosition={0.3}
					/>
					{children}
				</SessionProvider>
			</StoreContextProvider>
		</NextThemeProvider>
	);
}
