import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import type { ThemeOptions } from "@root/types";
import { getCookie, getThemeFromCookie } from "@root/utils";
import clientFetch from "@root/utils/client-fetch";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { SITE_NAME_LONG } from "@shared/config";
import type { LoggedInUserData } from "@shared/types";
import { useEffect, useMemo } from "react";
import globalStyles from "~/pages/globals.css?url";
import fontStyles from "~/pages/inter.css?url";
import transitionStyles from "~/pages/transitions.css?url";
import ClientOnly from "./components/client-only";
import { DownloadRipple } from "./components/download-animation";
import Navbar from "./components/layout/Navbar/navbar";
import Footer from "./components/layout/footer";
import LoaderBar from "./components/loader-bar";
import ToastAnnouncer from "./components/toast-announcer";
import { WanderingCubesSpinner } from "./components/ui/spinner";
import ContextProviders from "./providers";
import ErrorView from "./routes/error-view";

export interface RootOutletData {
    theme: ThemeOptions;
    viewTransitions: boolean;
    session: LoggedInUserData | null;
}

export function Layout({ children }: { children: React.ReactNode }) {
    const data = useLoaderData<typeof loader>();

    return (
        <html lang="en" className={data?.theme}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="publisher" content="CRMM" />
                <meta name="theme-color" content="#F04570" />
                <meta name="color-scheme" content="dark light" />
                <meta property="og:logo" content="https://www.crmm.tech/icon.png" />
                <meta name="google-site-verification" content="saVDIhLaNSit_2LnqK9Zz-yxY2hMGTEC_Vud5v7-Tug" />
                <Meta />
                <Links />
                <script defer src="/telemetry.js" data-website-id="1bbb8989-cc84-4b4c-bfca-51e53779f587" data-exclude-search="true" />
            </head>
            <body className="antialiased">
                {children}

                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const data = useLoaderData<typeof loader>();

    return useMemo(
        () => (
            <ContextProviders theme={data.theme}>
                <ValidateClientSession />
                <ClientOnly Element={ToastAnnouncer} />
                <ClientOnly Element={ToastAnnouncer} />
                <ClientOnly Element={LoaderBar} />

                {/* A portal for the grid_bg_div inserted from the pages/page.tsx */}
                <div id="hero_section_bg_portal" className="absolute top-0 left-0 w-full" />

                <div className="w-full min-h-[100vh] relative grid grid-rows-[auto_1fr_auto]">
                    <Navbar session={data.session} notifications={[]} />

                    <div className="full_page container px-4 sm:px-8">
                        <Outlet context={data satisfies RootOutletData} />
                    </div>

                    <Footer />
                </div>

                <DownloadRipple />
            </ContextProviders>
        ),
        [],
    );
}

export async function loader({ request }: LoaderFunctionArgs) {
    const sessionRes = await serverFetch(request, "/api/auth/me");
    const session = await resJson(sessionRes);

    // Preferences
    const themePref = getCookie("theme", request.headers.get("Cookie") || "");
    const theme = getThemeFromCookie(themePref);

    const viewTransitions = getCookie("viewTransitions", request.headers.get("Cookie") || "") === "true";

    return {
        theme,
        viewTransitions,
        session: session as LoggedInUserData | null,
    };
}

export function shouldRevalidate() {
    return false;
}

export const links: LinksFunction = () => {
    return [
        {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossOrigin: "anonymous",
        },
        {
            rel: "preconnect",
            href: "https://api.crmm.tech",
        },
        {
            rel: "preconnect",
            href: "https://cdn.crmm.tech",
        },
        {
            rel: "icon",
            type: "image/png",
            href: "/icon.png",
        },
        {
            rel: "apple-touch-icon",
            type: "image/png",
            sizes: "180*180",
            href: "/icon.png",
        },
        {
            rel: "stylesheet",
            href: fontStyles,
        },
        {
            rel: "stylesheet",
            href: globalStyles,
        },
        {
            rel: "stylesheet",
            href: transitionStyles,
        },
    ];
};

export function meta() {
    return MetaTags({
        title: SITE_NAME_LONG,
        description:
            "Download Cosmic Reach mods, plugins, datamods, shaders, resourcepacks, and modpacks on CRMM (Cosmic Reach Mod Manager). Discover and publish projects on CRMM with a modern, easy to use interface and API.",
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: Config.FRONTEND_URL,
    });
}

export function HydrateFallback() {
    return <WanderingCubesSpinner />;
}

export function ErrorBoundary() {
    <ErrorView />;
}

function ValidateClientSession() {
    useEffect(() => {
        clientFetch("/api/auth/me");
    }, []);

    return null;
}
