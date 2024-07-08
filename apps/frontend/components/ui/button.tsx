import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "flex items-center justify-center whitespace-nowrap gap-2 rounded-lg font-[500] text-[0.925rem] sm:text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-65 dark:focus-visible:ring-zinc-300",
    {
        variants: {
            variant: {
                default:
                    "text-[hsla(var(--foreground-dark))] dark:text-[hsla(var(--foreground-light))] bg-accent-bg hover:bg-accent-bg/90 shadow",
                destructive:
                    "bg-danger-bg text-[hsla(var(--foreground-dark))] dark:text-[hsla(var(--foreground-light))] shadow-sm hover:bg-danger-bg/90",
                "destructive-outlined":
                    "bg-background text-danger-text shadow-sm hover:bg-bg-hover border border-border",
                outline: "text-foreground-muted border border-border bg-background shadow-sm hover:bg-bg-hover",
                secondary: "bg-background-shallow text-foreground-muted shadow-sm hover:bg-background-shallow/80",
                ghost: "text-foreground-muted hover:bg-bg-hover",
                link: "text-foreground-muted underline-offset-4 hover:underline text-base",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-10 px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    },
);
Button.displayName = "Button";

export { Button, buttonVariants };
