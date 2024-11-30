import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, type ShouldRevalidateFunctionArgs, useLoaderData } from "@remix-run/react";
import type { ThemeOptions } from "@root/types";
import { getCookie, getThemeFromCookie } from "@root/utils";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import type { LoggedInUserData } from "@shared/types";
import { useMemo } from "react";
import ClientOnly from "~/components/client-only";
import { DownloadRipple } from "~/components/download-animation";
import Navbar from "~/components/layout/Navbar/navbar";
import Footer from "~/components/layout/footer";
import ToastAnnouncer from "~/components/toast-announcer";
import { WanderingCubesSpinner } from "~/components/ui/spinner";
import ContextProviders from "~/providers";
import ErrorView from "./error-view";

export interface RootOutletData {
    theme: ThemeOptions;
    session: LoggedInUserData | null;
}

export default function RootData() {
    const { session, theme } = useLoaderData<typeof loader>();

    return useMemo(
        () => (
            <ContextProviders theme={theme}>
                <ClientOnly Element={ToastAnnouncer} />

                {/* A portal for the grid_bg_div inserted from the pages/page.tsx */}
                <div id="hero_section_bg_portal" className="absolute top-0 left-0 w-full" />

                <div className="w-full min-h-[100vh] relative grid grid-rows-[auto_1fr_auto]">
                    <Navbar session={session} notifications={[]} />

                    <div className="full_page container px-4 sm:px-8">
                        <Outlet
                            context={
                                {
                                    session: session,
                                    theme: theme,
                                } satisfies RootOutletData
                            }
                        />
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
    const themePref = getCookie("theme", request.headers.get("Cookie") || "");
    const theme = getThemeFromCookie(themePref);

    return {
        theme,
        session: session as LoggedInUserData | null,
    };
}

export function shouldRevalidate({ nextUrl }: ShouldRevalidateFunctionArgs) {
    const revalidate = nextUrl.searchParams.get("revalidate") === "true";

    if (revalidate) return true;
    return false;
}

export function HydrateFallback() {
    return <WanderingCubesSpinner />;
}

export function ErrorBoundary() {
    return <ErrorView />;
}
