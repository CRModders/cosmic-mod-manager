import { Button } from "@/components/ui/button";
import { SITE_NAME_LONG } from "@shared/config";
import { Helmet } from "react-helmet";

export default function ErrorView() {
    return (
        <>
            <Helmet>
                <title>! Error | {SITE_NAME_LONG}</title>
                <meta name="description" content="We're having issues loading the current page" />
            </Helmet>
            <div className="w-full full_page flex flex-col items-center justify-center gap-4">
                <div className="headings">
                    <h1 className="w-full text-5xl leading-tight font-bold flex items-center justify-center text-center">
                        Oops! Something went wrong
                    </h1>
                </div>
                <p className="text-lg dark:text-foreground-muted max-w-xl flex items-center justify-center text-center">
                    Seems like something broke, while we try to resolve the issue try refreshing the page.
                </p>

                <Button className="text-foreground" variant={"link"} aria-label="Refresh the page" onClick={() => window.location.reload()}>
                    <span className="text-lg">Refresh</span>
                </Button>
            </div>
        </>
    );
}
