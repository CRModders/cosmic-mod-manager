import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { Controller, type ControllerProps, type FieldPath, type FieldValues, FormProvider, useFormContext } from "react-hook-form";
import type { RefProp } from "~/types";
import { Label } from "~/ui/label";
import { cn } from "~/utils";

const Form = FormProvider;

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
};

function useFormField() {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();

    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
}

type FormItemContextValue = {
    id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & RefProp<HTMLDivElement>) {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div
                ref={ref}
                className={cn("w-full max-w-full flex flex-col items-start justify-center mb-1.5 gap-y-1.5", className)}
                {...props}
            />
        </FormItemContext.Provider>
    );
}
FormItem.displayName = "FormItem";

function FormLabel({ ref, className, ...props }: React.ComponentPropsWithRef<typeof LabelPrimitive.Root>) {
    const { error, formItemId } = useFormField();

    return (
        <Label
            ref={ref}
            className={cn(
                "text-lg font-medium leading-none text-foreground gap-x-6 w-full flex flex-wrap items-center justify-between",
                className,
            )}
            htmlFor={formItemId}
            {...props}
        />
    );
}
FormLabel.displayName = "FormLabel";

function FormControl({ ref, ...props }: React.ComponentPropsWithRef<typeof Slot>) {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
        <Slot
            ref={ref}
            id={formItemId}
            aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
            aria-invalid={!!error}
            {...props}
        />
    );
}
FormControl.displayName = "FormControl";

function FormDescription({ ref, className, ...props }: React.HTMLAttributes<HTMLParagraphElement> & RefProp<HTMLParagraphElement>) {
    const { formDescriptionId } = useFormField();

    return <p ref={ref} id={formDescriptionId} className={cn("text-[0.87rem] text-muted-foreground", className)} {...props} />;
}
FormDescription.displayName = "FormDescription";

function FormMessage({ ref, className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & RefProp<HTMLParagraphElement>) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <p ref={ref} id={formMessageId} className={cn("text-sm leading-tight font-medium text-danger-foreground", className)} {...props}>
            {body}
        </p>
    );
}
FormMessage.displayName = "FormMessage";

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField };
