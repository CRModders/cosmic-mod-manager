import { Button, type ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import * as React from "react";
import { Link, type LinkProps } from "react-router-dom";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
    <nav role="navigation" aria-label="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<ButtonProps, "size"> &
    LinkProps;

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
    <Link
        aria-current={isActive ? "page" : undefined}
        className={cn(
            buttonVariants({
                variant: isActive ? "default" : "secondary",
                size,
            }),
            "transition-none h-9",
            !isActive && "bg-card-background hover:bg-card-background/70 dark:bg-shallow-background dark:hover:bg-shallow-background/85",
            className,
        )}
        {...props}
    />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, to, ...props }: React.ComponentProps<typeof PaginationLink>) => {
    const icon = <ChevronLeftIcon className="w-btn-icon h-btn-icon" />;
    if (!to) {
        return (
            <Button variant={"secondary"} disabled size={"icon"} aria-label="Previous page">
                {icon}
            </Button>
        );
    }

    return (
        <PaginationLink
            to={to}
            aria-label="Previous page"
            size="default"
            className={cn("h-iconified-btn w-iconified-btn p-0", className)}
            {...props}
        >
            {icon}
        </PaginationLink>
    );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, to, ...props }: React.ComponentProps<typeof PaginationLink>) => {
    const icon = <ChevronRightIcon className="w-btn-icon h-btn-icon" />;
    if (!to) {
        return (
            <Button variant={"secondary"} disabled size={"icon"} aria-label="Next page">
                {icon}
            </Button>
        );
    }

    return (
        <PaginationLink
            to={to}
            aria-label="Next page"
            size="default"
            className={cn("h-iconified-btn w-iconified-btn p-0", className)}
            {...props}
        >
            {icon}
        </PaginationLink>
    );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
    <span aria-hidden className={cn("flex h-iconified-btn w-iconified-btn items-center justify-center", className)} {...props}>
        <MoreHorizontalIcon className="w-btn-icon h-btn-icon" />
        <span className="sr-only">More pages</span>
    </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious };
