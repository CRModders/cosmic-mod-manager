import { useEffect } from "react";
import { useNavigate } from "./link";

export default function Redirect({ to }: { to: string }) {
    const navigate = useNavigate();

    useEffect(() => {
        const url = new URL(to, window.location.href).href;
        navigate(url);
    }, []);

    return (
        <div className="w-full grid place-items-center py-8 gap-4">
            <span className="text-muted-foreground">Redirecting...</span>
        </div>
    );
}
