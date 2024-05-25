import type React from "react";
import { CookiesProvider } from "react-cookie";
import AuthProvider from "./auth-provider";
import ThemeProvider from "./theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<CookiesProvider>
			<AuthProvider>
				<ThemeProvider>{children}</ThemeProvider>
			</AuthProvider>
		</CookiesProvider>
	);
};

export default Providers;
