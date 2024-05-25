import { MoonIcon, SunIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import "@/src/globals.css";
import useTheme from "@/src/hooks/theme";
import { useEffect } from "react";

type Props = {
    className?: string;
    iconWrapperClassName?: string;
    iconClassName?: string;
    iconSize?: string;
    label?: string;
};
export default function ThemeSwitch({
    className,
    iconWrapperClassName,
    iconClassName,
    iconSize = "45%",
    label,
}: Props) {
    const { theme, setTheme } = useTheme();

    const switchTheme = () => {
        if (theme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    };

    const setInitialTheme = () => {
        if (theme !== "system") return;

        const prefersDarkTheme = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;

        if (prefersDarkTheme) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        try {
            setInitialTheme();
        } catch (error) { }
    }, []);

    return (
        <div className="flex items-center justify-center">
            <button
                type="button"
                aria-label={label ? label : "Change theme"}
                className={cn(
                    "flex items-center overflow-hidden justify-center hover:bg-bg-hover text-foreground rounded-full",
                    className,
                )}
                onClick={switchTheme}
            >
                <div
                    className={cn(
                        "navItemHeight aspect-square relative flex items-center justify-center rounded-full",
                        iconWrapperClassName,
                    )}
                >
                    <div className="sun_icon_wrapper w-full aspect-square flex items-center justify-center" data-hide-on-theme="light">
                        <SunIcon size={iconSize} className={iconClassName} />
                    </div>

                    <div className="moon_icon_wrapper w-full aspect-square flex items-center justify-center" data-hide-on-theme="dark">
                        <MoonIcon size={iconSize} className={iconClassName} />
                    </div>
                </div>
                {label && <p className="pr-4 whitespace-nowrap text-nowrap">{label}</p>}
            </button>
        </div>
    );
}
