import { Toaster } from "@/components/ui/sonner";
import "@/src/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./contexts/auth";
import { ThemeProvider } from "./hooks/use-theme";

const reactQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
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
