import { Navigate } from "react-router";
import ClientOnly from "../client-only";

export default function Redirect({ to }: { to: string }) {
    return <ClientOnly fallback={<RedirectFallback />} Element={() => <Navigate to={to} replace={true} />} />;
}

function RedirectFallback() {
    return (
        <div className="w-full grid place-items-center py-8 gap-4">
            <span className="text-muted-foreground">Redirecting...</span>
        </div>
    );
}
