import Navbar from "@/components/Navbar/navbar";
import { Toaster } from "@/components/ui/toaster";
import "@/src/globals.css";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import Providers from "./providers";
import ScrollToHashElement from "@/components/scroll-to-hash-elem";

export default function RootLayout() {
    return (
        <Providers>
            <Helmet>
                <title>CRMM</title>
                <meta name="description" content="A hosting platform for cosmic reach mods" />
            </Helmet>
            {/* A portal for the grid_bg_div inserted from the home.tsx */}
            <div id="hero_section_bg_portal" className="absolute top-0 left-0 w-full" />
            <Navbar />
            <main className="flex items-center justify-center container px-3 sm:px-8 relative">
                <Outlet />
            </main>
            <Toaster />
            <ScrollToHashElement />
        </Providers>
    );
}
