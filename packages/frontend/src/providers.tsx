import { Toaster } from "@/components/ui/sonner";
import { SuspenseFallback } from "@/components/ui/spinner";
import "@/src/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Await, Outlet, useLoaderData } from "react-router-dom";
import AuthProvider from "./contexts/auth";
import { ThemeProvider } from "./hooks/use-theme";

export const reactQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            staleTime: 5000, // 5 seconds default stale time
        },
    },
});

export const ContextProviders = ({ children }: { children?: React.ReactNode }) => {
    const data = useLoaderData();

    return (
        <QueryClientProvider client={reactQueryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <Suspense fallback={<SuspenseFallback />}>
                        {/* @ts-ignore */}
                        <Await resolve={data?.data}>{children ? children : <Outlet />}</Await>
                    </Suspense>
                    <Toaster />
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export const Component = ContextProviders;
