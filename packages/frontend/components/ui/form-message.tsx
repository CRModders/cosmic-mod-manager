import { cn } from "@/lib/utils";
import type React from "react";

type Props = {
    text?: string;
    className?: string;
    labelClassName?: string;
    children?: React.ReactNode;
};

export const FormErrorMessage = ({ text, className, labelClassName, children }: Props) => {
    return (
        <div className={cn("w-full flex items-center justify-start px-4 py-2 rounded bg-danger-background/15", className)}>
            {children ? children : <p className={cn("leading-snug text-danger-foreground", labelClassName)}>{text}</p>}
        </div>
    );
};

export const FormSuccessMessage = ({ text, className, labelClassName, children }: Props) => {
    return (
        <div className={cn("w-full flex items-center justify-start px-4 py-2 rounded bg-success-background/15", className)}>
            {children ? children : <p className={cn("leading-snug text-success-foreground", labelClassName)}>{text}</p>}
        </div>
    );
};
