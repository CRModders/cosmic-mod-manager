import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { CancelButtonIcon } from "../icons";

const buttonVariants = cva(
    "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded font-[500] transition-colors focus-visible:outline-none focus-visible:keyboard_focus_ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-accent-background text-card-background dark:text-background hover:bg-accent-background/90 neumorphic_shadow [--shadow-alpha:0.25]",
                destructive:
                    "bg-danger-background text-card-background dark:text-background hover:bg-danger-background/90 neumorphic_shadow [--shadow-alpha:1]",
                outline: "border border-shallower-background hover:bg-shallow-background hover:text-accent-foreground",
                secondary: "bg-shallow-background text-muted-foreground hover:bg-shallow-background/80 neumorphic_shadow",
                "secondary-destructive": "text-danger-foreground bg-shallow-background hover:bg-shallow-background/80 neumorphic_shadow",
                ghost: "text-muted-foreground hover:bg-shallow-background hover:neumorphic_shadow",
                "ghost-destructive": "text-danger-foreground hover:bg-shallow-background hover:neumorphic_shadow",
                link: "text-foreground underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-1.5",
                sm: "h-9 px-3",
                lg: "h-11 px-8",
                icon: "h-iconified-btn w-iconified-btn",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    icon?: React.ReactNode | null;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };

export const CancelButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({ variant = "secondary", children, icon, ...props }, ref) => {
    return (
        <Button variant={variant} ref={ref} {...props}>
            {icon ? icon : <CancelButtonIcon className="w-btn-icon h-btn-icon" />}
            {children || "Cancel"}
        </Button>
    );
});
