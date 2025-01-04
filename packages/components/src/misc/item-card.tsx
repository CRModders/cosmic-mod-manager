import { UsersIcon } from "lucide-react";
import { fallbackOrgIcon } from "~/icons";
import { ImgWrapper } from "~/ui/avatar";
import Link from "~/ui/link";
import { cn } from "~/utils";

interface ListItemCardProps {
    vtId: string;
    title: string;
    url: string;
    icon?: string;
    description?: string;
    children: React.ReactNode;
    fallbackIcon?: React.ReactNode;
    className?: string;
    viewTransitions?: boolean;
}

export function ListItemCard({
    vtId,
    title,
    url,
    icon,
    description,
    children,
    fallbackIcon,
    className,
    viewTransitions,
}: ListItemCardProps) {
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
                vtId={vtId}
                viewTransitions={viewTransitions}
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
}

interface OrgListItemCard extends Omit<ListItemCardProps, "children"> {
    members: number;
    t?: {
        count: {
            members: typeof membersCount;
        };
    };
}

export function OrgListItemCard({ members, ...props }: OrgListItemCard) {
    const t = props.t || { count: { members: membersCount } };

    return (
        <ListItemCard {...props} fallbackIcon={fallbackOrgIcon}>
            <div className="flex gap-1 items-center justify-center whitespace-nowrap">
                <UsersIcon className="text-extra-muted-foreground font-medium w-btn-icon h-btn-icon" />
                {t.count.members(members).join(" ")}
            </div>
        </ListItemCard>
    );
}

function membersCount(count: number) {
    switch (count) {
        case 1:
            return ["", "1", "member"];
        default:
            return ["", `${count}`, "members"];
    }
}
