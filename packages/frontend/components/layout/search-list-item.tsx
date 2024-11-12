import { formatDate, getProjectPagePathname, imageUrl, timeSince } from "@/lib/utils";
import { CapitalizeAndFormatString, getProjectCategoriesDataFromNames } from "@shared/lib/utils";
import { getLoadersFromNames } from "@shared/lib/utils/convertors";
import type { ProjectSupport } from "@shared/types";
import { CalendarIcon, DownloadIcon, HeartIcon, RefreshCcwIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { fallbackProjectIcon } from "../icons";
import { TagIcon } from "../tag-icons";
import { ImgWrapper } from "../ui/avatar";
import { Card } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import "./styles.css";

type ViewType = "gallery" | "list";

interface SearchListItemProps {
    projectName: string;
    projectType: string;
    projectSlug: string;
    icon: string | null;
    author?: string;
    summary: string;
    clientSide: ProjectSupport;
    serverSide: ProjectSupport;
    loaders: string[];
    featuredCategories: string[];
    downloads: number;
    followers: number;
    dateUpdated: Date;
    datePublished: Date;
    showDatePublished?: boolean;
    viewType?: ViewType;
}

const SearchListItem = ({ viewType = "list", ...props }: Omit<SearchListItemProps, "clientSide" | "serverSide">) => {
    if (viewType === "gallery") {
        return null;
    }
    return <ListView {...props} />;
};

export default SearchListItem;

const ListView = ({
    projectName,
    projectType,
    projectSlug,
    icon,
    author,
    summary,
    featuredCategories,
    loaders,
    downloads,
    followers,
    dateUpdated,
    datePublished,
    showDatePublished,
}: Omit<SearchListItemProps, "clientSide" | "serverSide" | "viewType">) => {
    const projectCategoriesData = getProjectCategoriesDataFromNames(featuredCategories);
    const loadersData = getLoadersFromNames(loaders);

    return (
        <Card className="searchItemWrapperGrid w-full grid gap-x-3 gap-y-2 p-card-surround text-muted-foreground">
            <Link
                to={getProjectPagePathname(projectType, projectSlug)}
                className="w-max h-fit flex shrink-0 relative items-start justify-center"
                style={{
                    gridArea: "icon",
                }}
                title={projectName}
                tabIndex={-1}
            >
                <ImgWrapper src={imageUrl(icon)} alt={projectName} fallback={fallbackProjectIcon} className="h-24 w-24 rounded-xl" />
            </Link>

            <div className="h-fit flex flex-wrap gap-2 items-baseline justify-start" style={{ gridArea: "title" }}>
                <Link to={getProjectPagePathname(projectType, projectSlug)} title={projectName}>
                    <h2 className="text-xl font-bold leading-none break-words sm:text-wrap">{projectName}</h2>
                </Link>

                {author ? (
                    <>
                        <p className="leading-none">
                            <span>by</span>
                            <Link to={`/user/${author}`} className="underline hover:brightness-110 px-1">
                                {author}
                            </Link>
                        </p>
                    </>
                ) : null}
            </div>

            <p className="leading-tight sm:text-pretty max-w-[80ch]" style={{ gridArea: "summary" }}>
                {summary}
            </p>

            <div
                className="w-full flex items-center justify-start gap-x-4 gap-y-0 flex-wrap text-extra-muted-foreground"
                style={{ gridArea: "tags" }}
            >
                {projectCategoriesData.map((category) => {
                    return (
                        <span className="flex gap-1 items-center justify-center" key={category.name}>
                            <TagIcon name={category.name} />
                            {CapitalizeAndFormatString(category.name)}
                        </span>
                    );
                })}

                {loadersData.map((loader) => {
                    if (loader.metadata.visibleInTagsList === false) return null;

                    return (
                        <span key={loader.name} className="flex gap-1 items-center justify-center">
                            <TagIcon name={loader.name} />
                            {CapitalizeAndFormatString(loader.name)}
                        </span>
                    );
                })}
            </div>

            <div
                className="flex flex-wrap items-start justify-between"
                style={{
                    gridArea: "stats",
                }}
            >
                <div className="flex flex-wrap justify-end items-end gap-x-5">
                    <div className="h-fit flex items-center justify-end gap-1.5">
                        <DownloadIcon className="w-[1.17rem] h-[1.17rem]" />
                        <p className="flex items-baseline justify-center gap-1">
                            <strong className="text-lg">{downloads}</strong>
                            <span className="hidden sm:inline-block">downloads</span>
                        </p>
                    </div>

                    <div className="h-fit flex items-center justify-end gap-1.5">
                        <HeartIcon className="w-[1.13rem] h-[1.13rem]" />
                        <p className="flex items-baseline justify-center gap-1">
                            <strong className="text-lg">{followers}</strong>
                            <span className="hidden sm:inline-block">followers</span>
                        </p>
                    </div>
                </div>

                <div className="h-fit flex items-center justify-end gap-1.5 whitespace-nowrap mt-auto ml-auto">
                    <TooltipProvider>
                        {showDatePublished === true ? (
                            <Tooltip>
                                <CalendarIcon className="w-[1.1rem] h-[1.1rem]" />
                                <TooltipTrigger asChild>
                                    <p className="flex items-baseline justify-center gap-1">
                                        <span>Published</span>
                                        <span>{timeSince(datePublished)}</span>
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>{formatDate(datePublished)}</TooltipContent>
                            </Tooltip>
                        ) : (
                            <Tooltip>
                                <RefreshCcwIcon className="w-[1.1rem] h-[1.1rem]" />

                                <TooltipTrigger asChild>
                                    <p className="flex items-baseline justify-center gap-1">
                                        <span>Updated</span>
                                        <span>{timeSince(dateUpdated)}</span>
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>{formatDate(dateUpdated)}</TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            </div>
        </Card>
    );
};

// const GalleryView =
