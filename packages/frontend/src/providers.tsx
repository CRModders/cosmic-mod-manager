import { DownloadAnimationProvider } from "@/components/download-ripple";
import { Toaster } from "@/components/ui/sonner";
import "@/src/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import SessionProvider from "./contexts/auth";
import { ThemeProvider } from "./hooks/use-theme";
import NotificationsProvider from "./pages/dashboard/notifications/context";

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
    return (
        <QueryClientProvider client={reactQueryClient}>
            <SessionProvider>
                <ThemeProvider>
                    <NotificationsProvider>
                        <DownloadAnimationProvider>{children ? children : <Outlet />}</DownloadAnimationProvider>
                    </NotificationsProvider>
                    <Toaster />
                </ThemeProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
};

export const Component = ContextProviders;
