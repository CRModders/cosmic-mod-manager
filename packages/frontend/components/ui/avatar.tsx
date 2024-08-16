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
                "flex shrink-0 items-center justify-center rounded-full h-10 aspect-square bg-shallow-background",
                wrapperClassName,
            )}
        >
            {url ? <img src={url} alt={alt} className={cn("w-[100%] aspect-square rounded-full", imgClassName)} /> : <>{fallback}</>}
        </div>
    );
};

export default AvatarImg;
