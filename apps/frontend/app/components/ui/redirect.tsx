import { useEffect } from "react";
import { useTranslation } from "~/locales/provider";
import { addReturnURL } from "~/pages/auth/oauth-providers";
import { FormatUrl_WithHintLocale } from "~/utils/urls";
import { useNavigate } from "./link";

export default function Redirect({ to }: { to: string }) {
    const { t } = useTranslation();

    let url = to;
    if (url === "/login" || url === "/signup") url = addReturnURL(to, undefined, true);

    useEffect(() => {
        window.location.href = new URL(FormatUrl_WithHintLocale(url), window.location.href).href;
    }, []);

    return (
        <div className="w-full grid place-items-center py-8 gap-4">
            <span className="text-muted-foreground">{t.common.redirecting}</span>
        </div>
    );
}

export function SoftRedirect({ to }: { to: string }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        navigate(to);
    }, []);

    return (
        <div className="w-full grid place-items-center py-8 gap-4">
            <span className="text-muted-foreground">{t.common.redirecting}</span>
        </div>
    );
}
