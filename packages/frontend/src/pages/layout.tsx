import Navbar from "@/components/layout/Navbar/navbar";
import Footer from "@/components/layout/footer";
import { useEffect, useRef } from "react";
import { Outlet, ScrollRestoration, useNavigation } from "react-router-dom";
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
            <ScrollRestoration />

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

let previousPath: string | undefined = undefined;
let loadingStartPath: string | undefined = undefined;

export function NavigationLoadingBar() {
    const navigation = useNavigation();
    const ref = useRef<LoadingBarRef>(null);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        // ? These seemingly purposeless checks prevent showing the loader when the url has changed but the path hasn't actually changed
        // ? I myself don't know how this works, but it works :)
        const newPath = navigation.location?.pathname;

        if ((navigation.state === "loading" || navigation.state === "submitting") && newPath && previousPath !== newPath) {
            ref.current?.continuousStart();
            loadingStartPath = newPath;
        }

        if (navigation.state === "idle" && (loadingStartPath || !previousPath)) {
            ref.current?.complete();
            loadingStartPath = undefined;
        }

        if (newPath) previousPath = newPath;
    }, [navigation.location?.pathname]);

    return <LoadingBar ref={ref} color="#EE3A76" shadow={false} height={2.5} transitionTime={300} waitingTime={300} />;
}
