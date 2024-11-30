import { useNavigation } from "@remix-run/react";
import { projectTypes } from "@shared/config/project";
import { useEffect, useRef } from "react";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

const noConsecutiveLoadersOnPaths: string[] = [...projectTypes.map((type) => `/${type}s`), "/projects"];
let prevPath: string | undefined = undefined;
let prevAction: string | undefined = undefined;

function LoaderBar() {
    const navigation = useNavigation();
    const ref = useRef<LoadingBarRef>(null);
    const darkTheme = document.documentElement.classList.contains("dark");

    useEffect(() => {
        // ? These seemingly purposeless checks prevent showing the loader when the url has changed but the path hasn't actually changed
        // ? I myself don't know how this works, but it works :)
        const navigatedTo = navigation.location?.pathname;

        if (
            (navigation.state === "loading" || navigation.state === "submitting") &&
            (navigatedTo !== prevPath || !noConsecutiveLoadersOnPaths.includes(navigatedTo || ""))
        ) {
            ref.current?.continuousStart(35, 1100);
            prevAction = "start";
        }

        if (navigation.state === "idle" && (prevAction === "start" || !prevAction)) {
            ref.current?.complete();
            prevAction = "complete";
        }

        prevPath = navigatedTo || window.location.pathname;
    }, [navigation.location?.pathname]);

    return <LoadingBar ref={ref} color="#EE3A76" shadow={false} height={darkTheme ? 2 : 3} transitionTime={450} waitingTime={550} />;
}

export default LoaderBar;
