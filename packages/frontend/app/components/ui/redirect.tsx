import { PageUrl } from "@root/utils/urls";
import { useEffect } from "react";

export default function Redirect({ to }: { to: string }) {
    useEffect(() => {
        window.location.href = new URL(PageUrl(to), window.location.href).href;
    }, []);

    return (
        <div className="w-full grid place-items-center py-8 gap-4">
            <span className="text-muted-foreground">Redirecting...</span>
        </div>
    );
}
