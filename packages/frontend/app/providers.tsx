import type { ThemeOptions } from "@root/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DownloadAnimationProvider } from "~/components/download-animation";
import { Toaster } from "~/components/ui/sonner";
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
    theme: ThemeOptions;
}

export default function ContextProviders({ children, theme }: ContextProvidersProps) {
    return (
        <QueryClientProvider client={reactQueryClient}>
            <ThemeProvider initTheme={theme}>
                <DownloadAnimationProvider>
                    {children}
                    <Toaster initTheme={theme} />
                </DownloadAnimationProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
