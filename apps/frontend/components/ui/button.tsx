import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-zinc-300",
	{
		variants: {
			variant: {
				default: "bg-accent-bg text-[hsla(var(--foreground-dark))] dark:text-foreground hover:bg-accent-bg/90 shadow",
				destructive:
					"bg-red-500 text-foreground shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:hover:bg-red-900/90",
				outline: "border border-zinc-300 bg-background shadow-sm hover:bg-bg-hover dark:border-zinc-700",
				secondary: "bg-background-shallow text-foreground shadow-sm hover:bg-background-shallow/80",
				ghost: "text-foreground hover:bg-bg-hover",
				link: "text-foreground underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
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
