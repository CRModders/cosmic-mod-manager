import * as LabelPrimitive from "@radix-ui/react-label";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@root/utils";

const labelVariants = cva("text-lg font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

interface LabelElemProps extends React.ComponentPropsWithoutRef<"label"> {}

export function InteractiveLabel({ children, htmlFor, ...props }: LabelElemProps) {
    return (
        <label
            {...props}
            htmlFor={htmlFor}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent<HTMLLabelElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    // @ts-ignore
                    e.target.click();
                }
            }}
        >
            {children}
        </label>
    );
}
