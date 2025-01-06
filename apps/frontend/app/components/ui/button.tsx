import { CancelButtonIcon } from "@app/components/icons";
import { Button, type ButtonProps } from "@app/components/ui/button";
import * as React from "react";
import { useTranslation } from "~/locales/provider";

export const CancelButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({ variant = "secondary", children, icon, ...props }, ref) => {
    const { t } = useTranslation();

    return (
        <Button variant={variant} ref={ref} {...props}>
            {icon ? icon : <CancelButtonIcon aria-hidden className="w-btn-icon h-btn-icon" />}
            {children || t.form.cancel}
        </Button>
    );
});
