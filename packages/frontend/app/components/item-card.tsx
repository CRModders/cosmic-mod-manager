import { cn } from "@root/utils";
import { UsersIcon } from "lucide-react";
import { fallbackOrgIcon } from "~/components/icons";
import { ImgWrapper } from "~/components/ui/avatar";
import Link from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";

interface ListItemCardProps {
    vtId: string;
    title: string;
    url: string;
    icon?: string;
    description?: string;
    children: React.ReactNode;
    fallbackIcon?: React.ReactNode;
    className?: string;
}

export function ListItemCard({ vtId, title, url, icon, description, children, fallbackIcon, className }: ListItemCardProps) {
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
}

export function OrgListItemCard({ members, ...props }: OrgListItemCard) {
    const { t } = useTranslation();

    return (
        <ListItemCard {...props} fallbackIcon={fallbackOrgIcon}>
            <div className="flex gap-1 items-center justify-center whitespace-nowrap">
                <UsersIcon className="text-extra-muted-foreground font-medium w-btn-icon h-btn-icon" />
                {t.organization.membersCount(members)}
            </div>
        </ListItemCard>
    );
}
