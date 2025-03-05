import { cn } from "@app/components/utils";
import { VariantButtonLink } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

interface Props {
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    linkLabel?: string;
    linkHref?: string;
    className?: string;
}

export default function NotFoundPage({ className, title, description, linkHref, linkLabel }: Props) {
    const { t } = useTranslation();

    return (
        <div className={cn("w-full full_page flex flex-col items-center justify-center", className)}>
            <div className="w-full flex flex-col items-center justify-center">
                <h1 className="w-full text-5xl leading-snug font-extrabold flex items-center justify-center text-center">
                    {title || t.error.pageNotFound}
                </h1>
            </div>
            <p className="text-lg dark:text-foreground-muted max-w-xl flex items-center justify-center text-center">
                {description || t.error.pageNotFoundDesc}
            </p>

            <VariantButtonLink variant="link" url={linkHref || "/"} label={linkLabel || t.common.home} className="mt-4 text-lg">
                {linkLabel || t.common.home}
            </VariantButtonLink>
        </div>
    );
}

export function meta() {
    return MetaTags({
        title: "404 | Page not found.",
        description: "Sorry, we couldn't find the page you're looking for.",
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL,
    });
}
