import { categories } from "@app/utils/config/project";
import { getLoadersFromNames } from "@app/utils/convertors";
import { getProjectCategoriesDataFromNames } from "@app/utils/project";
import { CapitalizeAndFormatString } from "@app/utils/string";
import type { ProjectSupport } from "@app/utils/types";
import { imageUrl } from "@app/utils/url";
import { Building2Icon, CalendarIcon, DownloadIcon, HeartIcon, RefreshCcwIcon } from "lucide-react";
import { TagIcon } from "~/icons/tag-icons";
import { ImgWrapper } from "~/ui/avatar";
import Link from "~/ui/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/ui/tooltip";
import { cn } from "~/utils";
import { fallbackProjectIcon } from "../icons";
import { FormattedDate, TimePassedSince } from "../ui/date";

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
    clientSide?: ProjectSupport;
    serverSide?: ProjectSupport;
    loaders: string[];
    featuredCategories: string[];
    downloads: number;
    followers: number;
    dateUpdated: Date;
    datePublished: Date;
    showDatePublished?: boolean;
    viewType?: ViewType;
    vtId: string; // View Transition ID
    isOrgOwned?: boolean;
    t?: ReturnType<typeof getDefaultStrings>;
    ProjectPagePath: ProjectPagePath;
    OrgPagePath: OrgPagePath;
    UserProfilePath: UserProfilePath;
}

export default function SearchListItem({ viewType = ViewType.LIST, ...props }: SearchListItemProps) {
    return <BaseView viewType={viewType} {...props} />;
}

function BaseView(props: SearchListItemProps) {
    const t = props.t || getDefaultStrings();
    const projectCategoriesData = getProjectCategoriesDataFromNames(props.featuredCategories);
    const loadersData = getLoadersFromNames(props.loaders);

    const projectPageUrl = props.ProjectPagePath(props.projectType, props.projectSlug);

    // View Types
    const galleryViewType = props.viewType === ViewType.GALLERY;
    const listViewType = props.viewType === ViewType.LIST;

    return (
        <article
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="listitem"
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
                    vtId={props.vtId}
                    loading="lazy"
                    src={imageUrl(props.icon)}
                    alt={props.projectName}
                    fallback={fallbackProjectIcon}
                    className="h-24 w-24 rounded-xl"
                />
            </Link>

            <div className={cn("h-fit mobile-break-words", galleryViewType && "mr-card-surround")} style={{ gridArea: "title" }}>
                <Link
                    to={projectPageUrl}
                    className={cn("w-fit text-xl font-bold leading-none mobile-break-words", galleryViewType && "block")}
                    aria-label={props.projectName}
                >
                    {props.projectName}
                </Link>{" "}
                {props.author && (
                    <>
                        by{" "}
                        <Link
                            to={props.isOrgOwned ? props.OrgPagePath(props.author) : props.UserProfilePath(props.author)}
                            className="underline hover:brightness-110"
                            title={props.isOrgOwned ? `${props.author} (${t.project.organization})` : props.author}
                        >
                            {props.author} {props.isOrgOwned && <Building2Icon className="inline w-4 h-4" />}
                        </Link>
                    </>
                )}
            </div>

            <p
                className={cn("leading-tight sm:text-pretty max-w-[80ch]", galleryViewType && "mx-card-surround")}
                style={{ gridArea: "summary" }}
            >
                {props.summary}
            </p>

            <div
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
                            {tagName}
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
                        <p>
                            <strong className="text-lg-plus font-extrabold">{props.downloads}</strong>{" "}
                            {!galleryViewType && <span className="hidden sm:inline lowercase">{t.search.downloads}</span>}
                        </p>
                    </div>

                    <div className="h-fit flex justify-center items-center gap-x-1.5">
                        <HeartIcon className="inline w-[1.07rem] h-[1.07rem] text-extra-muted-foreground" />{" "}
                        <p>
                            <strong className="text-lg-plus font-extrabold">{props.followers}</strong>{" "}
                            {!galleryViewType && <span className="hidden sm:inline">{t.search.followers}</span>}
                        </p>
                    </div>
                </div>

                <div
                    className={cn(
                        "h-fit flex items-center gap-1.5 whitespace-nowrap mt-auto",
                        listViewType && "justify-end ml-auto",
                        galleryViewType && "justify-start",
                    )}
                >
                    <TooltipProvider>
                        {props.showDatePublished === true ? (
                            <Tooltip>
                                <CalendarIcon className="w-[1.1rem] h-[1.1rem] text-extra-muted-foreground" />
                                <TooltipTrigger asChild>
                                    <p className="flex items-baseline justify-center gap-1">
                                        {t.project.publishedAt(TimePassedSince({ date: props.datePublished }))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <FormattedDate date={props.datePublished} />
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Tooltip>
                                <RefreshCcwIcon className="w-[1.1rem] h-[1.1rem] text-extra-muted-foreground" />
                                <TooltipTrigger asChild>
                                    <p className="flex items-baseline justify-center gap-1">
                                        {t.project.updatedAt(TimePassedSince({ date: props.dateUpdated }))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <FormattedDate date={props.dateUpdated} />
                                </TooltipContent>
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
        project: {
            organization: "Organization",
            updatedAt: (when: string) => `Updated ${when}`,
            publishedAt: (when: string) => `Published ${when}`,
        },
        search: {
            tags: tags,
            downloads: "downloads",
            followers: "followers",
        },
    };
}

type ProjectPagePath = (type: string, projectSlug: string, extra?: string) => string;
type OrgPagePath = (orgSlug: string, extra?: string) => string;
type UserProfilePath = (username: string, extra?: string) => string;
