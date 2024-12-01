import { ThemeOptions } from "@root/types";
import { cn } from "@root/utils";
import type { VariantProps } from "class-variance-authority";
import { useEffect } from "react";
import { MoonIcon, SunIcon } from "~/components/icons";
import { Button, type buttonVariants } from "~/components/ui/button";
import useTheme from "~/hooks/theme";
import "./styles.css";

type variant = VariantProps<typeof buttonVariants>["variant"];

type Props = {
    className?: string;
    iconWrapperClassName?: string;
    iconClassName?: string;
    iconSize?: string;
    label?: string;
    noDefaultStyle?: boolean;
    variant?: variant;
};
export default function ThemeSwitch({
    className,
    iconWrapperClassName,
    iconClassName,
    iconSize = "45%",
    label,
    noDefaultStyle,
    variant = "ghost",
}: Props) {
    const { theme, setTheme } = useTheme();

    const switchTheme = () => {
        if (theme === ThemeOptions.DARK) {
            setTheme(ThemeOptions.LIGHT);
        } else {
            setTheme(ThemeOptions.DARK);
        }
    };

    const setInitialTheme = () => {
        if (theme !== ThemeOptions.SYSTEM) return;

        const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (prefersDarkTheme) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    useEffect(() => {
        try {
            setInitialTheme();
        } catch (error) {}
    }, []);

    return (
        <Button
            type="button"
            variant={variant}
            title={"Change theme"}
            className={cn(
                "overflow-hidden",
                noDefaultStyle !== true &&
                    "no_neumorphic_shadow rounded-full p-0 hover:bg-card-background dark:hover:bg-shallow-background",
                className,
            )}
            onClick={switchTheme}
        >
            <div className={cn("h-nav-item aspect-square relative flex items-center justify-center rounded-full", iconWrapperClassName)}>
                <div className="sun_icon_wrapper w-full aspect-square flex items-center justify-center" data-hide-on-theme="light">
                    <SunIcon size={iconSize} className={iconClassName} />
                </div>

                <div className="moon_icon_wrapper w-full aspect-square flex items-center justify-center" data-hide-on-theme="dark">
                    <MoonIcon size={iconSize} className={iconClassName} />
                </div>
            </div>
            {label && <p className="pr-4 whitespace-nowrap text-nowrap">{label}</p>}
        </Button>
    );
}
