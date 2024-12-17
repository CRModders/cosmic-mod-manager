import type { ThemeOptions } from "@root/types";
import { getCookie, getThemeFromCookie } from "@root/utils";
import clientFetch from "@root/utils/client-fetch";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { PageUrl, removeLeading, useUrlLocale } from "@root/utils/urls";
import { SITE_NAME_LONG } from "@shared/config";
import type { LoggedInUserData } from "@shared/types";
import { useEffect, useMemo } from "react";
import type { LinksFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, type ShouldRevalidateFunctionArgs, useLoaderData } from "react-router";
import globalStyles from "~/pages/globals.css?url";
import type { Route } from "./+types/root";
import ClientOnly from "./components/client-only";
import { DownloadRipple } from "./components/download-animation";
import Navbar from "./components/layout/Navbar/navbar";
import Footer from "./components/layout/footer";
import LoaderBar from "./components/loader-bar";
import ToastAnnouncer from "./components/toast-announcer";
import { formatLocaleCode, parseLocale } from "./locales";
import SupportedLocales, { DefaultLocale, GetLocaleMetadata } from "./locales/meta";
import type { LocaleMetaData } from "./locales/types";
import ContextProviders from "./providers";
import ErrorView from "./routes/error-view";

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
        <html
            lang={formatLocaleCode(data.locale)}
            dir={data.locale.dir}
            className={data?.theme}
            style={{ scrollBehavior: data?.viewTransitions ? "auto" : "smooth" }}
        >
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="publisher" content="CRMM" />
                <meta name="theme-color" content="#F04570" />
                <meta name="color-scheme" content="dark light" />
                <meta property="og:logo" content={`${Config.FRONTEND_URL}/icon.png`} />
                <meta name="google-site-verification" content="saVDIhLaNSit_2LnqK9Zz-yxY2hMGTEC_Vud5v7-Tug" />
                <style>
                    {`
                        @font-face {
                            font-family: Inter;
                            font-style: normal;
                            font-weight: 100 900;
                            font-display: swap;
                            src: url(https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff2) format("woff2");
                            unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F
                        }

                        @font-face {
                            font-family: Inter;
                            font-style: normal;
                            font-weight: 100 900;
                            font-display: swap;
                            src: url(https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7SUc.woff2) format("woff2");
                            unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116
                        }

                        @font-face {
                            font-family: Inter;
                            font-style: normal;
                            font-weight: 100 900;
                            font-display: swap;
                            src: url(https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7SUc.woff2) format("woff2");
                            unicode-range: U+1F00-1FFF
                        }

                        @font-face {
                            font-family: Inter;
                            font-style: normal;
                            font-weight: 100 900;
                            font-display: swap;
                            src: url(https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7SUc.woff2) format("woff2");
                            unicode-range: U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF
                        }

                        @font-face {
                            font-family: Inter;
                            font-style: normal;
                            font-weight: 100 900;
                            font-display: swap;
                            src: url(https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7SUc.woff2) format("woff2");
                            unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB
                        }

                        @font-face {
                            font-family: Inter;
                            font-style: normal;
                            font-weight: 100 900;
                            font-display: swap;
                            src: url(https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7SUc.woff2) format("woff2");
                            unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF
                        }

                        @font-face {
                            font-family: Inter;
                            font-style: normal;
                            font-weight: 100 900;
                            font-display: swap;
                            src: url(https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2) format("woff2");
                            unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD
                        }
                    `}
                </style>
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
        [data?.session, data?.viewTransitions],
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

export function ErrorBoundary() {
    return <ErrorView />;
}

function ValidateClientSession() {
    useEffect(() => {
        clientFetch("/api/auth/me");
    }, []);

    return null;
}
