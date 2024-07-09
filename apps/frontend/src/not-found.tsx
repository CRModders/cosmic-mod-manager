import { title } from "@/components/titles";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <>
            <Helmet>
                <title>Page not found | CRMM</title>
                <meta name="description" content="We couldn't find the page you are looking for." />
            </Helmet>
            <div className="w-full min-h-[100vh] flex flex-col items-center justify-center gap-4">
                <div className="headings">
                    <h1 className={`${title()} w-full flex items-center justify-center text-center`}>
                        404 | Page not found.
                    </h1>
                </div>
                <p className="text-lg dark:text-foreground-muted max-w-xl flex items-center justify-center text-center">
                    Sorry, we couldn't find the page you're looking for.
                </p>

                <Link to="/" className="mt-4">
                    <Button className="text-foreground" variant={"link"} aria-label="Go to home page">
                        <span className="text-lg">Home</span>
                    </Button>
                </Link>
            </div>
        </>
    );
}
