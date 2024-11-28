import { cn } from "@root/utils";
import type React from "react";

export const ImgWrapper = ({
    src,
    alt,
    className,
    loading,
    fallback,
}: { src: string; alt: string; className?: string; fallback?: React.ReactNode; loading?: "eager" | "lazy" }) => {
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

    return (
        <img
            src={src}
            loading={loading}
            alt={alt}
            className={cn(
                "h-24 w-24 object-cover rounded shadow shadow-background/50 bg-shallow-background border border-shallow-background shrink-0",
                className,
            )}
        />
    );
};
