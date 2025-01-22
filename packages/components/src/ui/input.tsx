import type * as React from "react";
import type { RefProp } from "~/types";
import { cn } from "~/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input({ ref, className, type, ...props }: InputProps & RefProp<HTMLInputElement>) {
    return (
        <input
            type={type}
            className={cn("input_box_styles w-full file:border-0 file:bg-transparent file:text-sm file:font-medium", className)}
            spellCheck={false}
            ref={ref}
            {...props}
        />
    );
}
Input.displayName = "Input";

export { Input };
