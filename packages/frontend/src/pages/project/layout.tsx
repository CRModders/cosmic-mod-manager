import { ImgWrapper } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import { ButtonLink, VariantButtonLink } from "@/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FullWidthSpinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getProjectPagePathname, imageUrl } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import { PopoverClose } from "@radix-ui/react-popover";
import { SITE_NAME_SHORT } from "@shared/config";
import { Capitalize } from "@shared/lib/utils";
import type { ProjectDetailsData, TeamMember } from "@shared/types/api";
import { BookmarkIcon, ClipboardCopyIcon, CrownIcon, DownloadIcon, FlagIcon, HeartIcon, MoreVertical, SettingsIcon, TagsIcon, UserIcon } from "lucide-react";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import NotFoundPage from "../not-found";
import InteractiveDownloadPopup from "./interactive-download";
import ProjectNav from "./project-nav";
import "./styles.css";

const ProjectPageLayout = ({ projectType }: { projectType: string }) => {
    const { projectData, currUsersMembership } = useContext(projectContext);

    if (projectData === undefined) {
        return <FullWidthSpinner />;
    }

    if (projectData === null) {
        return <NotFoundPage />;
    }

    return (
        <>
            <Helmet>
                <title>
                    {projectData?.name || ""} | {SITE_NAME_SHORT}
                </title>
                <meta name="description" content={projectData?.summary || " "} />
            </Helmet>

            <div className="project-page-layout pb-12 gap-panel-cards">
                <PageHeader projectData={projectData} projectType={projectType} currUsersMembership={currUsersMembership} />
                <Outlet />
            </div>
        </>
    );
};

export default ProjectPageLayout;

const PageHeader = ({
    projectData,
    projectType,
    currUsersMembership,
}: { projectData: ProjectDetailsData; projectType: string; currUsersMembership: TeamMember | null }) => {
    return (
        <div className="project-page-header w-full max-w-full mt-4">
            <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-x-8 gap-y-6 pb-6 mb-4 border-0 border-b border-card-background dark:border-shallow-background">
                <div className="flex gap-5">
                    <ImgWrapper
                        src={imageUrl(projectData.icon)}
                        alt={projectData.name}
                        className="bg-card-background dark:bg-shallow-background/50 shadow shadow-white dark:shadow-black"
                    />
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="m-0 text-xl font-extrabold leading-none text-foreground-bright">{projectData.name}</h1>
                        </div>
                        <p className="text-muted-foreground leading-tight line-clamp-2 max-w-[70ch]">{projectData.summary}</p>
                        <div className="mt-auto flex flex-wrap gap-4 text-muted-foreground">
                            <div className="flex items-center gap-3 border-0 border-r border-card-background dark:border-shallow-background pr-4">
                                <DownloadIcon className="w-btn-icon-md h-btn-icon-md" />
                                <span className="font-semibold">{projectData.downloads}</span>
                            </div>
                            <div className="flex items-center gap-3 border-0 border-r border-card-background dark:border-shallow-background pr-4">
                                <HeartIcon className="w-btn-icon-md h-btn-icon-md" />
                                <span className="font-semibold">{projectData.followers}</span>
                            </div>
                            {(projectData.featuredCategories?.length || 0) > 0 ? (
                                <div className="hidden md:flex items-center gap-3 pr-4">
                                    <TagsIcon className="w-btn-icon-lg h-btn-icon-lg" />
                                    <div className="flex items-center gap-2">
                                        {projectData.featuredCategories.map((category) => (
                                            <Chip key={category} className="bg-card-background dark:bg-shallow-background/75">
                                                {Capitalize(category)}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <InteractiveDownloadPopup />
                        <Button
                            variant={"secondary"}
                            className="rounded-full w-11 h-11 p-0 bg-card-background hover:bg-card-background/70 dark:bg-shallow-background/75 dark:hover:bg-shallow-background"
                        >
                            <HeartIcon className="w-btn-icon-lg h-btn-icon-lg" />
                        </Button>
                        <Button
                            variant={"secondary"}
                            className="rounded-full w-11 h-11 p-0 bg-card-background hover:bg-card-background/70 dark:bg-shallow-background/75 dark:hover:bg-shallow-background"
                        >
                            <BookmarkIcon className="h-btn-icon-lg w-btn-icon-lg" />
                        </Button>
                        {currUsersMembership?.id ? (
                            <VariantButtonLink
                                url={getProjectPagePathname(projectType, projectData.slug, "/settings")}
                                variant={"secondary"}
                                className="rounded-full w-11 h-11 p-0 bg-card-background hover:bg-card-background/70 dark:bg-shallow-background/75 dark:hover:bg-shallow-background"
                            >
                                <SettingsIcon className="h-btn-icon-lg w-btn-icon-lg" />
                            </VariantButtonLink>
                        ) : null}

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"ghost"}
                                    className="rounded-full w-11 h-11 p-0 hover:bg-card-background/70 dark:hover:bg-shallow-background"
                                >
                                    <MoreVertical className="h-btn-icon-lg w-btn-icon-lg" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-fit flex flex-col gap-1 items-center justify-center min-w-0 p-2">
                                <Button variant="ghost-destructive" className="w-full">
                                    <FlagIcon className="w-btn-icon h-btn-icon" />
                                    Report
                                </Button>
                                <PopoverClose asChild>
                                    <Button className="w-full" variant="ghost" onClick={() => { navigator.clipboard.writeText(projectData.id) }}>
                                        <ClipboardCopyIcon className="w-btn-icon h-btn-icon" />
                                        Copy ID
                                    </Button>
                                </PopoverClose>
                            </PopoverContent>
                        </Popover>

                    </div>
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <Card className="w-min max-w-full rounded-full p-1 overflow-auto">
                    <ProjectNav baseHref={`/${projectData?.type[0] || projectType}/${projectData?.slug || ""}`} />
                </Card>
            </div>
        </div>
    );
};

export const ProjectMember = ({
    userName,
    isOwner,
    role,
    avatarImageUrl,
    className,
}: { userName: string; isOwner: boolean; role: string; avatarImageUrl: string; className?: string }) => {
    return (
        <ButtonLink url={`/user/${userName}`} className={cn("py-1.5 px-2 h-fit items-start gap-3 font-normal hover:bg-background", className)}>
            <ImgWrapper src={avatarImageUrl} alt={userName} className="h-10 rounded-full" fallback={<UserIcon className="w-1/2 aspect-square text-muted-foreground" />} />
            <div className="w-full flex flex-col items-start justify-start overflow-x-hidden">
                <div className="flex items-center justify-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{userName}</span>
                    {isOwner === true && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CrownIcon className="w-[0.8rem] h-[0.8rem] text-orange-500 dark:text-orange-400" />
                                </TooltipTrigger>
                                <TooltipContent>Project owner</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                <span className="text-sm leading-tight">{role}</span>
            </div>
        </ButtonLink>
    );
};

export const fullWidthLayoutStyles = {
    gridRowStart: "content",
    gridRowEnd: "content",
    gridColumnStart: "sidebar",
    gridColumnEnd: "content",
};