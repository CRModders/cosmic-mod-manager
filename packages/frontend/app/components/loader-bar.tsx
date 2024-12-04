import { useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import LoadingBar, { type LoadingBarRef } from "~/components/rtk-loading-indicator";

let timeoutRef: number | undefined = undefined;
let loaderStarted = false;

function LoaderBar() {
    const navigation = useNavigation();
    const ref = useRef<LoadingBarRef>(null);

    function loadingStart() {
        ref.current?.staticStart(99.99);
        loaderStarted = true;
    }

    function loadingEnd() {
        if (!loaderStarted) return;

        ref.current?.complete();
        loaderStarted = false;
    }

    function handleAjaxRequest() {
        const requestProcessing = document.documentElement.classList.contains("disable-interactions");
        if (timeoutRef) window.clearTimeout(timeoutRef);
        if (navigation.state !== "idle") return;

        if (requestProcessing) {
            if (loaderStarted) loadingEnd();
            timeoutRef = window.setTimeout(loadingStart, 100);
        }

        if (!requestProcessing && loaderStarted) loadingEnd();
    }

    useEffect(() => {
        if (timeoutRef) window.clearTimeout(timeoutRef);

        if (navigation.state === "loading" || navigation.state === "submitting") {
            timeoutRef = window.setTimeout(loadingStart, 100);
        }

        if (navigation.state === "idle") loadingEnd();
    }, [navigation.location?.pathname]);

    useEffect(() => {
        const observer = new MutationObserver(handleAjaxRequest);
        observer.observe(document.documentElement, { attributeFilter: ["class"] });

        return () => observer.disconnect();
    }, []);

    return (
        <LoadingBar
            ref={ref}
            className="!bg-gradient-to-r from-accent-background/85 to-accent-background"
            loaderSpeed={1200}
            shadow={true}
            height={2.25}
            transitionTime={350}
            waitingTime={250}
        />
    );
}

export default LoaderBar;
