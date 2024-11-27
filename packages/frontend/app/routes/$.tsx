import { cn } from "@root/utils";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { VariantButtonLink } from "~/components/ui/link";

interface Props {
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    linkLabel?: string;
    linkHref?: string;
    className?: string;
}

export default function NotFoundPage({ className, title, description, linkHref, linkLabel }: Props) {
    return (
        <div className={cn("w-full full_page flex flex-col items-center justify-center", className)}>
            <div className="w-full flex flex-col items-center justify-center">
                <h1 className="w-full text-5xl leading-snug font-extrabold flex items-center justify-center text-center">
                    {title || "404 | Page not found."}
                </h1>
            </div>
            <p className="text-lg dark:text-foreground-muted max-w-xl flex items-center justify-center text-center">
                {description || "Sorry, we couldn't find the page you're looking for."}
            </p>

            <VariantButtonLink
                variant="link"
                url={linkHref || "/"}
                label={linkLabel || "Go to Home page"}
                className="mt-4 text-lg font-semibold"
            >
                {linkLabel || "Home"}
            </VariantButtonLink>
        </div>
    );
}

export function meta() {
    return MetaTags({
        title: "404 | Page not found.",
        description: "Sorry, we couldn't find the page you're looking for.",
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: Config.FRONTEND_URL,
    });
}
