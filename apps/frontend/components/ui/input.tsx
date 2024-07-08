import { cn } from "@/lib/utils";
import * as React from "react";
import { Label } from "./label";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            spellCheck={false}
            className={cn(
                "input_box_styles w-full px-3 py-1 h-10 text-base font-[500] dark:text-foreground/90 placeholder:text-foreground-muted/65 file:border-0 file:bg-transparent file:text-base file:text-foreground-muted file:font-[400] focus-within:outline-none",
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

interface AdditionalProps {
    wrapperClassName?: string;
    label: React.ReactNode;
}

const InputWithInlineLabel = React.forwardRef<HTMLInputElement, InputProps & AdditionalProps>(
    ({ className, wrapperClassName, label, type, ...props }, ref) => {
        return (
            <div className={cn("input_box_styles flex items-center justify-center pl-3", wrapperClassName)}>
                <Label htmlFor={props.id} className="whitespace-nowrap text-foreground/65 text-base cursor-text">
                    {label}
                </Label>
                <Input
                    ref={ref}
                    {...props}
                    className={cn(
                        "no_input_box_styles bg-transparent dark:bg-transparent rounded-tl-none rounded-bl-none pl-0.5 text-base",
                        className,
                    )}
                />
            </div>
        );
    },
);

export { Input, InputWithInlineLabel };
