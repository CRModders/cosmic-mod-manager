import { enableInteractions, interactionsDisabled } from "@app/utils/dom";
import { useEffect, useRef } from "react";
import { useNavigation } from "react-router";
import LoadingBar, { type LoadingBarRef } from "./rtk-loading-indicator";

let timeoutRef: number | undefined = undefined;
let loaderStarted = false;

interface Props {
    height?: number;
    instantStart?: boolean;
    fixedPosition?: boolean;
}

export default function LoaderBar(props?: Props) {
    if (!props) props = {};

    const navigation = useNavigation();
    const ref = useRef<LoadingBarRef>(null);

    function loadingStart() {
        console.log("loadingStart");
        ref.current?.continuousStart(60);
        loaderStarted = true;
    }

    function loadingEnd() {
        console.log("loadingEnd");
        if (interactionsDisabled()) enableInteractions();
        if (!loaderStarted) return;

        ref.current?.complete();
        loaderStarted = false;
    }

    useEffect(() => {
        console.log("navigation.state", navigation.state);

        if (timeoutRef) window.clearTimeout(timeoutRef);

        if (navigation.state === "loading" || navigation.state === "submitting") {
            if (props.instantStart === true) loadingStart();
            else {
                timeoutRef = window.setTimeout(loadingStart, 100);
            }
        }

        if (navigation.state === "idle") {
            loadingEnd();
        }
    }, [navigation.state]);

    return (
        <LoadingBar
            ref={ref}
            className="!bg-gradient-to-r from-accent-background/85 to-accent-background"
            fixedPosition={props.fixedPosition}
            loaderSpeed={1200}
            shadow={true}
            height={props.height || 2.25}
            transitionTime={350}
            waitingTime={250}
        />
    );
}
