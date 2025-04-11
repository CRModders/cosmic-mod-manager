import { DownloadAnimationProvider } from "@app/components/misc/download-animation";
import type { ThemeOptions } from "@app/components/types";
import { Toaster } from "@app/components/ui/sonner";
import { ThemeProvider } from "~/hooks/theme";
import { BreadcrumbsContextProvider } from "./hooks/breadcrumb";
import { CollectionsProvider } from "./pages/collection/provider";

interface ContextProvidersProps {
    children: React.ReactNode;
    theme: ThemeOptions;
}

export default function ContextProviders({ children, theme }: ContextProvidersProps) {
    return (
        <BreadcrumbsContextProvider>
            <ThemeProvider initTheme={theme}>
                <DownloadAnimationProvider>
                    <CollectionsProvider>{children}</CollectionsProvider>
                    <Toaster initTheme={theme} />
                </DownloadAnimationProvider>
            </ThemeProvider>
        </BreadcrumbsContextProvider>
    );
}
