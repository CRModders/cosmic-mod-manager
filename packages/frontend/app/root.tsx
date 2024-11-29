import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, type ShouldRevalidateFunctionArgs, useLoaderData } from "@remix-run/react";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { SITE_NAME_LONG } from "@shared/config";
import type { LoggedInUserData } from "@shared/types";
import { useMemo } from "react";
import { DownloadRipple } from "~/components/download-animation";
import Navbar from "~/components/layout/Navbar/navbar";
import LoaderBar from "~/components/loader-bar";
import "~/pages/globals.css";
import "~/pages/inter.css";
import ContextProviders from "~/providers";
import ClientOnly from "./components/client-only";
import Footer from "./components/layout/footer";
import ToastAnnouncer from "./components/toast-announcer";
import { WanderingCubesSpinner } from "./components/ui/spinner";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
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

export interface RootOutletData {
    session: LoggedInUserData | null;
}

export default function App() {
    const { session } = useLoaderData<typeof loader>();

    return useMemo(
        () => (
            <ContextProviders session={session}>
                <ClientOnly Element={LoaderBar} />
                <ClientOnly Element={ToastAnnouncer} />

                {/* A portal for the grid_bg_div inserted from the pages/page.tsx */}
                <div id="hero_section_bg_portal" className="absolute top-0 left-0 w-full" />

                <div className="w-full min-h-[100vh] relative grid grid-rows-[auto_1fr_auto]">
                    <Navbar />

                    <div className="full_page container px-4 sm:px-8">
                        <Outlet
                            context={
                                {
                                    session: session,
                                } satisfies RootOutletData
                            }
                        />
                    </div>

                    <Footer />
                </div>

                <DownloadRipple />
            </ContextProviders>
        ),
        [session?.id],
    );
}

export async function loader({ request }: LoaderFunctionArgs) {
    const sessionRes = await serverFetch(request, "/api/auth/me");
    const session = await resJson(sessionRes);

    return {
        session: session as LoggedInUserData | null,
    };
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
            type: "image/svg+xml",
            href: "/icon.png",
        },
        {
            rel: "apple-touch-icon",
            sizes: "180*180",
            href: "/icon.png",
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

export function shouldRevalidate({ nextUrl }: ShouldRevalidateFunctionArgs) {
    const revalidate = nextUrl.searchParams.get("revalidate") === "true";

    if (revalidate) return true;
    return false;
}

export function HydrateFallback() {
    return <WanderingCubesSpinner />;
}
