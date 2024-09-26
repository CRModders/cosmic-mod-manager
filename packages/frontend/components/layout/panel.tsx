import { cn } from "@/lib/utils";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const Panel = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={cn("w-full gap-panel-cards relative grid place-items-start grid-cols-1 lg:grid-cols-[min-content_1fr]", className)}>
            {children}
        </div>
    );
};

export const PanelAside = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <aside className={cn("w-full lg:w-[19rem]", className)}>{children}</aside>;
};

export const PanelContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <section className={cn("w-full overflow-auto flex flex-col gap-panel-cards items-center justify-center", className)}>
            {children}
        </section>
    );
};

export const PanelAsideNavCard = ({ children, className, label }: { children: React.ReactNode; className?: string; label: string }) => {
    return (
        <Card className={cn("w-full gap-1 flex flex-col items-start justify-center p-4", className)}>
            <CardHeader className="p-0">
                <CardTitle className="text-xl mb-2">{label}</CardTitle>
            </CardHeader>
            {children}
        </Card>
    );
};

export const ContentCardTemplate = ({
    children,
    title,
    className,
    cardClassname,
    headerClassName,
    titleClassName,
}: {
    children: React.ReactNode;
    title?: string;
    className?: string;
    cardClassname?: string;
    headerClassName?: string;
    titleClassName?: string;
}) => {
    return (
        <Card className={cn("w-full", !title && "pt-5", cardClassname)}>
            {!!title && (
                <CardHeader className={headerClassName}>
                    <CardTitle className={titleClassName}>{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent className={className}>{children}</CardContent>
        </Card>
    );
};

export const PanelContent_AsideCardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full gap-panel-cards grid grid-cols-1 md:grid-cols-[1fr_min-content] lg:grid-cols-1 xl:grid-cols-[1fr_min-content] items-start justify-start">
            {children}
        </div>
    );
};
