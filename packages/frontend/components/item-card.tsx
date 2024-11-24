import { cn } from "@/lib/utils";
import { UsersIcon } from "lucide-react";
import { Link } from "react-router";
import { fallbackOrgIcon } from "./icons";
import { ImgWrapper } from "./ui/avatar";

interface ListItemCardProps {
    title: string;
    url: string;
    icon?: string;
    description?: string;
    children: React.ReactNode;
    fallbackIcon?: React.ReactNode;
    className?: string;
}

export const ListItemCard = ({ title, url, icon, description, children, fallbackIcon, className }: ListItemCardProps) => {
    return (
        <Link
            to={url}
            aria-label={title}
            className={cn(
                "w-full grid grid-cols-[max-content_1fr] gap-panel-cards p-card-surround rounded bg-background/75 hover:bg-background/50 transition-colors",
                className,
            )}
        >
            <ImgWrapper
                src={icon || ""}
                alt={title}
                fallback={fallbackIcon}
                className="border-shallower-background dark:border-shallow-background w-20 h-20 sm:w-24 sm:h-24"
            />

            <div className="flex flex-col items-start justify-start">
                <div className="w-full text-md font-bold text-foreground-bright">{title}</div>
                <span className="w-full text-sm text-muted-foreground/75 leading-tight">{description}</span>
                <div className="w-full flex items-start justify-start mt-auto text-muted-foreground">{children}</div>
            </div>
        </Link>
    );
};

interface OrgListItemCard extends Omit<ListItemCardProps, "children"> {
    members: number;
}

export const OrgListItemCard = ({ members, ...props }: OrgListItemCard) => {
    return (
        <ListItemCard {...props} fallbackIcon={fallbackOrgIcon}>
            <div className="flex gap-1 items-center justify-center whitespace-nowrap">
                <UsersIcon className="text-extra-muted-foreground font-medium w-btn-icon h-btn-icon" />
                {members > 1 ? `${members} members` : `${members} member`}
            </div>
        </ListItemCard>
    );
};
