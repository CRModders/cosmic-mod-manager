//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 

import "./globals.css";
import { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import { Providers } from "./providers";
import { Suspense } from "react";
import NavbarWrapper from "@/components/Navbar/Navbar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import ValidateSession from "@/components/validateLocalSession/validateSession";
import { SpeedInsights } from "@vercel/speed-insights/next";

const varela_round = Varela_Round({
	weight: ["400"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Cosmic reach mod manager",
		template: "%s - Cosmic reach mod manager",
	},
	description: "A marketplace featuring all the mods for Cosmic reach",
};

export default async function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body
				className={cn(
					"bg-background dark:bg-background_dark text-foreground dark:text-foreground_dark",
					varela_round.className,
				)}
			>
				<Suspense>
					<ValidateSession />
				</Suspense>

				<Providers>
					<NavbarWrapper />

					<main className="container flex items-center justify-center px-4 sm:px-8 font-[inherit]">
						{children}
					</main>

					<Suspense>
						<Toaster />
					</Suspense>
					<Suspense>
						<SpeedInsights />
					</Suspense>
				</Providers>
			</body>
		</html>
	);
}
