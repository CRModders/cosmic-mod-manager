import { cn } from "@/lib/utils";
import React from "react";

const Chip = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <span
            className={cn(
                "text-sm font-semibold text-extra-muted-foreground bg-shallow-background/75 px-2 py-[0.15rem] rounded-full",
                className,
            )}
        >
            {children}
        </span>
    );
};

export default Chip;
