import { cn } from "@root/utils";
import { useEffect } from "react";
import { WanderingCubesSpinner } from "~/components/ui/spinner";

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

export const ImgLoader = ({ src, alt, className, wrapperClassName, spinner, loaded, setLoaded, thumbnailSrc }: ImgLoaderProps) => {
    const _spinner = spinner || (
        <WanderingCubesSpinner className="absolute-center bg-[hsla(var(--background-dark),_0.5)] p-4 rounded text-white z-10" />
    );

    const isImageLoaded = loadedImages.has(src);

    useEffect(() => {
        setLoaded(isImageLoaded);
    }, [isImageLoaded]);

    useEffect(() => {
        if (isImageLoaded) {
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
    }, [src]);

    return (
        <div className={cn("relative", wrapperClassName)}>
            {!isImageLoaded && thumbnailSrc ? <img src={thumbnailSrc} alt={alt} className={cn("brightness-75", className)} /> : null}

            {isImageLoaded ? <img src={src} alt={alt} className={className} /> : null}

            {!isImageLoaded ? _spinner : null}
        </div>
    );
};
