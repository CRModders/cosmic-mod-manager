import { cn } from "@/lib/utils";
import type React from "react";
import { forwardRef } from "react";
import { Button, type ButtonProps } from "./button";

interface ChipProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const Chip = ({ children, className, style }: ChipProps) => {
    return (
        <span
            style={style}
            className={cn(
                "flex items-center gap-1 text-sm font-semibold text-extra-muted-foreground bg-shallow-background/75 px-2 py-[0.15rem] rounded-full text-nowrap whitespace-nowrap",
                className,
            )}
        >
            {children}
        </span>
    );
};

export const ChipButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "secondary-inverted", className, children, ...props }, ref) => {
        return (
            <Button
                variant={variant}
                ref={ref}
                {...props}
                className={cn(
                    "no_neumorphic_shadow font-semibold gap-x-1 w-fit h-fit py-[0.15rem] px-2 rounded-full text-sm text-muted-foreground/90",
                    className,
                )}
            >
                {children}
            </Button>
        );
    },
);

export default Chip;
