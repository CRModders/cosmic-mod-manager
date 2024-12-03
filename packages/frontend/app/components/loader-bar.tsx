import { useNavigation } from "@remix-run/react";
import { projectTypes } from "@shared/config/project";
import { useEffect, useRef } from "react";
import LoadingBar, { type LoadingBarRef } from "~/components/rtk-loading-indicator";

const noConsecutiveLoaders: string[] = [...projectTypes.map((type) => `/${type}s`), "/projects"];
let navigatingFrom: string | undefined = undefined;
let prevAction: string | undefined = undefined;
let timeoutRef: number | undefined = undefined;

function LoaderBar() {
    const navigation = useNavigation();
    const ref = useRef<LoadingBarRef>(null);

    useEffect(() => {
        const navigatedTo = navigation.location?.pathname;
        if (timeoutRef) window.clearTimeout(timeoutRef);

        if (
            (navigation.state === "loading" || navigation.state === "submitting") &&
            navigatedTo !== navigatingFrom &&
            !noConsecutiveLoaders.includes(navigatedTo || "")
        ) {
            if (prevAction === "start") {
                ref.current?.complete();
                prevAction = "complete";
            }

            timeoutRef = window.setTimeout(() => {
                ref.current?.staticStart(99.99);
                prevAction = "start";
            }, 100);
        }

        if (navigation.state === "idle" && prevAction === "start") {
            ref.current?.complete();
            prevAction = "complete";
        }

        navigatingFrom = navigatedTo || window.location.pathname;
    }, [navigation.location?.pathname]);

    return (
        <LoadingBar
            ref={ref}
            color="#EE3A76"
            className="!bg-gradient-to-r from-accent-background/75 to-accent-background"
            loaderSpeed={1200}
            shadow={true}
            height={2.5}
            transitionTime={350}
            waitingTime={250}
        />
    );
}

export default LoaderBar;
