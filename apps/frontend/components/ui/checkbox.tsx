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
            "peer relative h-4 w-4 shrink-0 rounded bg-background-shallower shadow outline-offset-2 focus-visible:outline-1 focus-visible:outline-foreground-muted disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent-bg data-[state=checked]:text-background",
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
    checkBoxClassname,
    disabled,
}: {
    checkBoxId: string;
    label: string | React.ReactNode;
    checked: boolean;
    className?: string;
    checkBoxClassname?: string;
    onCheckedChange: (e: CheckboxPrimitive.CheckedState) => void;
    disabled?: boolean;
}) => {
    return (
        <Label
            htmlFor={checkBoxId}
            className={cn(
                "flex text-[0.95rem] py-0.5 gap-x-2 font-[400] items-center justify-start transition-opacity hover:brightness-[85%] transition-[filter] cursor-pointer text-foreground-muted",
                className,
            )}
        >
            <Checkbox
                id={checkBoxId}
                checked={checked}
                onCheckedChange={onCheckedChange}
                className={cn("w-[0.95rem] h-[0.95rem]", checkBoxClassname)}
                disabled={disabled}
            />
            {label}
        </Label>
    );
};

export { Checkbox, LabelledCheckBox };