import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
    return <textarea className={cn("input_box_styles w-full flex min-h-20", className)} ref={ref} {...props} />;
});
Textarea.displayName = "Textarea";

export { Textarea };
