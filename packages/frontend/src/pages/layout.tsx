import Navbar from "@/components/layout/Navbar/navbar";
import Footer from "@/components/layout/footer";
import { useEffect, useRef } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { toast } from "sonner";

import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

export const RootLayout = () => {
    useEffect(() => {
        const currUrl = new URL(window.location.href);
        const announcement = currUrl.searchParams.get("announce");
        if (announcement) {
            toast(announcement);
        }
    }, []);

    return (
        <>
            <NavigationLoadingBar />

            {/* A portal for the grid_bg_div inserted from the pages/page.tsx */}
            <div id="hero_section_bg_portal" className="absolute top-0 left-0 w-full" />

            <div className="w-full min-h-[100vh] relative grid grid-rows-[auto_1fr_auto]">
                <Navbar />
                <div className="full_page container px-4 sm:px-8">
                    <Outlet />
                </div>

                <Footer />
            </div>
        </>
    );
};

export const Component = RootLayout;

export function NavigationLoadingBar() {
    const navigation = useNavigation();
    const ref = useRef<LoadingBarRef>(null);

    useEffect(() => {
        if (navigation.state === "loading" || navigation.state === "submitting") {
            ref.current?.continuousStart();
        }

        if (navigation.state === "idle") {
            ref.current?.complete();
        }
    }, [navigation.state]);

    return <LoadingBar ref={ref} color="#EE3A76" shadow={false} height={2.5} transitionTime={300} waitingTime={300} />;
}
