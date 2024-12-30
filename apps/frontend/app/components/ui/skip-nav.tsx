import { useTranslation } from "~/locales/provider";

interface SkipNavProps {
    children?: React.ReactNode;
    mainId?: string;
}

export function SkipNav({ mainId, children }: SkipNavProps) {
    const { t } = useTranslation();
    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        const main = document.getElementById(mainId || "main");
        if (main) {
            main.tabIndex = -1;
            main.focus();
        }
    }

    return (
        <a
            href={`#${mainId || "main"}`}
            className="sr-only focus:not-sr-only text-foreground underline !w-fit !px-6 !py-0.5 rounded-md !absolute top-1 left-1 bg-background"
            onClick={handleClick}
        >
            {children ? children : t.navbar.skipToMainContent}
        </a>
    );
}
