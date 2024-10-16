import Navbar from "@/components/layout/Navbar/navbar";
import Footer from "@/components/layout/footer";
import { useEffect, useRef } from "react";
import { Outlet, ScrollRestoration, useNavigation } from "react-router-dom";
import { toast } from "sonner";

import { projectTypes } from "@shared/config/project";
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

const noConsecutiveLoadersOnPaths: string[] = [...projectTypes.map((type) => `/${type}s`), "/projects"];
let prevPath: string | undefined = undefined;
let prevAction: string | undefined = undefined;

export function NavigationLoadingBar() {
    const navigation = useNavigation();
    const ref = useRef<LoadingBarRef>(null);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        // ? These seemingly purposeless checks prevent showing the loader when the url has changed but the path hasn't actually changed
        // ? I myself don't know how this works, but it works :)
        const navigatedTo = navigation.location?.pathname;

        if (
            (navigation.state === "loading" || navigation.state === "submitting") &&
            (navigatedTo !== prevPath || !noConsecutiveLoadersOnPaths.includes(navigatedTo || ""))
        ) {
            ref.current?.continuousStart();
            prevAction = "start";
        }

        if (navigation.state === "idle" && (prevAction === "start" || !prevAction)) {
            ref.current?.complete();
            prevAction = "complete";
        }

        prevPath = navigatedTo || window.location.pathname;
    }, [navigation.location?.pathname]);

    return <LoadingBar ref={ref} color="#EE3A76" shadow={false} height={2.5} transitionTime={300} waitingTime={300} />;
}
