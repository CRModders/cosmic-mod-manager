import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

type Props = {
    id: string;
    text: string | number;
    label?: string;
    maxLabelChars?: number;
    className?: string;
    labelClassName?: string;
    iconClassName?: string;
    successMessage?: string;
};

const timeoutRef = new Map<string, number>();
const CopyBtn = ({ id, text, label, className, labelClassName, iconClassName, maxLabelChars }: Props) => {
    const [showTickIcon, setShowTickIcon] = useState(false);

    const copyText = () => {
        try {
            const existingTimeout = timeoutRef.get(id);
            if (existingTimeout) clearTimeout(existingTimeout);
            navigator.clipboard.writeText(text.toString());
            setShowTickIcon(true);
            const timeoutId = window.setTimeout(() => {
                setShowTickIcon(false);
            }, 2_000);
            timeoutRef.set(id, timeoutId);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Button
            // size="icon"
            id={`copy-btn-${text}-${label}`}
            variant="ghost"
            aria-label="Copy"
            className={cn("w-fit h-fit px-1 py-0 min-h-6 min-w-6 gap-2 shrink-0 flex items-center justify-center", className)}
            onClick={copyText}
        >
            {label ? (
                <span className={cn("text-sm font-mono leading-none text-foreground dark:text-muted-foreground", labelClassName)}>
                    {label.slice(0, maxLabelChars || label.length)}
                    {maxLabelChars && label.length > maxLabelChars ? "…" : ""}
                </span>
            ) : null}
            <div className="w-btn-icon h-btn-icon flex items-center justify-center">
                {showTickIcon ? (
                    <CheckIcon className={cn("w-btn-icon h-btn-icon text-success-foreground", iconClassName)} />
                ) : (
                    <CopyIcon className={cn("w-3 h-3 text-extra-muted-foreground", iconClassName)} />
                )}
            </div>
        </Button>
    );
};

export default CopyBtn;
