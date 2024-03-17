import "./globals.css";
import { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import { Suspense } from "react";
import NavbarWrapper from "@/components/Navbar/Navbar";
import { cn } from "@/lib/utils";

const space_grotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Cosmic reach mod manager",
		template: "%s - Cosmic reach mod manager",
	},
	description: "A marketplace featuring all the mods for Cosmic reach",
};

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body
				className={cn(
					"bg-background dark:bg-background_dark text-foreground dark:text-foreground_dark",
					space_grotesk.className,
				)}
			>
				<Suspense fallback={<p>Loading...</p>}>
					<Providers>
						<NavbarWrapper />
						<Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
					</Providers>
				</Suspense>
			</body>
		</html>
	);
}
