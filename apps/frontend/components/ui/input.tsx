import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            spellCheck={false}
            className={cn(
                "input_box flex h-9 w-full px-3 py-1 text-sm font-[500] file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none",
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };
