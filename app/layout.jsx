import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar/navbar";

const space_grotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata = {
	title: "Cosmic reach mods marketplace",
	description: "A marketplace featuring all the mods for Cosmic reach",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body className={space_grotesk.className}>
				<Providers>
					<Navbar />
					{children}
				</Providers>
			</body>
		</html>
	);
}
