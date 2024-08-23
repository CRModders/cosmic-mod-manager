import { cn } from "@/lib/utils";
import type React from "react";

interface Props {
    url?: string;
    alt?: string;
    fallback?: string | React.ReactNode;
    wrapperClassName?: string;
    imgClassName?: string;
}

const AvatarImg = ({ url, alt, fallback, wrapperClassName, imgClassName }: Props) => {
    return (
        <div
            className={cn(
                "flex shrink-0 items-center justify-center rounded-full h-10 aspect-square bg-shallow-background overflow-hidden",
                wrapperClassName,
            )}
        >
            {url ? <img src={url} alt={alt} className={cn("object-cover h-full w-full rounded-full", imgClassName)} /> : <>{fallback}</>}
        </div>
    );
};
export default AvatarImg;

export const ImgWrapper = ({
    src,
    alt,
    className,
    fallback,
}: { src: string; alt: string; className?: string; fallback?: React.ReactNode }) => {
    if (!src) {
        return (
            <div className={cn("h-24 aspect-square rounded-lg bg-shallow-background/50 border border-shallow-background", className)}>
                {fallback}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={cn(
                "h-24 object-contain rounded-lg bg-shallow-background/50 border border-shallow-background aspect-square",
                className,
            )}
        />
    );
};
