import { enableInteractions, interactionsDisabled } from "@app/utils/dom";
import { useEffect, useRef } from "react";
import { useNavigation } from "react-router";
import LoadingBar, { type LoadingBarRef } from "./rtk-loading-indicator";

let timeoutRef: number | undefined = undefined;
let loaderStarted = false;

interface Props {
    height?: number;
    instantStart?: boolean;
}

export default function LoaderBar(props: Props) {
    const navigation = useNavigation();
    const ref = useRef<LoadingBarRef>(null);

    function loadingStart() {
        ref.current?.staticStart(99.99);
        loaderStarted = true;
    }

    function loadingEnd() {
        if (interactionsDisabled()) enableInteractions();
        if (!loaderStarted) return;

        ref.current?.complete();
        loaderStarted = false;
    }

    useEffect(() => {
        if (timeoutRef) window.clearTimeout(timeoutRef);

        if (navigation.state === "loading" || navigation.state === "submitting") {
            if (props.instantStart) loadingStart();
            else timeoutRef = window.setTimeout(loadingStart, 100);
        }

        if (navigation.state === "idle") loadingEnd();
    }, [navigation.location?.pathname]);

    return (
        <LoadingBar
            ref={ref}
            className="!bg-gradient-to-r from-accent-background/85 to-accent-background"
            loaderSpeed={1200}
            shadow={true}
            height={props.height || 2.25}
            transitionTime={350}
            waitingTime={250}
        />
    );
}
