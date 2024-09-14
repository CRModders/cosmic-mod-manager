import { cn } from "@/lib/utils";
import { CheckCheckIcon, TriangleAlertIcon } from "lucide-react";
import type React from "react";

type Props = {
    text?: string;
    className?: string;
    labelClassName?: string;
    children?: React.ReactNode;
};

export const FormErrorMessage = ({ text, className, labelClassName, children }: Props) => {
    return (
        <div
            className={cn(
                "w-full flex items-center justify-start gap-2 px-4 py-2 rounded text-danger-foreground bg-danger-background/15",
                className,
            )}
        >
            <TriangleAlertIcon className="w-btn-icon h-btn-icon shrink-0" />
            {children ? children : <p className={cn("leading-snug", labelClassName)}>{text}</p>}
        </div>
    );
};

export const FormSuccessMessage = ({ text, className, labelClassName, children }: Props) => {
    return (
        <div
            className={cn(
                "w-full flex items-center gap-2 justify-start px-4 py-2 text-success-foreground rounded bg-success-background/15",
                className,
            )}
        >
            <CheckCheckIcon className="w-btn-icon h-btn-icon shrink-0" />
            {children ? children : <p className={cn("leading-snug", labelClassName)}>{text}</p>}
        </div>
    );
};
