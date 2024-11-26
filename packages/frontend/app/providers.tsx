import type { LoggedInUserData } from "@shared/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DownloadAnimationProvider } from "~/components/download-animation";
import { Toaster } from "~/components/ui/sonner";
import SessionProvider from "~/hooks/session";
import { ThemeProvider } from "~/hooks/theme";

export const reactQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            staleTime: 5000, // 5 seconds default stale time
        },
    },
});

interface ContextProvidersProps {
    children: React.ReactNode;
    session: LoggedInUserData | null;
}

export default function ContextProviders({ children, session }: ContextProvidersProps) {
    return (
        <QueryClientProvider client={reactQueryClient}>
            <SessionProvider session={session}>
                <ThemeProvider>
                    <DownloadAnimationProvider>
                        {children}
                        <Toaster />
                    </DownloadAnimationProvider>
                </ThemeProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
}
