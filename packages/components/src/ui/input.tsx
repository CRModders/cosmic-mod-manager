import * as React from "react";
import { cn } from "~/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn("input_box_styles w-full file:border-0 file:bg-transparent file:text-sm file:font-medium", className)}
            spellCheck={false}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
