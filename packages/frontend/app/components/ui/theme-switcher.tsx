import { ThemeOptions } from "@root/types";
import { cn } from "@root/utils";
import type { VariantProps } from "class-variance-authority";
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

    async function switchTheme() {
        if (theme === ThemeOptions.DARK) {
            setTheme(ThemeOptions.LIGHT);
        } else {
            setTheme(ThemeOptions.DARK);
        }
    }

    function transitionTheme(e: React.MouseEvent<HTMLButtonElement>) {
        if (!document.startViewTransition) return switchTheme();

        const x = e.clientX;
        const y = e.clientY;

        document.documentElement.setAttribute("data-view-transition", "theme-switch");
        document.documentElement.style.setProperty("--click-x", `${x}px`);
        document.documentElement.style.setProperty("--click-y", `${y}px`);

        document.startViewTransition(switchTheme);

        setTimeout(() => {
            document.documentElement.removeAttribute("data-view-transition");
        }, 600);
    }

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
            onClick={transitionTheme}
        >
            <div className={cn("h-nav-item aspect-square relative flex items-center justify-center rounded-full", iconWrapperClassName)}>
                {theme === ThemeOptions.DARK ? (
                    <SunIcon size={iconSize} className={iconClassName} />
                ) : (
                    <MoonIcon size={iconSize} className={iconClassName} />
                )}
            </div>
            {label && <p className="pr-4 whitespace-nowrap text-nowrap">{label}</p>}
        </Button>
    );
}
