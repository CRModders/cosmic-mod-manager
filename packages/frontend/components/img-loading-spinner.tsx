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
    wrapperClassName?: string;
    spinner?: React.ReactNode;
}

const loadedImages = new Set<string>();
const timeoutRefs = new Map<string, number>();
const deleteTimeoutRef = (src: string) => timeoutRefs.delete(src);

export const ImgLoader = ({ src, alt, className, wrapperClassName, spinner, loaded, setLoaded, thumbnailSrc }: ImgLoaderProps) => {
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

            const prevRef = timeoutRefs.get(src);
            if (prevRef) {
                window.clearTimeout(prevRef);
                deleteTimeoutRef(src);
            }

            const ref = window.setTimeout(() => {
                if (loadedImages.has(src)) {
                    loadedImages.delete(src);
                }

                deleteTimeoutRef(src);
            }, 2_000);

            timeoutRefs.set(src, ref);
        };
    }, [loaded]);

    return (
        <div className={cn("relative", wrapperClassName)}>
            {!loaded && thumbnailSrc ? <img src={thumbnailSrc} alt={alt} className={cn("brightness-75", className)} /> : null}

            {loaded ? <img src={src} alt={alt} className={className} /> : null}

            {!loaded ? _spinner : null}
        </div>
    );
};
