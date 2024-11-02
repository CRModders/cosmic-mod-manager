import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded border border-shallow-background pl-2 pr-1 py-0.5 text-xs font-semibold transition-colors focus:keyboard_focus_ring",
    {
        variants: {
            variant: {
                default: "border-transparent bg-foreground-bright text-background shadow hover:bg-foreground/90",
                secondary: "border-transparent bg-shallow-background text-foreground hover:bg-shallow-background/80",
                destructive:
                    "border-transparent bg-red-500 text-zinc-50 shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/80",
                outline: "text-foreground border-shallower-background",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
