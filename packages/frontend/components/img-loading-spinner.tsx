import { useEffect } from "react";
import { WanderingCubesSpinner } from "./ui/spinner";

interface ImgLoaderProps {
    loaded: boolean;
    setLoaded: (loaded: boolean) => void;
    src: string;
    alt: string;
    className?: string;
    spinner?: React.ReactNode;
}

export const ImgLoader = ({ src, alt, className, spinner, loaded, setLoaded }: ImgLoaderProps) => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (loaded) return;

        const img = document.createElement("img");
        img.src = src;
        img.onload = () => {
            console.log("Image loaded");
            setLoaded(true);
        };

        return () => {
            img.onload = null;
        };
    }, [loaded]);

    if (!loaded) {
        return <div>{spinner ? spinner : <WanderingCubesSpinner />}</div>;
    }

    return <img src={src} alt={alt} className={className} />;
};
