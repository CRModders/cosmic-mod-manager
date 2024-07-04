import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";

import { cn } from "@/lib/utils";
import { CheckIcon } from "../icons";
import { Label } from "./label";

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            "peer relative h-4 w-4 shrink-0 rounded bg-border shadow outline-offset-2 focus-visible:outline-1 focus-visible:outline-foreground-muted disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent-bg data-[state=checked]:text-background",
            className,
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
            <CheckIcon className="w-[80%] h-[80%]" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const LabelledCheckBox = ({
    checkBoxId,
    label,
    checked,
    onCheckedChange,
    className,
}: {
    checkBoxId: string;
    label: string | React.ReactNode;
    checked: boolean;
    className?: string;
    onCheckedChange: (e: CheckboxPrimitive.CheckedState) => void;
}) => {
    return (
        <Label
            htmlFor={checkBoxId}
            className={cn(
                "flex gap-[0.7rem] py-[0.3rem] items-center justify-start transition-opacity hover:opacity-85 cursor-pointer text-foreground-muted",
                className,
            )}
        >
            <Checkbox id={checkBoxId} checked={checked} onCheckedChange={onCheckedChange} />
            {label}
        </Label>
    );
};

export { Checkbox, LabelledCheckBox };
