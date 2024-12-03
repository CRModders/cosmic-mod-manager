import { PopoverClose } from "@radix-ui/react-popover";
import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import {
    cn,
    formatDate,
    getOrgPagePathname,
    getProjectPagePathname,
    getProjectVersionPagePathname,
    imageUrl,
    isCurrLinkActive,
    timeSince,
} from "@root/utils";
import { formatGameVersionsList, formatGameVersionsListString } from "@root/utils/version";
import SPDX_LICENSE_LIST from "@shared/config/license-list";
import { Capitalize, CapitalizeAndFormatString, parseFileSize } from "@shared/lib/utils";
import { getLoadersFromNames } from "@shared/lib/utils/convertors";
import type { LoggedInUserData } from "@shared/types";
import type { ProjectDetailsData, ProjectListItem, ProjectVersionData, TeamMember } from "@shared/types/api";
import {
    BookmarkIcon,
    BookOpenIcon,
    BookTextIcon,
    BugIcon,
    CalendarIcon,
    ClipboardCopyIcon,
    CodeIcon,
    CrownIcon,
    DownloadIcon,
    FlagIcon,
    GitCommitHorizontalIcon,
    HeartIcon,
    SettingsIcon,
    SquareArrowOutUpRightIcon,
    TagsIcon,
} from "lucide-react";
import type React from "react";
import { Suspense, useContext } from "react";
import { DownloadAnimationContext } from "~/components/download-animation";
import { DiscordIcon, fallbackOrgIcon, fallbackProjectIcon, fallbackUserIcon } from "~/components/icons";
import { PageHeader } from "~/components/layout/page-header";
import RefreshPage from "~/components/refresh-page";
import tagIcons from "~/components/tag-icons";
import { ImgWrapper } from "~/components/ui/avatar";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import Chip from "~/components/ui/chip";
import Link, { ButtonLink, useCustomNavigate, VariantButtonLink } from "~/components/ui/link";
import { ReleaseChannelBadge } from "~/components/ui/release-channel-pill";
import { Separator } from "~/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import useTheme from "~/hooks/theme";
import InteractiveDownloadPopup from "./interactive-download";
import TeamInvitationBanner from "./join-project-banner";
import SecondaryNav from "./secondary-nav";
import "./styles.css";
import { ProjectSupprotedEnvironments } from "./supported-env";

export interface ProjectLayoutProps {
    session: LoggedInUserData | null;
    projectData: ProjectDetailsData;
    allProjectVersions: ProjectVersionData[];
    featuredProjectVersions: ProjectVersionData[] | null;
    dependencies: {
        projects: ProjectListItem[];
        versions: ProjectVersionData[];
    };
    currUsersMembership: TeamMember | null;
}

export default function ProjectPageLayout({
    session,
    projectData,
    allProjectVersions,
    featuredProjectVersions,
    dependencies,
    currUsersMembership,
}: ProjectLayoutProps) {
    const { theme } = useTheme();
    const { show: showDownloadAnimation } = useContext(DownloadAnimationContext);
    const navigate = useNavigate();
    const customNavigate = useCustomNavigate();
    const location = useLocation();

    if (!projectData) return null;

    const isVersionDetailsPage = isCurrLinkActive(
        getProjectPagePathname(projectData?.type[0], projectData.slug, "/version/"),
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

    const listedLoaders = getLoadersFromNames(projectData.loaders).filter((loader) => loader.metadata.visibleInLoadersList);
    const projectType = projectData.type?.[0] || "project";

    return (
        <main className="project-page-layout w-full max-w-full pb-12 gap-panel-cards">
            <ProjectInfoHeader
                session={session}
                projectData={projectData}
                allVersions={allProjectVersions}
                fetchProjectData={async () => RefreshPage(navigate, location)}
                projectType={projectType}
                currUsersMembership={currUsersMembership}
            />

            {/* SIDEBAR */}
            <div className="grid h-fit grid-cols-1 gap-panel-cards [grid-area:_sidebar]">
                <Card className="w-full h-fit grid grid-cols-1 p-card-surround gap-3">
                    <h2 className="text-lg font-extrabold">Compatibility</h2>
                    <section>
                        <h3 className="flex font-bold text-muted-foreground pb-1">Game versions</h3>
                        <div className="w-full flex flex-wrap gap-1">
                            {formatGameVersionsList(projectData.gameVersions).map((version) => (
                                <Chip key={version} className="text-muted-foreground">
                                    {version}
                                </Chip>
                            ))}
                        </div>
                    </section>

                    {listedLoaders.length ? (
                        <section>
                            <h3 className="flex font-bold text-muted-foreground pb-1">Loaders</h3>
                            <div className="w-full flex flex-wrap gap-1">
                                {listedLoaders.map((loader) => {
                                    const accentForeground = loader?.metadata?.accent?.foreground;
                                    // @ts-ignore
                                    const loaderIcon: React.ReactNode = tagIcons[loader.name];

                                    return (
                                        <Chip
                                            key={loader.name}
                                            style={{
                                                color: accentForeground
                                                    ? theme === "dark"
                                                        ? accentForeground?.dark
                                                        : accentForeground?.light
                                                    : "hsla(var(--muted-foreground))",
                                            }}
                                        >
                                            {loaderIcon ? loaderIcon : null}
                                            {CapitalizeAndFormatString(loader.name)}
                                        </Chip>
                                    );
                                })}
                            </div>
                        </section>
                    ) : null}

                    {projectEnvironments?.length ? (
                        <section className="flex flex-wrap items-start justify-start gap-1">
                            <h3 className="block w-full font-bold text-muted-foreground">Environments</h3>
                            {projectEnvironments.map((item, i) => {
                                return (
                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                    <Chip key={i}>{item}</Chip>
                                );
                            })}
                        </section>
                    ) : null}
                </Card>

                {projectData?.issueTrackerUrl ||
                projectData?.projectSourceUrl ||
                projectData?.projectWikiUrl ||
                projectData?.discordInviteUrl ? (
                    <Card className="p-card-surround grid grid-cols-1 gap-1">
                        <h2 className="text-lg font-bold pb-2">Links</h2>
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
                        <h2 className="text-lg font-bold pb-2">Featured versions</h2>
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
                                                customNavigate(link);
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
                                            <TooltipTrigger asChild className="hidden group-hover/card:flex group-focus-within/card:flex">
                                                <a
                                                    href={version.primaryFile?.url}
                                                    className={cn(
                                                        "noClickRedirect flex-shrink-0",
                                                        isVersionDetailsPage
                                                            ? buttonVariants({ variant: "secondary-inverted", size: "icon" })
                                                            : buttonVariants({ variant: "default", size: "icon" }),
                                                        "!w-10 !h-10 rounded-full",
                                                    )}
                                                    aria-label={`download ${version.title}`}
                                                    download={version.primaryFile?.name}
                                                    onClick={showDownloadAnimation}
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
                                            prefetch="render"
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
                    <h2 className="text-lg font-bold pb-1">Creators</h2>
                    {projectData.organisation?.id ? (
                        <>
                            <ProjectMember
                                vtId={projectData.organisation.id}
                                url={getOrgPagePathname(projectData.organisation.slug)}
                                userName={projectData.organisation.name}
                                isOwner={false}
                                roleName={"Organization"}
                                avatarImageUrl={imageUrl(projectData.organisation.icon)}
                                avatarClassName="rounded"
                                fallbackIcon={fallbackOrgIcon}
                            />

                            {projectData.members.length ? <Separator className="my-1" /> : null}
                        </>
                    ) : null}

                    {projectData.members?.map((member) => {
                        if (member.accepted !== true) return null;
                        return (
                            <ProjectMember
                                vtId={member.userId}
                                key={member.userId}
                                userName={member.userName}
                                isOwner={member.isOwner}
                                roleName={member.role || ""}
                                avatarImageUrl={member.avatarUrl || ""}
                            />
                        );
                    })}
                </Card>

                <Card className="items-start justify-start p-card-surround grid grid-cols-1 gap-1">
                    <h2 className="text-lg font-bold pb-2">Details</h2>

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
                                        className="font-bold link_blue hover:underline"
                                        title={projectLicenseData.url}
                                    >
                                        {projectLicenseData.id || projectLicenseData.name}
                                    </a>
                                ) : (
                                    <span className="font-bold" title={projectLicenseData.text}>
                                        {projectLicenseData.id || projectLicenseData.name}
                                    </span>
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

            <div className="h-fit overflow-auto grid grid-cols-1 gap-panel-cards [grid-area:_content]">
                <SecondaryNav
                    urlBase={`/${projectData?.type[0] || projectType}/${projectData?.slug || ""}`}
                    className="h-fit bg-card-background rounded-lg px-3 py-2"
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

                <Outlet
                    context={
                        {
                            session,
                            projectData,
                            allProjectVersions,
                            featuredProjectVersions,
                            dependencies,
                            currUsersMembership,
                        } satisfies ProjectLayoutProps
                    }
                />
            </div>
        </main>
    );
}

const ProjectInfoHeader = ({
    session,
    projectData,
    allVersions,
    projectType,
    currUsersMembership,
    fetchProjectData,
}: {
    session: LoggedInUserData | null;
    projectData: ProjectDetailsData;
    allVersions: ProjectVersionData[];
    projectType: string;
    currUsersMembership: TeamMember | null;
    fetchProjectData: () => Promise<void>;
}) => {
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
            <PageHeader
                vtId={projectData.id}
                icon={imageUrl(projectData.icon)}
                iconClassName="rounded"
                fallbackIcon={fallbackProjectIcon}
                title={projectData.name}
                description={projectData.summary}
                actionBtns={
                    <>
                        <InteractiveDownloadPopup projectData={projectData} allProjectVersions={allVersions} />
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
                                prefetch="render"
                            >
                                <SettingsIcon className="h-btn-icon-lg w-btn-icon-lg" />
                            </VariantButtonLink>
                        ) : null}
                    </>
                }
                threeDotMenu={
                    <>
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
                    </>
                }
            >
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
            </PageHeader>

            {invitedMember && (
                <Suspense>
                    <TeamInvitationBanner refreshData={fetchProjectData} role={invitedMember.role} teamId={projectData.teamId} />
                </Suspense>
            )}
        </div>
    );
};

interface ProjectMemberProps {
    vtId?: string;
    userName: string;
    isOwner: boolean;
    roleName: string;
    avatarImageUrl: string;
    className?: string;
    url?: string;
    avatarClassName?: string;
    fallbackIcon?: React.ReactNode;
}

export function ProjectMember({
    vtId,
    userName,
    isOwner,
    roleName,
    avatarImageUrl,
    className,
    url,
    avatarClassName,
    fallbackIcon,
}: ProjectMemberProps) {
    return (
        <ButtonLink
            aria-label={userName}
            url={url || `/user/${userName}`}
            className={cn("py-1.5 px-2 h-fit items-start gap-3 font-normal hover:bg-background/75", className)}
        >
            <ImgWrapper
                vtId={vtId}
                src={imageUrl(avatarImageUrl)}
                alt={userName}
                className={cn("h-10 w-10 rounded-full", avatarClassName)}
                fallback={fallbackIcon || fallbackUserIcon}
                loading="eager"
            />
            <div className="w-full flex flex-col items-start justify-start overflow-hidden">
                <div className="flex items-baseline-with-fallback justify-center gap-1">
                    <span className="font-semibold leading-tight" title={userName}>
                        {userName}
                    </span>
                    {isOwner === true && (
                        <CrownIcon className="w-btn-icon-sm h-btn-icon-sm shrink-0 text-orange-500 dark:text-orange-400" />
                    )}
                </div>
                <span className="text-sm font-medium leading-tight text-muted-foreground/75">{roleName}</span>
            </div>
        </ButtonLink>
    );
}

const ExternalLink = ({ url, label, icon }: { url: string; icon: React.ReactNode; label: string }) => {
    return (
        <Link
            to={url}
            className="w-fit flex items-center justify-start p-0 gap-2 text-muted-foreground hover:underline"
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
            {label}
            <SquareArrowOutUpRightIcon className="w-btn-icon h-btn-icon text-extra-muted-foreground" />
        </Link>
    );
};
