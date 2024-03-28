//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>. 

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium hover:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground_muted disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-foreground_muted_dark",
	{
		variants: {
			variant: {
				default:
					"bg-foreground text-background shadow hover:bg-background_hover_dark/80 dark:bg-foreground_dark dark:text-foreground dark:hover:bg-background/80",
				destructive:
					"bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90",
				outline:
					"border border-shadow bg-background shadow-sm hover:bg-background_hover hover:text-foreground dark:border-shadow_dark dark:bg-background_dark dark:hover:bg-background_hover_dark dark:hover:text-foreground_dark",
				secondary:
					"bg-background_hover text-foreground_muted shadow-sm hover:bg-background_hover/80 dark:bg-background_hover_dark dark:text-foreground_dark dark:hover:bg-background_hover_dark/80",
				ghost:
					"hover:bg-background_hover hover:text-foreground dark:hover:bg-background_hover_dark dark:hover:text-foreground_dark",
				link: "text-foreground underline-offset-4 hover:underline dark:text-foreground_dark",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				md: "h-10 rounded-lg px-5 text-medium",
				lg: "h-12 rounded-lg px-8",
				icon: "h-12 w-12",
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
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
