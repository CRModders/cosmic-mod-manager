import { Toaster } from "@/components/ui/sonner";
import "@/src/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const ContextProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={reactQueryClient}>
            <AuthProvider>
                <ThemeProvider>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default ContextProviders;
