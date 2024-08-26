import { cn } from "@/lib/utils";
import type React from "react";

const Chip = ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
    return (
        <span
            style={style}
            className={cn(
                "flex items-center gap-1 text-sm font-semibold text-extra-muted-foreground bg-shallow-background/75 px-2 py-[0.15rem] rounded-full text-nowrap whitespace-nowrap",
                className,
            )}
        >
            {children}
        </span>
    );
};

export default Chip;
