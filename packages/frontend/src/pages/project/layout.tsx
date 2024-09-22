import { DiscordIcon, ProjectStatusIcon, fallbackProjectIcon } from "@/components/icons";
import tagIcons from "@/components/tag-icons";
import { ImgWrapper } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import { ButtonLink, VariantButtonLink } from "@/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ReleaseChannelBadge } from "@/components/ui/release-channel-pill";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatGameVersionsList, formatGameVersionsListString } from "@/lib/semver";
import { cn, formatDate, getProjectPagePathname, getProjectVersionPagePathname, imageUrl, isCurrLinkActive, timeSince } from "@/lib/utils";
import { useSession } from "@/src/contexts/auth";
import { projectContext } from "@/src/contexts/curr-project";
import useTheme from "@/src/hooks/use-theme";
import { LoadingStatus } from "@/types";
import { PopoverClose } from "@radix-ui/react-popover";
import { SITE_NAME_SHORT } from "@shared/config";
import SPDX_LICENSE_LIST from "@shared/config/license-list";
import { Capitalize, CapitalizeAndFormatString, parseFileSize } from "@shared/lib/utils";
import { getLoaderFromString } from "@shared/lib/utils/convertors";
import { ProjectPublishingStatus } from "@shared/types";
import type { ProjectDetailsData, TeamMember } from "@shared/types/api";
import {
    BookOpenIcon,
    BookTextIcon,
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
    UserIcon,
} from "lucide-react";
import { Suspense, lazy, useContext } from "react";
import { Helmet } from "react-helmet";
import { Link, Outlet, useNavigate } from "react-router-dom";
import NotFoundPage from "../not-found";
import InteractiveDownloadPopup from "./interactive-download";
import SecondaryNav from "./secondary-nav";
import "./styles.css";
import { ProjectSupprotedEnvironments } from "./supported-env";

const JoinProjectBanner = lazy(() => import("./join-project-banner"));

const ProjectPageLayout = ({ projectType }: { projectType: string }) => {
    const { theme } = useTheme();
    const { fetchingProjectData, projectData, fetchProjectData, featuredProjectVersions, currUsersMembership } = useContext(projectContext);
    const navigate = useNavigate();

    if (!projectData || currUsersMembership.status === LoadingStatus.LOADING) return null;
    if (projectData === null && fetchingProjectData === false) return <NotFoundPage />;

    const isVersionDetailsPage = isCurrLinkActive(
        getProjectPagePathname(projectData.type[0], projectData.slug, "/version/"),
        location.pathname,
        false,
    );

    const projectEnvironments = ProjectSupprotedEnvironments({
        clientSide: projectData.clientSide,
        serverSide: projectData.serverSide,
    });

    const projectLicenseData = {
        id: projectData.licenseId,
        name: projectData.licenseName,
        url: projectData.licenseUrl,
        text: "",
    };

    for (const license of SPDX_LICENSE_LIST) {
        if (license.licenseId === projectData.licenseId) {
            projectLicenseData.name = license.name;
            projectLicenseData.text = license?.text || "";
            if (!projectLicenseData.url) {
                projectLicenseData.url = license.link;
            }
            break;
        }
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
                <PageHeader
                    projectData={projectData}
                    fetchProjectData={fetchProjectData}
                    projectType={projectType}
                    currUsersMembership={currUsersMembership.data}
                />

                {/* SIDEBAR */}
                <div className="grid h-fit grid-cols-1 gap-panel-cards [grid-area:_sidebar]">
                    <Card className="w-full h-fit grid grid-cols-1 p-card-surround gap-3">
                        <h3 className="text-lg font-extrabold">Compatibility</h3>
                        <div>
                            <span className="flex font-bold text-muted-foreground pb-1">Game versions</span>
                            <div className="w-full flex flex-wrap gap-1">
                                {formatGameVersionsList(projectData.gameVersions).map((version) => (
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
                                    const loaderIcon: React.ReactNode = tagIcons[loaderData.name];

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
                        {projectEnvironments?.length ? (
                            <>
                                <div className="flex flex-wrap items-start justify-start gap-1">
                                    <span className="block w-full font-bold text-muted-foreground">Environments</span>
                                    {projectEnvironments.map((item, i) => {
                                        return (
                                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                            <Chip key={i}>{item}</Chip>
                                        );
                                    })}
                                </div>
                            </>
                        ) : null}
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
                                        className="w-full flex items-start justify-start p-2 pb-2.5 rounded cursor-pointer text-muted-foreground hover:bg-background/75 bg_hover_stagger gap-2 group/card"
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
                                        <div className="relative flex items-center justify-center min-w-10">
                                            <ReleaseChannelBadge
                                                releaseChannel={version.releaseChannel}
                                                className=" group-hover/card:hidden group-focus-within/card:hidden"
                                            />
                                            <Tooltip>
                                                <TooltipTrigger
                                                    asChild
                                                    className="hidden group-hover/card:flex group-focus-within/card:flex"
                                                >
                                                    <a
                                                        href={version.primaryFile?.url}
                                                        className={cn(
                                                            "noClickRedirect flex-shrink-0",
                                                            isVersionDetailsPage
                                                                ? buttonVariants({ variant: "secondary", size: "icon" })
                                                                : buttonVariants({ variant: "default", size: "icon" }),
                                                            "!w-10 !h-10 rounded-full",
                                                        )}
                                                        aria-label={`download ${version.title}`}
                                                        download={version.primaryFile?.name}
                                                    >
                                                        <DownloadIcon className="w-[1.07rem] h-[1.07rem]" strokeWidth={2.2} />
                                                    </a>
                                                </TooltipTrigger>
                                                <TooltipContent className="hidden group-hover/card:flex group-focus-within/card:flex">
                                                    {version?.primaryFile?.name} ({parseFileSize(version.primaryFile?.size || 0)})
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>

                                        <div className="flex w-fit h-full grow flex-col select-text">
                                            <Link
                                                to={getProjectVersionPagePathname(projectData.type?.[0], projectData.slug, version.slug)}
                                                className="noClickRedirect w-fit"
                                            >
                                                <p className="font-bold leading-tight">{version.title}</p>
                                            </Link>
                                            <p className="text-pretty leading-tight">
                                                {version.loaders.map((loader) => CapitalizeAndFormatString(loader)).join(", ")}{" "}
                                                {formatGameVersionsListString(version.gameVersions)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </TooltipProvider>
                        </Card>
                    ) : null}

                    <Card className="p-card-surround grid grid-cols-1 gap-1">
                        <h3 className="text-lg font-bold pb-1">Creators</h3>
                        {projectData.members?.map((member) => {
                            if (member.accepted !== true) return null;
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

                        {projectLicenseData?.id || projectLicenseData?.name ? (
                            <div className="flex items-center justify-start gap-2 text-muted-foreground">
                                <BookTextIcon className="w-btn-icon h-btn-icon shrink-0" />
                                <p>
                                    LICENSED{" "}
                                    {projectLicenseData.url ? (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={projectLicenseData.url}
                                            className="font-bold link_blue"
                                        >
                                            {projectLicenseData.id || projectLicenseData.name}
                                        </a>
                                    ) : (
                                        <span className="font-bold">{projectLicenseData.id || projectLicenseData.name}</span>
                                    )}
                                </p>
                            </div>
                        ) : null}

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
                    <SecondaryNav
                        urlBase={`/${projectData?.type[0] || projectType}/${projectData?.slug || ""}`}
                        className="bg-card-background rounded-lg px-3 py-2"
                        links={[
                            {
                                label: "Description",
                                href: "",
                            },
                            {
                                label: "Gallery",
                                href: "/gallery",
                            },
                            {
                                label: "Changelog",
                                href: "/changelog",
                            },
                            {
                                label: "Versions",
                                href: "/versions",
                            },
                        ]}
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
    fetchProjectData,
}: {
    projectData: ProjectDetailsData;
    projectType: string;
    currUsersMembership: TeamMember | null;
    fetchProjectData: () => Promise<void>;
}) => {
    const { session } = useSession();

    let invitedMember = null;
    if (currUsersMembership?.accepted !== true) {
        for (const member of projectData.members) {
            if (member.userId === session?.id && member.accepted === false) {
                invitedMember = member;
                break;
            }
        }
    }

    return (
        <div className="w-full flex flex-col [grid-area:_header] gap-1">
            <div className="w-full max-w-full mt-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-x-8 gap-y-6 pb-5 mb-2 border-0 border-b border-card-background dark:border-shallow-background">
                <div className="flex gap-5">
                    <ImgWrapper
                        src={imageUrl(projectData.icon)}
                        alt={projectData.name}
                        className="bg-card-background dark:bg-shallow-background/50 shadow shadow-white dark:shadow-black rounded-lg"
                        fallback={fallbackProjectIcon}
                    />
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <h1 className="m-0 text-xl font-extrabold leading-none text-foreground-bright">{projectData.name}</h1>
                            {projectData.status !== ProjectPublishingStatus.PUBLISHED ? (
                                <span className="flex items-center justify-center gap-1 text-muted-foreground font-medium">
                                    <ProjectStatusIcon status={projectData.status} />
                                    {CapitalizeAndFormatString(projectData.status)}
                                </span>
                            ) : null}
                        </div>
                        <h2 className="text-muted-foreground leading-tight line-clamp-2 max-w-[70ch]">{projectData.summary}</h2>
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
                        <Button variant={"secondary-inverted"} className="rounded-full w-11 h-11 p-0" aria-label="Follow">
                            <HeartIcon className="w-btn-icon-lg h-btn-icon-lg" />
                        </Button>
                        <Button variant={"secondary-inverted"} className="rounded-full w-11 h-11 p-0" aria-label="Add to collection">
                            <BookmarkIcon className="h-btn-icon-lg w-btn-icon-lg" />
                        </Button>
                        {currUsersMembership?.id ? (
                            <VariantButtonLink
                                url={getProjectPagePathname(projectType, projectData.slug, "/settings")}
                                variant={"secondary-inverted"}
                                className="rounded-full w-11 h-11 p-0"
                                label="project settings"
                            >
                                <SettingsIcon className="h-btn-icon-lg w-btn-icon-lg" />
                            </VariantButtonLink>
                        ) : null}

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"ghost-inverted"} className="rounded-full w-11 h-11 p-0" aria-label="more options">
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
            {invitedMember && (
                <Suspense>
                    <JoinProjectBanner fetchProjectData={fetchProjectData} role={invitedMember.role} teamId={projectData.teamId} />
                </Suspense>
            )}
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
                src={imageUrl(avatarImageUrl)}
                alt={userName}
                className="h-10 rounded-full"
                fallback={<UserIcon className="w-1/2 aspect-square text-muted-foreground" />}
            />
            <div className="w-full flex flex-col items-start justify-start overflow-x-hidden">
                <div className="flex items-baseline-with-fallback justify-center gap-2">
                    <span className="font-semibold text-sm text-foreground" title={userName}>
                        {userName}
                    </span>
                    {isOwner === true && (
                        <CrownIcon className="w-btn-icon-sm h-btn-icon-sm shrink-0 text-orange-500 dark:text-orange-400" />
                    )}
                </div>
                <span className="text-sm leading-tight">{role}</span>
            </div>
        </ButtonLink>
    );
};

const ExternalLink = ({ url, label, icon }: { url: string; icon: React.ReactNode; label: string }) => {
    return (
        <Link to={url} className="w-fit flex items-center justify-start" target="_blank" referrerPolicy="no-referrer">
            <Button tabIndex={-1} variant={"link"} className="p-0 w-fit h-fit gap-2 text-muted-foreground">
                {icon}
                {label}
                <SquareArrowOutUpRightIcon className="w-btn-icon h-btn-icon text-extra-muted-foreground" />
            </Button>
        </Link>
    );
};
