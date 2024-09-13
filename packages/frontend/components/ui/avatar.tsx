import { cn } from "@/lib/utils";
import type React from "react";

export const ImgWrapper = ({
    src,
    alt,
    className,
    fallback,
}: { src: string; alt: string; className?: string; fallback?: React.ReactNode }) => {
    if (!src) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center h-24 aspect-square rounded bg-shallow-background/50 border border-shallow-background",
                    className,
                )}
            >
                {fallback}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={cn(
                "h-24 object-contain rounded shadow shadow-background/50 bg-shallow-background/50 border border-shallow-background aspect-square",
                className,
            )}
        />
    );
};
