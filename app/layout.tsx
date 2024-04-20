//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import Footer from "@/components/Footer/Footer";
import NavbarWrapper from "@/components/Navbar/Navbar";
import LoadingUI from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/toaster";
import ValidateSession from "@/components/validateLocalSession/validateSession";
import { siteTitle } from "@/config";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";

const varela_round = Varela_Round({
	weight: ["400"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: siteTitle,
		template: `%s - ${siteTitle}`,
	},
	description: "A marketplace featuring all the mods for Cosmic reach",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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
					<div className="w-full flex flex-col items-center justify-between min-h-[100vh]">
						<NavbarWrapper />
						<Suspense fallback={<LoadingUI iconSize={"2.25rem"} />}>
							<main className="container flex items-center justify-center px-4 sm:px-8 font-[inherit]">{children}</main>

							<Footer />
						</Suspense>
					</div>
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
