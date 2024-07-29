import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "input_box_styles flex min-h-16 w-full font-[500] px-3 py-2 text-base text-foreground/90 placeholder:text-foreground-muted/65",
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = "Textarea";

export { Textarea };
