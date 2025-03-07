import { DownloadAnimationProvider } from "@app/components/misc/download-animation";
import type { ThemeOptions } from "@app/components/types";
import { Toaster } from "@app/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "~/hooks/theme";
import { BreadcrumbsContextProvider } from "./hooks/breadcrumb";
import { CollectionsProvider } from "./pages/collection/provider";

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
            <BreadcrumbsContextProvider>
                <ThemeProvider initTheme={theme}>
                    <DownloadAnimationProvider>
                        <CollectionsProvider>{children}</CollectionsProvider>
                        <Toaster initTheme={theme} />
                    </DownloadAnimationProvider>
                </ThemeProvider>
            </BreadcrumbsContextProvider>
        </QueryClientProvider>
    );
}
