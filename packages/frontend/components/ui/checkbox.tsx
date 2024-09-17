import { cn } from "@/lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import * as React from "react";
import { Label } from "./label";

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            "neumorphic_shadow peer relative h-4 w-4 shrink-0 rounded-md bg-shallower-background/85 transition-opacity disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[hsla(var(--accent-background-dark))] data-[state=checked]:text-background",
            className,
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
            <CheckIcon className="h-btn-icon-sm w-btn-icon-sm" strokeWidth="2.5" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

interface LabelledCheckboxProps {
    checked: boolean;
    className?: string;
    checkBoxClassname?: string;
    onCheckedChange: (e: CheckboxPrimitive.CheckedState) => void;
    disabled?: boolean;
    checkBoxId?: string;
    name?: string;
}

const LabelledCheckbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & LabelledCheckboxProps
>(({ checkBoxId, children, checked, className, checkBoxClassname, onCheckedChange, disabled, name }, ref) => {
    return (
        <Label
            className={cn(
                "flex text-base font-normal py-[0.1rem] gap-x-2.5 items-center justify-start transition cursor-not-allowed text-muted-foreground opacity-75",
                !disabled && "hover:brightness-[85%] cursor-pointer opacity-100",
                className,
            )}
        >
            <Checkbox
                id={checkBoxId}
                checked={checked}
                onCheckedChange={onCheckedChange}
                className={checkBoxClassname}
                disabled={disabled}
                ref={ref}
                name={name}
            />
            {children}
        </Label>
    );
});

export { Checkbox, LabelledCheckbox };
