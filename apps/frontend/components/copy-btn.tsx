import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";

type Props = {
    text: string | number;
    label?: string;
    className?: string;
    labelClassName?: string;
    iconClassName?: string;
    successMessage?: string;
};

let timeoutRef: number;

const CopyBtn = ({ text, label, className, labelClassName, iconClassName }: Props) => {
    const [showTickIcon, setShowTickIcon] = useState(false);
    const { toast } = useToast();
    const copyText = () => {
        try {
            clearTimeout(timeoutRef);
            navigator.clipboard.writeText(text.toString());
            setShowTickIcon(true);
            timeoutRef = window.setTimeout(() => {
                setShowTickIcon(false);
            }, 2_000);
        } catch (error) {
            console.error(error);
            toast({
                title: "Couldn't copy to clipboard !",
                description: "Try again or copy the text manually",
            });
        }
    };

    return (
        <Button
            size="icon"
            id={`copy-btn-${text}-${label}`}
            variant="ghost"
            aria-label="Copy"
            className={cn(
                "w-fit h-fit px-1 min-h-6 min-w-6 gap-2 shrink-0 flex items-center justify-center",
                className,
            )}
            onClick={copyText}
        >
            {label ? <span className={cn("text-sm text-foreground-muted", labelClassName)}>{label}</span> : null}
            <div className="w-4 h-4 flex items-center justify-center">
                {showTickIcon ? (
                    <CheckIcon className={cn("w-4 h-4 text-success-text", iconClassName)} />
                ) : (
                    <CopyIcon className={cn("w-3 h-3 text-foreground/50", iconClassName)} />
                )}
            </div>
        </Button>
    );
};

export default CopyBtn;
