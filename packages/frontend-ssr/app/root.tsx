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
import ContextProviders from "~/providers";
import ClientOnly from "./components/client-only";
import Footer from "./components/layout/footer";
import ToastAnnouncer from "./components/toast-announcer";
import { WanderingCubesSpinner } from "./components/ui/spinner";
import "./globals.css";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
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

                    <main className="full_page container px-4 sm:px-8">
                        <Outlet
                            context={
                                {
                                    session: session,
                                } satisfies RootOutletData
                            }
                        />
                    </main>

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
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossOrigin: "anonymous",
        },
        {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?&family=Inter:wght@100..900&display=swap",
        },
        {
            rel: "preconnect",
            href: "https://api.crmm.tech",
        },
        {
            rel: "preconnect",
            href: "https://crmm-cdn.global.ssl.fastly.net",
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
