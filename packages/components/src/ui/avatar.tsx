import type React from "react";
import { cn } from "~/utils";

interface Props extends React.HTMLAttributes<HTMLElement> {
    src: string;
    alt: string;
    className?: string;
    fallback?: React.ReactNode;
    loading?: "eager" | "lazy";
    vtId?: string; // View Transition ID
    viewTransitions?: boolean;
}

export function ImgWrapper({ vtId, src, alt, className, loading, fallback, viewTransitions, ...props }: Props) {
    if (!src) {
        return (
            <div
                {...props}
                className={cn(
                    "h-24 w-24 flex items-center justify-center rounded bg-shallow-background border border-shallow-background shrink-0",
                    className,
                )}
            >
                {fallback}
            </div>
        );
    }

    const style = vtId && viewTransitions === true ? { viewTransitionName: removeNumbers(vtId) } : {};

    return (
        <img
            {...props}
            src={src}
            loading={loading}
            alt={alt}
            className={cn(
                "h-24 w-24 object-cover rounded shadow shadow-background/50 bg-shallow-background border border-shallow-background shrink-0",
                className,
            )}
            style={style}
        />
    );
}

function removeNumbers(str: string) {
    return str.replace(/\d+/g, "");
}
