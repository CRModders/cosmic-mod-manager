import { MoonIcon, SunIcon } from "@/components/icons";
import useTheme from "@/src/hooks/use-theme";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import "./styles.css";
import { Button } from "./button";

type Props = {
    className?: string;
    iconWrapperClassName?: string;
    iconClassName?: string;
    iconSize?: string;
    label?: string;
};
export default function ThemeSwitch({ className, iconWrapperClassName, iconClassName, iconSize = "45%", label }: Props) {
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

        const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

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
        } catch (error) {}
    }, []);

    return (
        <div className="flex items-center justify-center">
            <Button
                type="button"
                variant={"ghost"}
                aria-label={label ? label : "Change theme"}
                className={cn("no_neumorphic_shadow rounded-full p-0 hover:bg-card-background overflow-hidden", className)}
                onClick={switchTheme}
            >
                <div
                    className={cn("h-nav-item aspect-square relative flex items-center justify-center rounded-full", iconWrapperClassName)}
                >
                    <div className="sun_icon_wrapper w-full aspect-square flex items-center justify-center" data-hide-on-theme="light">
                        <SunIcon size={iconSize} className={iconClassName} />
                    </div>

                    <div className="moon_icon_wrapper w-full aspect-square flex items-center justify-center" data-hide-on-theme="dark">
                        <MoonIcon size={iconSize} className={iconClassName} />
                    </div>
                </div>
                {label && <p className="pr-4 whitespace-nowrap text-nowrap">{label}</p>}
            </Button>
        </div>
    );
}
