import { cn } from "@root/utils";
import { PageUrl, isCurrLinkActive } from "@root/utils/urls";
import type { VariantProps } from "class-variance-authority";
import React from "react";
import type { LinkProps, NavigateFunction, NavigateOptions } from "react-router";
import { Link as RemixLink, useNavigate as __useNavigate, useLocation, useRouteLoaderData } from "react-router";
import type { RootOutletData } from "~/root";
import { buttonVariants } from "./button";

interface CustomLinkProps extends LinkProps {
    escapeUrlWrapper?: boolean;
}
export type PrefetchBehavior = "intent" | "render" | "none" | "viewport";

const Link = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(({ escapeUrlWrapper, ...props }, ref) => {
    const data = useRouteLoaderData<RootOutletData>("root");
    const viewTransitions = data?.viewTransitions;

    let to = props.to;
    if (escapeUrlWrapper !== true) to = PageUrl(to.toString());

    return <RemixLink viewTransition={viewTransitions} ref={ref} {...props} to={to} />;
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
                isCurrLinkActive(PageUrl(url), location.pathname, exactTailMatch) &&
                    activityIndicator &&
                    "bg-shallow-background/70 text-foreground",
                isCurrLinkActive(PageUrl(url), location.pathname, exactTailMatch) && `active ${activeClassName}`,
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

export function useNavigate(escapeUrlWrapper?: boolean) {
    const navigate = __useNavigate();

    const __navigate = (to: string, options?: NavigateOptions): void => {
        const toUrl = escapeUrlWrapper === true ? to : PageUrl(to);

        navigate(toUrl, { viewTransition: true, ...options });
    };

    return __navigate as NavigateFunction;
}
