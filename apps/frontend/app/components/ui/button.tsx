import { CancelButtonIcon } from "@app/components/icons";
import type { RefProp } from "@app/components/types";
import { Button, type ButtonProps } from "@app/components/ui/button";
import { useTranslation } from "~/locales/provider";

export function CancelButton({ ref, variant = "secondary", children, icon, ...props }: ButtonProps & RefProp<HTMLButtonElement>) {
    const { t } = useTranslation();

    return (
        <Button variant={variant} ref={ref} {...props}>
            {icon ? icon : <CancelButtonIcon aria-hidden className="w-btn-icon h-btn-icon" />}
            {children || t.form.cancel}
        </Button>
    );
}
