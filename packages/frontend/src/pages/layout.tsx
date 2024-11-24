import Navbar from "@/components/layout/Navbar/navbar";
import Footer from "@/components/layout/footer";
import { useEffect, useRef } from "react";
import { Outlet, ScrollRestoration, useNavigation } from "react-router";
import { toast } from "sonner";

import { DownloadRipple } from "@/components/download-ripple";
import { SITE_NAME_LONG, SITE_NAME_SHORT } from "@shared/config";
import { projectTypes } from "@shared/config/project";
import { Helmet } from "react-helmet";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";
import { FRONTEND_URL } from "../hooks/fetch";

export const RootLayout = () => {
    useEffect(() => {
        const currUrl = new URL(window.location.href);
        const announcement = currUrl.searchParams.get("announce");
        if (announcement) {
            toast(announcement);
        }
    }, []);

    const desc = `Download Cosmic Reach mods, plugins, datamods, shaders, resourcepacks, and modpacks on ${SITE_NAME_SHORT} (${SITE_NAME_LONG}). Discover and publish projects on ${SITE_NAME_SHORT} with a modern, easy to use interface and API.`;

    return (
        <>
            <Helmet>
                <title>{SITE_NAME_LONG}</title>
                <meta name="description" content={desc} data-react-helmet="true" />

                <meta property="og:title" content="Cosmic Reach Mod Manager - CRMM" />
                <meta property="og:url" content={FRONTEND_URL} />
                <meta property="og:description" content={desc} />
                <meta property="og:image" content={`${FRONTEND_URL}/icon.png`} />
            </Helmet>

            <NavigationLoadingBar />
            <ScrollRestoration />

            {/* A portal for the grid_bg_div inserted from the pages/page.tsx */}
            <div id="hero_section_bg_portal" className="absolute top-0 left-0 w-full" />

            <div className="w-full min-h-[100vh] relative grid grid-rows-[auto_1fr_auto]">
                <Navbar />

                <main className="full_page container px-4 sm:px-8">
                    <Outlet />
                </main>

                <Footer />
            </div>

            <DownloadRipple />
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
