import type * as React from "react";
import type { RefProp } from "~/types";
import { cn } from "~/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function Textarea({ ref, className, ...props }: TextareaProps & RefProp<HTMLTextAreaElement>) {
    return <textarea className={cn("input_box_styles w-full flex min-h-20", className)} ref={ref} {...props} />;
}
Textarea.displayName = "Textarea";

export { Textarea };
