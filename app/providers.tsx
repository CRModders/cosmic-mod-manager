//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

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
