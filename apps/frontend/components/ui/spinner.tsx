import { cn } from "@/lib/utils";
import { useEffect } from "react";
import "./styles.css";

type LoaderSizes = "xs" | "sm" | "default" | "lg" | "xl" | "2xl";

export function LoadingSpinner({ size }: { size?: LoaderSizes }) {
    let cubeSize = "1.25rem";
    let borderWidth = "0.2rem";

    switch (size) {
        case "xs":
            cubeSize = "1rem";
            borderWidth = "0.15rem";
            break;
        case "sm":
            cubeSize = "1.25rem";
            borderWidth = "0.16rem";
            break;
        case "lg":
            cubeSize = "2.5rem";
            borderWidth = "0.2rem";
            break;
        case "xl":
            cubeSize = "3.25rem";
            borderWidth = "0.25rem";
            break;
        case "2xl":
            cubeSize = "4rem";
            borderWidth = "0.3rem";
            break;
        default:
            cubeSize = "2rem";
            borderWidth = "0.2rem";
            break;
    }

    return (
        <div
            className="size-[var(--size)] [border-width:_var(--border-width)] border-foreground-muted border-l-transparent border-r-transparent rounded-[999px] animate-spin"
            style={{
                // @ts-ignore
                "--size": cubeSize,
                // @ts-ignore
                "--border-width": borderWidth,
            }}
        />
    );
}

export const WanderingCubesSpinner = () => {
    return (
        <span className="wandering_cubes_animation flex items-center justify-center" role="img" aria-label="Loading">
            <span className="flex items-center justify-center relative contain-paint size-[var(--frame-size)]">
                <span className="wandering_cube cube1 bg-foreground" />
                <span className="wandering_cube cube2 bg-foreground" />
            </span>
        </span>
    );
};

export const AbsolutePositionedSpinner = ({
    size,
    className,
    spinnerWrapperClassName,
    backdropBgClassName,
    preventScroll = false,
}: {
    size?: LoaderSizes;
    className?: string;
    spinnerWrapperClassName?: string;
    backdropBgClassName?: string;
    preventScroll?: boolean;
}) => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (preventScroll !== true) return;

        document.body.classList.add("no-scrollbar");

        return () => {
            document.body.classList.remove("no-scrollbar");
        };
    }, []);

    return (
        <div
            className={cn(
                "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center",
                className,
            )}
        >
            <div
                className={cn(
                    "w-full h-full flex items-center justify-center relative rounded-xl backdrop-blur-[1px]",
                    spinnerWrapperClassName,
                )}
            >
                <div
                    className={cn(
                        "w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background opacity-50",
                        backdropBgClassName,
                    )}
                />
                <LoadingSpinner size={size} />
            </div>
        </div>
    );
};

export const SuspenseFallback = () => {
    return (
        <div className="w-full flex items-center justify-center py-12">
            <WanderingCubesSpinner />
        </div>
    );
};
