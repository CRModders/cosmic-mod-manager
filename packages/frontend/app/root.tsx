import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { ThemeOptions } from "@root/types";
import { getCookie } from "@root/utils";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { SITE_NAME_LONG } from "@shared/config";
import globalStyles from "~/pages/globals.css?url";
import fontStyles from "~/pages/inter.css?url";
import ClientOnly from "./components/client-only";
import LoaderBar from "./components/loader-bar";
import { WanderingCubesSpinner } from "./components/ui/spinner";
import ErrorView from "./routes/error-view";

export function Layout({ children }: { children: React.ReactNode }) {
    const data = useLoaderData<typeof loader>();

    return (
        <html lang="en" className={data?.theme === ThemeOptions.LIGHT ? "light" : "dark"}>
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
    return (
        <>
            <ClientOnly Element={LoaderBar} />
            <Outlet />
        </>
    );
}

export function loader(props: LoaderFunctionArgs) {
    const theme = getCookie("theme", props.request.headers.get("Cookie") || "");

    return {
        theme,
    };
}

export function ErrorBoundary() {
    return <ErrorView />;
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
