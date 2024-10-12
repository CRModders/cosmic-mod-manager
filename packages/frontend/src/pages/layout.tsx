import Navbar from "@/components/layout/Navbar/navbar";
import Footer from "@/components/layout/footer";
import ContextProviders from "@/src/providers";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";

const RootLayout = () => {
    useEffect(() => {
        const currUrl = new URL(window.location.href);
        const announcement = currUrl.searchParams.get("announce");
        if (announcement) {
            toast(announcement);
        }
    }, []);

    return (
        <ContextProviders>
            {/* A portal for the grid_bg_div inserted from the pages/page.tsx */}
            <div id="hero_section_bg_portal" className="absolute top-0 left-0 w-full" />

            <div className="w-full min-h-[100vh] relative grid grid-rows-[auto_1fr_auto]">
                <Navbar />
                <div className="full_page container px-4 sm:px-8">
                    <Outlet />
                </div>

                <Footer />
            </div>
        </ContextProviders>
    );
};

export default RootLayout;
