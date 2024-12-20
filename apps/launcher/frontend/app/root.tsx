import LoaderBar from "@app/components/misc/loader-bar";
import { SuspenseFallback } from "@app/components/ui/spinner";
import { useEffect } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/root";
import Navbar from "./components/navbar";
import TitleBar from "./components/title-bar";
import { PathSegmentsContextProvider } from "./hooks/path-segments";
import "./index.css";

export const links: Route.LinksFunction = () => [
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark overflow-hidden rounded">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="antialiased bg-card-background rounded overflow-hidden">
                <div className="w-full h-[100vh] relative grid grid-cols-[auto_1fr]">
                    <PathSegmentsContextProvider>
                        <Navbar />
                        {children}
                    </PathSegmentsContextProvider>
                </div>

                <ScrollRestoration />
                <Scripts />
                <PreventResizeOnScrollbar />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <div className="grid grid-rows-[auto_1fr] overflow-y-auto">
            <TitleBar />

            <div
                className="grid grid-cols-[auto_1fr] bg-background rounded-tl-lg relative overflow-y-auto"
                style={{
                    // @ts-ignore
                    "-webkit-app-region": "no-drag",
                }}
            >
                <div>
                    <LoaderBar height={2.5} fixedPosition={false} />
                </div>

                <main className="px-4 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export function HydrateFallback() {
    return <SuspenseFallback />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}

function PreventResizeOnScrollbar() {
    function preventResizeNearScrollbar(e: UIEvent) {
        console.log(e.target);
        // const isNearScrollbar = window.innerWidth -  < 16;
    }

    useEffect(() => {
        window.addEventListener("resize", preventResizeNearScrollbar);

        return () => {
            window.removeEventListener("resize", preventResizeNearScrollbar);
        };
    }, []);

    return null;
}
