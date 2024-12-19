import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from "react-router";

import LoaderBar from "@app/components/misc/loader-bar";
import { SuspenseFallback } from "@app/components/ui/spinner";
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
        <html lang="en" className="dark">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="antialiased bg-card-background">
                <PathSegmentsContextProvider>
                    <div className="w-full h-[100vh] relative grid grid-cols-[auto_1fr]">
                        <Navbar />

                        <div className="grid grid-rows-[auto_1fr] overflow-y-auto">
                            <TitleBar />
                            {children}
                        </div>
                    </div>
                    <ScrollRestoration />
                    <Scripts />
                </PathSegmentsContextProvider>
            </body>
        </html>
    );
}

export default function App() {
    return (
        <main className="px-4 overflow-y-auto bg-background rounded-tl-lg relative">
            <Outlet />
            <LoaderBar height={2.75} />
        </main>
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
