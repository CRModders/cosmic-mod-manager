import { DownloadRipple } from "@app/components/misc/download-animation";
import LoaderBar from "@app/components/misc/loader-bar";
import type { ThemeOptions } from "@app/components/types";
import { SITE_NAME_LONG } from "@app/utils/config";
import { getCookie, getThemeFromCookie } from "@app/utils/cookie";
import type { LoggedInUserData } from "@app/utils/types";
import { useEffect } from "react";
import type { LinksFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, type ShouldRevalidateFunctionArgs, useLoaderData } from "react-router";
import ClientOnly from "~/components/client-only";
import Navbar from "~/components/layout/Navbar/navbar";
import Footer from "~/components/layout/footer";
import ToastAnnouncer from "~/components/toast-announcer";
import SupportedLocales, { DefaultLocale, GetLocaleMetadata } from "~/locales/meta";
import type { LocaleMetaData } from "~/locales/types";
import ContextProviders from "~/providers";
import ErrorView from "~/routes/error-view";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import { PageUrl, removeLeading, useUrlLocale } from "~/utils/urls";
import type { Route } from "./+types/root";
import { PageBreadCrumbs } from "./hooks/breadcrumb";
import indexCss from "./index.css?url";
import { formatLocaleCode, parseLocale } from "./locales";

export interface RootOutletData {
    theme: ThemeOptions;
    viewTransitions: boolean;
    session: LoggedInUserData | null;
    locale: LocaleMetaData;
    supportedLocales: LocaleMetaData[];
    defaultLocale: LocaleMetaData;
}

export function Layout({ children }: { children: React.ReactNode }) {
    const data = useLoaderData() as RootOutletData;

    return (
        <html lang={formatLocaleCode(data.locale)} className={data?.theme}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="publisher" content="CRMM" />
                <meta name="theme-color" content="#F04570" />
                <meta name="color-scheme" content="dark light" />
                <meta property="og:logo" content={`${Config.FRONTEND_URL}/icon.png`} />
                <meta name="google-site-verification" content="saVDIhLaNSit_2LnqK9Zz-yxY2hMGTEC_Vud5v7-Tug" />
                <Meta />
                <Links />
                <script
                    defer
                    src="/telemetry.js"
                    data-website-id="1bbb8989-cc84-4b4c-bfca-51e53779f587"
                    data-exclude-search="true"
                    data-exclude-hash="true"
                />
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
    const data = useLoaderData() as RootOutletData;

    return (
        <ContextProviders theme={data.theme}>
            <ValidateClientSession />
            <ClientOnly Element={ToastAnnouncer} />
            <ClientOnly Element={ToastAnnouncer} />
            <ClientOnly Element={LoaderBar} />

            {/* A portal for the grid_bg_div inserted from the pages/page.tsx */}
            <div id="hero_section_bg_portal" className="absolute top-0 left-0" />

            <div className="w-full min-h-[100vh] relative grid grid-rows-[auto_1fr_auto]">
                <Navbar session={data.session} notifications={[]} />

                <PageBreadCrumbs />

                <div className="full_page container px-4 sm:px-8">
                    <Outlet context={data satisfies RootOutletData} />
                </div>

                <Footer />
            </div>

            <DownloadRipple />
        </ContextProviders>
    );
}

export async function loader({ request }: Route.LoaderArgs): Promise<RootOutletData> {
    const reqUrl = new URL(request.url);
    let session: LoggedInUserData | null = null;
    const cookie = request.headers.get("Cookie") || "";

    if (getCookie("auth-token", cookie)?.length) {
        const sessionRes = await serverFetch(request, "/api/auth/me");
        session = await resJson<LoggedInUserData>(sessionRes);

        if (!session?.id) session = null;
    }

    // Preferences
    const themePref = getCookie("theme", cookie);
    const theme = getThemeFromCookie(themePref);
    const viewTransitions = getCookie("viewTransitions", cookie) === "true";

    const urlLocalePrefix = useUrlLocale(true, reqUrl.pathname);
    const urlLocale = GetLocaleMetadata(parseLocale(urlLocalePrefix)) || DefaultLocale;
    const cookieLocale = GetLocaleMetadata(parseLocale(getCookie("locale", cookie) || "")) || DefaultLocale;

    let currLocale = urlLocale;
    if (!urlLocalePrefix) {
        currLocale = cookieLocale;
    }

    // If there's no lang prefix and user has a non default localse set, redirect to the url with user's locale prefix
    if (!urlLocalePrefix.length && formatLocaleCode(cookieLocale) !== formatLocaleCode(urlLocale)) {
        const localeFormattedPath = PageUrl(reqUrl.pathname, undefined, formatLocaleCode(currLocale));
        const redirectUrl = new URL(localeFormattedPath, Config.FRONTEND_URL);
        throw Response.redirect(redirectUrl, 302);
    }

    // If the url prefix is same as the default and the user's set locale is the same as the default,
    // redirect to the url without the default locale prefix
    if (urlLocalePrefix === formatLocaleCode(DefaultLocale) && urlLocalePrefix === formatLocaleCode(cookieLocale)) {
        const pathWithoutDefaultLocale = removeLeading("/", reqUrl.pathname).replace(formatLocaleCode(DefaultLocale), "");
        const redirectUrl = new URL(pathWithoutDefaultLocale, Config.FRONTEND_URL);
        throw Response.redirect(redirectUrl, 302);
    }

    return {
        theme,
        viewTransitions,
        session: session as LoggedInUserData | null,
        locale: currLocale,
        supportedLocales: SupportedLocales,
        defaultLocale: DefaultLocale,
    };
}

export function shouldRevalidate({ nextUrl }: ShouldRevalidateFunctionArgs) {
    const revalidate = nextUrl.searchParams.get("revalidate") === "true";

    if (revalidate) return true;
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
            href: indexCss,
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

export function ErrorBoundary() {
    return <ErrorView />;
}

function ValidateClientSession() {
    useEffect(() => {
        clientFetch("/api/auth/me");
    }, []);

    return null;
}
