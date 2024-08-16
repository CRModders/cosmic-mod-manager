import ContextProviders from "@/src/providers";
import { Suspense, lazy, useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
const Navbar = lazy(() => import("@/components/layout/Navbar/navbar"));

const RootLayout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const announcement = searchParams.get("announce");
        if (announcement) {
            toast(announcement);

            const url = new URL(window.location.href);
            url.searchParams.delete("announce");
            navigate(url.href.replace(url.origin, ""));
        }
    }, [searchParams]);

    return (
        <ContextProviders>
            {/* A portal for the grid_bg_div inserted from the pages/page.tsx */}
            <div id="hero_section_bg_portal" className="absolute top-0 left-0 w-full" />

            <div className="w-full relative">
                <Suspense fallback={<div className="w-full flex items-center justify-center h-10 py-2">LOADING...</div>}>
                    <Navbar />
                </Suspense>
                <div className="full_page container px-4 sm:px-8">
                    <Outlet />
                </div>
            </div>
        </ContextProviders>
    );
};

export default RootLayout;
