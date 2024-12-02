import { cn } from "@root/utils";
import type React from "react";

interface Props {
    src: string;
    alt: string;
    className?: string;
    fallback?: React.ReactNode;
    loading?: "eager" | "lazy";
    vtId?: string; // View Transition ID
}

export function ImgWrapper({ vtId, src, alt, className, loading, fallback }: Props) {
    if (!src) {
        return (
            <div
                className={cn(
                    "h-24 w-24 flex items-center justify-center rounded bg-shallow-background border border-shallow-background shrink-0",
                    className,
                )}
            >
                {fallback}
            </div>
        );
    }

    const style = vtId ? { viewTransitionName: removeNumbers(vtId) } : {};

    return (
        <img
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
