import { cn } from "@app/components/utils";
import { useEffect } from "react";
import { VariantButtonLink } from "~/components/ui/link";
import usePathSegments from "~/hooks/path-segments";

interface Props {
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    linkLabel?: string;
    linkHref?: string;
    className?: string;
}

export default function NotFoundPage({ className, title, description, linkHref, linkLabel }: Props) {
    const { setSegments } = usePathSegments();

    useEffect(() => {
        setSegments([
            {
                label: "Home",
                href: "/",
            },
            {
                label: "404",
            },
        ]);
    }, []);

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

            <VariantButtonLink variant="link" url={linkHref || "/"} label={linkLabel || "Home"} className="mt-4 text-lg">
                {linkLabel || "Home"}
            </VariantButtonLink>
        </div>
    );
}
