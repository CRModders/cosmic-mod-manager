import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { WanderingCubesSpinner } from "./ui/spinner";

interface ImgLoaderProps {
    loaded: boolean;
    setLoaded: (loaded: boolean) => void;
    src: string;
    alt: string;
    thumbnailSrc?: string;
    className?: string;
    spinner?: React.ReactNode;
}

const loadedImages = new Set<string>();

export const ImgLoader = ({ src, alt, className, spinner, loaded, setLoaded, thumbnailSrc }: ImgLoaderProps) => {
    const _spinner = spinner || (
        <WanderingCubesSpinner className="absolute-center bg-[hsla(var(--background-dark),_0.5)] p-4 rounded text-white z-10" />
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (loaded) return;
        if (loadedImages.has(src)) {
            setLoaded(true);
            return;
        }

        const img = document.createElement("img");
        img.src = src;
        img.onload = () => {
            setLoaded(true);
            loadedImages.add(src);
        };

        return () => {
            img.onload = null;
        };
    }, [loaded]);

    return (
        <div className="relative">
            {!loaded && thumbnailSrc ? (
                <img src={thumbnailSrc} alt={alt} className={cn("absolute-center w-full h-full brightness-75", className)} />
            ) : null}
            <img src={src} alt={alt} className={cn("", !loaded && "invisible", className)} />
            {!loaded ? _spinner : null}
        </div>
    );
};
