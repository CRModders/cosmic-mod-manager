import { categories } from "@app/utils/config/project";
import { getLoadersFromNames } from "@app/utils/convertors";
import { getProjectCategoriesDataFromNames } from "@app/utils/project";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { type EnvironmentSupport, ProjectVisibility } from "@app/utils/types";
import { imageUrl } from "@app/utils/url";
import { Building2Icon, CalendarIcon, DownloadIcon, HeartIcon, RefreshCcwIcon } from "lucide-react";
import type { ReactNode } from "react";
import { TagIcon } from "~/icons/tag-icons";
import { MicrodataItemProps, MicrodataItemType, itemType } from "~/microdata";
import { ImgWrapper } from "~/ui/avatar";
import Chip from "~/ui/chip";
import Link from "~/ui/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/ui/tooltip";
import { cn } from "~/utils";
import { fallbackProjectIcon } from "../icons";

export enum ViewType {
    GALLERY = "gallery",
    LIST = "list",
}

interface SearchListItemProps {
    projectName: string;
    projectType: string;
    projectSlug: string;
    icon: string | null;
    featuredGallery: string | null;
    color: string | null;
    author?: string;
    summary: string;
    clientSide?: EnvironmentSupport;
    serverSide?: EnvironmentSupport;
    loaders: string[];
    featuredCategories: string[];
    downloads: number;
    followers: number;
    dateUpdated: Date;
    datePublished: Date;
    showDatePublished?: boolean;
    viewType?: ViewType;
    isOrgOwned?: boolean;
    visibility: ProjectVisibility;
    vtId: string; // View Transition ID
    viewTransitions?: boolean;
    t?: ReturnType<typeof getDefaultStrings>;
    ProjectPagePath: ProjectPagePath;
    OrgPagePath: OrgPagePath;
    UserProfilePath: UserProfilePath;
    TimeSince_Fn: (date: string | Date) => string;
    NumberFormatter: (num: number) => string;
    DateFormatter: (date: string | Date) => ReactNode;
}

export default function SearchListItem(props: SearchListItemProps) {
    return <BaseView {...props} viewType={props.viewType || ViewType.LIST} />;
}

function BaseView(props: SearchListItemProps) {
    const t = props.t || getDefaultStrings();
    const projectCategoriesData = getProjectCategoriesDataFromNames(props.featuredCategories);
    const loadersData = getLoadersFromNames(props.loaders);

    const projectPageUrl = props.ProjectPagePath(props.projectType, props.projectSlug);

    // View Types
    const galleryViewType = props.viewType === ViewType.GALLERY;
    const listViewType = props.viewType === ViewType.LIST;

    const ProjectDownloads = t.count.downloads(props.downloads);
    const ProjectFollowers = t.count.followers(props.followers);

    return (
        <article
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="listitem"
            itemProp={MicrodataItemProps.works}
            itemScope
            itemType={itemType(MicrodataItemType.CreativeWork)}
            className={cn(
                "search-list-item grid gap-x-3 gap-y-2 text-muted-foreground bg-card-background rounded-lg",
                listViewType && "p-card-surround",
                galleryViewType && "pb-4",
                props.viewType,
            )}
            aria-label={props.projectName}
        >
            {galleryViewType && (
                <Link
                    to={projectPageUrl}
                    className="h-44 overflow-hidden rounded-t-lg rounded-b-none m-0.5 mb-0"
                    aria-label={props.projectName}
                    tabIndex={-1}
                    style={{
                        gridArea: "gallery",
                        backgroundColor: props.color ? props.color : "hsla(var(--foreground), 0.15)",
                    }}
                >
                    {props.featuredGallery && (
                        <img src={props.featuredGallery} alt={props.projectName} className="object-cover w-full h-full" loading="lazy" />
                    )}
                </Link>
            )}

            <Link
                to={projectPageUrl}
                className={cn(
                    "w-max h-fit flex shrink-0 relative items-start justify-center",
                    galleryViewType && "ml-card-surround -mt-12",
                )}
                aria-label={props.projectName}
                tabIndex={-1}
                style={{
                    gridArea: "icon",
                }}
            >
                <ImgWrapper
                    itemProp={MicrodataItemProps.image}
                    vtId={props.vtId}
                    loading="lazy"
                    src={imageUrl(props.icon)}
                    alt={props.projectName}
                    fallback={fallbackProjectIcon}
                    className="h-24 w-24 rounded-xl"
                    viewTransitions={props.viewTransitions}
                />
            </Link>

            <div
                className={cn("h-fit whitespace-break-spaces text-wrap leading-none", galleryViewType && "mr-card-surround leading-tight")}
                style={{ gridArea: "title" }}
            >
                <Link
                    itemProp={MicrodataItemProps.url}
                    to={projectPageUrl}
                    className={cn("w-fit text-xl font-bold leading-none mobile-break-words", galleryViewType && "block leading-tight")}
                    aria-label={props.projectName}
                >
                    <span itemProp={MicrodataItemProps.name} className={cn("leading-none", galleryViewType && "leading-tight")}>
                        {props.projectName}
                    </span>
                </Link>
                {props.author && (
                    <>
                        {" "}
                        by{" "}
                        <Link
                            to={props.isOrgOwned ? props.OrgPagePath(props.author) : props.UserProfilePath(props.author)}
                            className={cn(
                                "underline hover:brightness-110 mobile-break-words leading-none",
                                galleryViewType && "leading-tight",
                            )}
                            title={props.isOrgOwned ? `${props.author} (${t.project.organization})` : props.author}
                        >
                            {props.author}
                            {props.isOrgOwned ? (
                                <>
                                    {" "}
                                    <Building2Icon className="inline w-4 h-4" />
                                </>
                            ) : null}
                        </Link>
                    </>
                )}
                {props.visibility === ProjectVisibility.ARCHIVED && (
                    <>
                        {" "}
                        <Chip className="inline leading-none text-sm font-medium bg-warning-background/15 text-warning-foreground ml-1">
                            {t.projectSettings.archived}
                        </Chip>
                    </>
                )}
            </div>

            <p
                itemProp={MicrodataItemProps.description}
                className={cn("leading-tight sm:text-pretty max-w-[80ch] mobile-break-words", galleryViewType && "mx-card-surround")}
                style={{ gridArea: "summary" }}
            >
                {props.summary}
            </p>

            <div
                itemProp={MicrodataItemProps.about}
                itemScope
                itemType={itemType(MicrodataItemType.Thing)}
                className={cn(
                    "flex items-center justify-start gap-x-4 gap-y-0 flex-wrap text-extra-muted-foreground",
                    galleryViewType && "mx-card-surround",
                )}
                style={{ gridArea: "tags" }}
            >
                {projectCategoriesData.map((category) => {
                    // @ts-ignore
                    const tagName = t.search.tags[category.name] || CapitalizeAndFormatString(category.name);

                    return (
                        <span
                            className="flex gap-1 items-center justify-center"
                            key={category.name}
                            aria-label={category.name}
                            title={`${tagName} (${CapitalizeAndFormatString(category.header)})`}
                        >
                            <TagIcon name={category.name} />
                            <span itemProp={MicrodataItemProps.name}>{tagName}</span>
                        </span>
                    );
                })}

                {loadersData.map((loader) => {
                    if (loader.metadata.visibleInTagsList === false) return null;
                    const loaderName = CapitalizeAndFormatString(loader.name);

                    return (
                        <span key={loader.name} className="flex gap-1 items-center justify-center" title={`${loaderName} (Loader)`}>
                            <TagIcon name={loader.name} />
                            {loaderName}
                        </span>
                    );
                })}
            </div>

            <div
                className={cn("flex flex-wrap items-start justify-between gap-x-4", galleryViewType && "mx-card-surround")}
                style={{
                    gridArea: "stats",
                }}
            >
                <div className={cn("flex flex-wrap justify-end items-end gap-x-5", galleryViewType && "justify-start")}>
                    <div className="h-fit flex justify-center items-center gap-x-1.5">
                        <DownloadIcon className="inline w-[1.17rem] h-[1.17rem] text-extra-muted-foreground" />{" "}
                        <p className="text-nowrap">
                            {!galleryViewType && ProjectDownloads[0]?.length > 0 && (
                                <span className="hidden sm:inline lowercase">{ProjectDownloads[0]} </span>
                            )}
                            <strong className="text-lg-plus font-extrabold">{props.NumberFormatter(props.downloads)}</strong>
                            {!galleryViewType && ProjectDownloads[2]?.length > 0 && (
                                <span className="hidden sm:inline lowercase"> {ProjectDownloads[2]}</span>
                            )}
                        </p>
                    </div>

                    <div className="h-fit flex justify-center items-center gap-x-1.5">
                        <HeartIcon className="inline w-[1.07rem] h-[1.07rem] text-extra-muted-foreground" />{" "}
                        <p className="text-nowrap">
                            {!galleryViewType && ProjectFollowers[0]?.length > 0 && (
                                <span className="hidden sm:inline lowercase">{ProjectFollowers[0]} </span>
                            )}
                            <strong className="text-lg-plus font-extrabold">{props.NumberFormatter(props.followers)}</strong>
                            {!galleryViewType && ProjectFollowers[2]?.length > 0 && (
                                <span className="hidden sm:inline lowercase"> {ProjectFollowers[2]}</span>
                            )}
                        </p>
                    </div>
                </div>

                <div
                    className={cn(
                        "h-fit flex items-center gap-1.5 whitespace-nowrap",
                        listViewType && "justify-end ml-auto mt-auto",
                        galleryViewType && "justify-start my-auto",
                    )}
                >
                    <TooltipProvider>
                        {props.showDatePublished === true ? (
                            <Tooltip>
                                <CalendarIcon className="w-[1.1rem] h-[1.1rem] text-extra-muted-foreground" />
                                <TooltipTrigger asChild>
                                    <p className="flex items-baseline justify-center gap-1 text-nowrap">
                                        {t.project.publishedAt(props.TimeSince_Fn(props.datePublished))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>{props.DateFormatter(props.datePublished)}</TooltipContent>
                            </Tooltip>
                        ) : (
                            <Tooltip>
                                <RefreshCcwIcon className="w-[1.1rem] h-[1.1rem] text-extra-muted-foreground" />
                                <TooltipTrigger asChild>
                                    <p className="flex items-baseline justify-center gap-1 text-nowrap">
                                        {t.project.updatedAt(props.TimeSince_Fn(props.dateUpdated))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>{props.DateFormatter(props.dateUpdated)}</TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            </div>
        </article>
    );
}

function getDefaultStrings() {
    const tags: Record<string, string> = {};
    for (const c of categories) {
        tags[c.name] = c.name;
    }

    return {
        count: {
            downloads: (count: number) => ["", count.toString(), "downloads"],
            followers: (count: number) => ["", count.toString(), "followers"],
        },

        project: {
            organization: "Organization",
            updatedAt: (when: string) => `Updated ${when}`,
            publishedAt: (when: string) => `Published ${when}`,
        },
        projectSettings: {
            archived: "Archived",
        },
        search: {
            tags: tags,
        },
    };
}

type ProjectPagePath = (type: string, projectSlug: string, extra?: string) => string;
type OrgPagePath = (orgSlug: string, extra?: string) => string;
type UserProfilePath = (username: string, extra?: string) => string;
