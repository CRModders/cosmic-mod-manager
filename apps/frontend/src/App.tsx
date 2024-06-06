import Navbar from "@/components/Navbar/navbar";
import ScrollToAnchor from "@/components/scroll-into-view";
import { Toaster } from "@/components/ui/toaster";
import "@/src/globals.css";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import Providers from "./providers";

export default function RootLayout() {
	return (
		<Providers>
			<Helmet>
				<title>CRMM</title>
				<meta name="description" content="A hosting platform for cosmic reach mods" />
			</Helmet>
			<Navbar />
			<main className="flex items-center justify-center container px-4 sm:px-8">
				<Outlet />
			</main>
			<Toaster />
			<ScrollToAnchor />
		</Providers>
	);
}
