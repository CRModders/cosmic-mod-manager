import { DiscordIcon, fallbackProjectIcon } from "@/components/icons";
import LoaderIcons from "@/components/loader-icons";
import { ImgWrapper } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import { ButtonLink, VariantButtonLink } from "@/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReleaseChannelChip from "@/components/ui/release-channel-pill";
import { FullWidthSpinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatVersionsListString, getGroupedVersionsList } from "@/lib/semver";
import { cn, formatDate, getProjectPagePathname, getProjectVersionPagePathname, imageUrl, timeSince } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import useTheme from "@/src/hooks/use-theme";
import { PopoverClose } from "@radix-ui/react-popover";
import { SITE_NAME_SHORT } from "@shared/config";
import { Capitalize, CapitalizeAndFormatString, parseFileSize } from "@shared/lib/utils";
import { getLoaderFromString } from "@shared/lib/utils/convertors";
import { ProjectPublishingStatus } from "@shared/types";
import type { ProjectDetailsData, TeamMember } from "@shared/types/api";
import {
    BookOpenIcon,
    BookmarkIcon,
    BugIcon,
    CalendarIcon,
    ClipboardCopyIcon,
    CodeIcon,
    CrownIcon,
    DownloadIcon,
    FlagIcon,
    GitCommitHorizontalIcon,
    HeartIcon,
    MoreVertical,
    SettingsIcon,
    SquareArrowOutUpRightIcon,
    TagsIcon,
    UserIcon
} from "lucide-react";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { Link, Outlet, useNavigate } from "react-router-dom";
import NotFoundPage from "../not-found";
import InteractiveDownloadPopup from "./interactive-download";
import ProjectNav from "./project-nav";
import "./styles.css";
import { ProjectSupprotedEnvironments } from "./supported-env";

const ProjectPageLayout = ({ projectType }: { projectType: string }) => {
    const { theme } = useTheme();
    const { projectData, featuredProjectVersions, currUsersMembership } = useContext(projectContext);
    const navigate = useNavigate();

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

                {/* SIDEBAR */}
                <div className="grid h-fit grid-cols-1 gap-panel-cards [grid-area:_sidebar]">
                    <Card className="w-full h-fit grid grid-cols-1 p-card-surround gap-3">
                        <h3 className="text-lg font-extrabold">Compatibility</h3>
                        <div>
                            <span className="flex font-bold text-muted-foreground pb-1">Game versions</span>
                            <div className="w-full flex flex-wrap gap-1">
                                {getGroupedVersionsList(projectData.gameVersions).map((version) => (
                                    <Chip key={version} className="text-muted-foreground">
                                        {version}
                                    </Chip>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="flex font-bold text-muted-foreground pb-1">Loaders</span>
                            <div className="w-full flex flex-wrap gap-1">
                                {projectData.loaders.map((loader) => {
                                    const loaderData = getLoaderFromString(loader);
                                    if (!loaderData) return null;
                                    const accentForeground = loaderData?.metadata?.accent?.foreground;
                                    // @ts-ignore
                                    const loaderIcon: React.ReactNode = LoaderIcons[loaderData.icon];

                                    return (
                                        <Chip
                                            key={loaderData.name}
                                            style={{
                                                color: accentForeground
                                                    ? theme === "dark"
                                                        ? accentForeground?.dark
                                                        : accentForeground?.light
                                                    : "hsla(var(--muted-foreground))",
                                            }}
                                        >
                                            {loaderIcon ? loaderIcon : null}
                                            {CapitalizeAndFormatString(loaderData.name)}
                                        </Chip>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <span className="flex font-bold text-muted-foreground pb-1">Environments</span>
                            <ProjectSupprotedEnvironments clientSide={projectData.clientSide} serverSide={projectData.serverSide} />
                        </div>
                    </Card>

                    {projectData?.issueTrackerUrl ||
                        projectData?.projectSourceUrl ||
                        projectData?.projectWikiUrl ||
                        projectData?.discordInviteUrl ? (
                        <Card className="p-card-surround grid grid-cols-1 gap-1">
                            <h3 className="text-lg font-bold pb-2">Links</h3>
                            {projectData?.issueTrackerUrl ? (
                                <ExternalLink
                                    url={projectData?.issueTrackerUrl}
                                    label="Report issues"
                                    icon={<BugIcon className="w-btn-icon h-btn-icon" />}
                                />
                            ) : null}

                            {projectData?.projectSourceUrl ? (
                                <ExternalLink
                                    url={projectData?.projectSourceUrl}
                                    label="View source"
                                    icon={<CodeIcon className="w-btn-icon h-btn-icon" />}
                                />
                            ) : null}

                            {projectData?.projectWikiUrl ? (
                                <ExternalLink
                                    url={projectData?.projectWikiUrl}
                                    label="Visit wiki"
                                    icon={<BookOpenIcon className="w-btn-icon h-btn-icon" />}
                                />
                            ) : null}

                            {projectData?.discordInviteUrl ? (
                                <ExternalLink
                                    url={projectData?.discordInviteUrl}
                                    label="Join Discord server"
                                    icon={<DiscordIcon className="w-btn-icon h-btn-icon fill-current dark:fill-current" />}
                                />
                            ) : null}
                        </Card>
                    ) : null}

                    {(featuredProjectVersions?.length || 0) > 0 ? (
                        <Card className="p-card-surround grid grid-cols-1 gap-1">
                            <h3 className="text-lg font-bold pb-2">Featured versions</h3>
                            <TooltipProvider>
                                {featuredProjectVersions?.map((version) => (
                                    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                                    <div
                                        key={version.id}
                                        className="w-full flex items-start justify-start p-1.5 pb-2 rounded cursor-pointer hover:bg-background/75 bg_hover_stagger gap-3"
                                        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                                            if (
                                                // @ts-expect-error
                                                !e.target.closest(".noClickRedirect")
                                            ) {
                                                const link = getProjectVersionPagePathname(
                                                    projectData.type?.[0],
                                                    projectData.slug,
                                                    version.slug,
                                                );
                                                if (window.location.pathname !== link) {
                                                    navigate(link);
                                                }
                                            }
                                        }}
                                    >
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href={version.primaryFile?.url}
                                                    className={cn(
                                                        "noClickRedirect flex-shrink-0",
                                                        buttonVariants({ variant: "default", size: "icon" }),
                                                    )}
                                                >
                                                    <DownloadIcon className="w-btn-icon-md h-btn-icon-md" />
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {version?.primaryFile?.name} ({parseFileSize(version.primaryFile?.size || 0)})
                                            </TooltipContent>
                                        </Tooltip>

                                        <div className="flex w-fit h-full grow flex-col select-text gap-1">
                                            <Link
                                                to={getProjectVersionPagePathname(projectData.type?.[0], projectData.slug, version.slug)}
                                                className="noClickRedirect w-fit"
                                            >
                                                <p className="font-semibold leading-none">{version.title}</p>
                                            </Link>
                                            <p className="text-pretty leading-tight text-muted-foreground">
                                                {version.loaders.map((loader) => CapitalizeAndFormatString(loader)).join(", ")}{" "}
                                                {formatVersionsListString(version.gameVersions)}
                                            </p>
                                            <ReleaseChannelChip releaseChannel={version.releaseChannel} />
                                        </div>
                                    </div>
                                ))}
                            </TooltipProvider>
                        </Card>
                    ) : null}

                    <Card className="p-card-surround grid grid-cols-1 gap-1">
                        <h3 className="text-lg font-bold pb-1">Creators</h3>
                        {projectData.members?.map((member) => {
                            return (
                                <ProjectMember
                                    key={member.userId}
                                    userName={member.userName}
                                    isOwner={member.isOwner}
                                    role={member.role || ""}
                                    avatarImageUrl={member.avatarUrl || ""}
                                />
                            );
                        })}
                    </Card>

                    <Card className="items-start justify-start p-card-surround grid grid-cols-1 gap-1">
                        <h3 className="text-lg font-bold pb-2">Details</h3>

                        <span className="text-muted-foreground italic text-sm">TODO: ADD LICENSE</span>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild className="cursor-text">
                                    <p className="w-fit max-w-full flex gap-2 items-center justify-start text-muted-foreground">
                                        <CalendarIcon className="w-btn-icon h-btn-icon" />
                                        Created {timeSince(new Date(projectData.datePublished))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>{formatDate(new Date(projectData.datePublished))}</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild className="cursor-text">
                                    <p className="w-fit max-w-full flex gap-2 items-center justify-start text-muted-foreground">
                                        <GitCommitHorizontalIcon className="w-btn-icon h-btn-icon" />
                                        Updated {timeSince(new Date(projectData.dateUpdated))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>{formatDate(new Date(projectData.dateUpdated))}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Card>
                </div>

                <div className="w-full flex flex-col gap-panel-cards [grid-area:_content]">
                    <ProjectNav
                        baseHref={`/${projectData?.type[0] || projectType}/${projectData?.slug || ""}`}
                        className="bg-card-background rounded-lg px-3 py-2"
                    />
                    <Outlet />
                </div>
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
        <div className="project-page-header w-full max-w-full mt-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-x-8 gap-y-6 pb-5 mb-2 border-0 border-b border-card-background dark:border-shallow-background">
            <div className="flex gap-5">
                <ImgWrapper
                    src={imageUrl(projectData.icon)}
                    alt={projectData.name}
                    className="bg-card-background dark:bg-shallow-background/50 shadow shadow-white dark:shadow-black"
                    fallback={fallbackProjectIcon}
                />
                <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h1 className="m-0 text-xl font-extrabold leading-none text-foreground-bright">{projectData.name}</h1>
                        {projectData.status !== ProjectPublishingStatus.PUBLISHED ? (
                            <span className="text-muted-foreground font-medium">{CapitalizeAndFormatString(projectData.status)}</span>
                        ) : null}
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
                                <Button
                                    className="w-full"
                                    variant="ghost"
                                    onClick={() => {
                                        navigator.clipboard.writeText(projectData.id);
                                    }}
                                >
                                    <ClipboardCopyIcon className="w-btn-icon h-btn-icon" />
                                    Copy ID
                                </Button>
                            </PopoverClose>
                        </PopoverContent>
                    </Popover>
                </div>
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
        <ButtonLink
            url={`/user/${userName}`}
            className={cn("py-1.5 px-2 h-fit items-start gap-3 font-normal hover:bg-background/75", className)}
        >
            <ImgWrapper
                src={avatarImageUrl}
                alt={userName}
                className="h-10 rounded-full"
                fallback={<UserIcon className="w-1/2 aspect-square text-muted-foreground" />}
            />
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

const ExternalLink = ({ url, label, icon }: { url: string; icon: React.ReactNode; label: string }) => {
    return (
        <Link to={url} className="flex items-center justify-start" target="_blank" referrerPolicy="no-referrer">
            <Button tabIndex={-1} variant={"link"} className="p-0 w-fit h-fit gap-2 text-muted-foreground">
                {icon}
                {label}
                <SquareArrowOutUpRightIcon className="w-btn-icon h-btn-icon text-extra-muted-foreground" />
            </Button>
        </Link>
    );
};
