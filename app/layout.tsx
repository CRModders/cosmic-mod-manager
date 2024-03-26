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
