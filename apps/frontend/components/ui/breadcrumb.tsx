import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Breadcrumb = React.forwardRef<
    HTMLElement,
    React.ComponentPropsWithoutRef<"nav"> & {
        separator?: React.ReactNode;
    }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
    ({ className, ...props }, ref) => (
        <ol
            ref={ref}
            className={cn(
                "flex flex-wrap items-center gap-0.5 break-words text-sm text-zinc-500 sm:gap-1.5 dark:text-zinc-400",
                className,
            )}
            {...props}
        />
    ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
    ({ className, ...props }, ref) => (
        <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
    ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = ({
    className,
    href,
    children,
}: { className?: string; href: string; children: React.ReactNode }) => {
    return (
        <Link
            className={cn(
                "transition-colors text-accent-foreground/90 hover:text-accent-foreground underline-offset-[0.15em] hover:underline",
                className,
            )}
            to={href}
        >
            {children}
        </Link>
    );
};

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
    ({ className, ...props }, ref) => (
        <span
            ref={ref}
            role="link"
            aria-disabled="true"
            aria-current="page"
            className={cn("font-normal text-zinc-950 dark:text-zinc-50", className)}
            {...props}
        />
    ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
    <li role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3.5", className)} {...props}>
        {children ?? <ChevronRightIcon />}
    </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
    <span
        role="presentation"
        aria-hidden="true"
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <DotsHorizontalIcon className="h-4 w-4" />
        <span className="sr-only">More</span>
    </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
};
