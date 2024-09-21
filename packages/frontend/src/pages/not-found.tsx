import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE_NAME_SHORT } from "@shared/config";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

interface Props {
    title?: string;
    description?: string;
    linkLabel?: string;
    linkHref?: string;
    className?: string;
}

export default function NotFoundPage({ className, title, description, linkHref, linkLabel }: Props) {
    return (
        <>
            <Helmet>
                <title>
                    {title || "Page not found"} | {SITE_NAME_SHORT}
                </title>
                <meta name="description" content="We couldn't find the page you are looking for." />
            </Helmet>
            <div className={cn("w-full full_page flex flex-col items-center justify-center", className)}>
                <div className="w-full flex flex-col items-center justify-center">
                    <h1 className="w-full text-5xl leading-snug font-extrabold flex items-center justify-center text-center">
                        {title || "404 | Page not found."}
                    </h1>
                </div>
                <p className="text-lg dark:text-foreground-muted max-w-xl flex items-center justify-center text-center">
                    {description || "Sorry, we couldn't find the page you're looking for."}
                </p>

                <Link to={linkHref || "/"} className="mt-4">
                    <Button className="text-foreground" variant={"link"} aria-label={linkLabel || "Go to home page"} tabIndex={-1}>
                        <span className="text-lg">{linkLabel || "Home"}</span>
                    </Button>
                </Link>
            </div>
        </>
    );
}
