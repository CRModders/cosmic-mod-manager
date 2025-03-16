import { UsersIcon } from "lucide-react";
import { CubeIcon, fallbackOrgIcon, fallbackProjectIcon } from "~/icons";
import { ImgWrapper } from "~/ui/avatar";
import Link from "~/ui/link";
import { cn } from "~/utils";

interface ListItemCardProps {
    vtId: string;
    title: string;
    url: string;
    icon?: string | React.ReactNode;
    description?: string;
    children: React.ReactNode;
    fallbackIcon?: React.ReactNode;
    className?: string;
    viewTransitions?: boolean;
}

export function ListItemCard(props: ListItemCardProps) {
    return (
        <Link
            to={props.url}
            aria-label={props.title}
            className={cn(
                "w-full grid grid-cols-[max-content_1fr] gap-panel-cards p-card-surround rounded bg-background/75 hover:bg-background/50 transition-colors",
                props.className,
            )}
        >
            <ImgWrapper
                vtId={props.vtId}
                viewTransitions={props.viewTransitions}
                src={props.icon || ""}
                alt={props.title}
                fallback={props.fallbackIcon}
                className="border-shallower-background dark:border-shallow-background w-20 h-20 sm:w-24 sm:h-24"
            />

            <div className="flex flex-col items-start justify-start">
                <div className="w-full text-md font-bold text-foreground-bright">{props.title}</div>
                <span className="w-full text-sm text-muted-foreground/75 leading-tight">{props.description}</span>
                <div className="w-full flex items-start justify-start gap-x-3 flex-wrap mt-auto text-extra-muted-foreground">
                    {props.children}
                </div>
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
                <UsersIcon aria-hidden className="text-extra-muted-foreground font-medium w-btn-icon h-btn-icon" />
                {t.count.members(members).join(" ")}
            </div>
        </ListItemCard>
    );
}

interface CollectionListItemCard extends Omit<ListItemCardProps, "children"> {
    visibility: React.ReactNode;
    projects: number;
    t?: {
        count: {
            projects: typeof projectsCount;
        };
    };
}

export function CollectionListItemCard(props: CollectionListItemCard) {
    const t = props.t || { count: { projects: projectsCount } };

    return (
        <ListItemCard {...props} fallbackIcon={fallbackProjectIcon}>
            <div className="flex gap-1 items-center justify-center whitespace-nowrap">
                <CubeIcon aria-hidden className="font-medium w-btn-icon h-btn-icon" />
                {t.count.projects(props.projects).join(" ")}
            </div>

            {props.visibility}
        </ListItemCard>
    );
}

function membersCount(count: number) {
    switch (count) {
        case 1:
            return ["", "1", "member"];
        default:
            return ["", count, "members"];
    }
}

function projectsCount(count: number) {
    switch (count) {
        case 1:
            return ["", "1", "project"];
        default:
            return ["", count, "projects"];
    }
}
