import { isCurrLinkActive } from "@app/utils/string";
import type { VariantProps } from "class-variance-authority";
import React from "react";
import type { LinkProps } from "react-router";
import { Link as RemixLink, useNavigate as __useNavigate, useLocation } from "react-router";
import { cn } from "~/utils";
import { buttonVariants } from "./button";

interface CustomLinkProps extends LinkProps {
    viewTransitions?: boolean;
}
export type PrefetchBehavior = "intent" | "render" | "none" | "viewport";

const Link = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(({ viewTransitions, ...props }, ref) => {
    return <RemixLink viewTransition={viewTransitions} ref={ref} {...props} to={props.to} />;
});
export default Link;

interface ButtonLinkProps extends Omit<LinkProps, "to"> {
    url: string;
    children: React.ReactNode;
    className?: string;
    exactTailMatch?: boolean;
    activityIndicator?: boolean;
    tabIndex?: number;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    activeClassName?: string;
    preventScrollReset?: boolean;
}

export function ButtonLink({
    url,
    children,
    className,
    exactTailMatch = true,
    activityIndicator = true,
    activeClassName,
    ...props
}: ButtonLinkProps) {
    const location = useLocation();

    return (
        <Link
            {...props}
            to={url}
            className={cn(
                "bg_hover_stagger w-full min-h-10 px-4 py-2 font-medium text-muted-foreground flex items-center justify-start gap-2 whitespace-nowrap hover:bg-shallow-background/60",
                isCurrLinkActive(url, location.pathname, exactTailMatch) && activityIndicator && "bg-shallow-background/70 text-foreground",
                isCurrLinkActive(url, location.pathname, exactTailMatch) && `active ${activeClassName}`,
                className,
            )}
        >
            {children}
        </Link>
    );
}

interface VariantLinkProps extends VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
    url: string;
    className?: string;
    label?: string;
    target?: string;
    onClick?: () => void | Promise<void>;
    tabIndex?: number;
    preventScrollReset?: boolean;
    prefetch?: PrefetchBehavior;
}

export const VariantButtonLink = React.forwardRef<HTMLAnchorElement, VariantLinkProps>(
    ({ children, url, className, label, variant = "secondary", size = "default", ...props }, ref) => {
        return (
            <Link
                to={url}
                ref={ref}
                className={cn("flex items-center justify-center gap-2 font-medium", buttonVariants({ variant, size }), className)}
                aria-label={label}
                {...props}
            >
                {children}
            </Link>
        );
    },
);

export function useNavigate() {
    return __useNavigate();
}
