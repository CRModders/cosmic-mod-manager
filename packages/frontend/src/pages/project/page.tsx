import { DiscordIcon } from "@/components/icons";
import { ContentCardTemplate } from "@/components/layout/panel";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import ReleaseChannelChip from "@/components/ui/release-channel-pill";
import { SuspenseFallback } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatVersionsListString, getGroupedVersionsList } from "@/lib/semver";
import { cn, formatDate, getProjectVersionPagePathname, timeSince } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import { CapitalizeAndFormatString, parseFileSize } from "@shared/lib/utils";
import { BookOpenIcon, BugIcon, CalendarIcon, CodeIcon, DownloadIcon, GitCommitHorizontalIcon, SquareArrowOutUpRightIcon } from "lucide-react";
import { Suspense, lazy, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProjectMember } from "./layout";
import { ProjectSupprotedEnvironments } from "./supported-env";

const MarkdownRenderBox = lazy(() => import("@/components/layout/md-editor/render-md"));

const ProjectPage = () => {
    const { projectData, featuredProjectVersions } = useContext(projectContext);
    const navigate = useNavigate();

    if (!projectData) return null;

    return (
        <>
            {projectData.id && projectData.description ? (
                <Suspense fallback={<SuspenseFallback />}>
                    <ContentCardTemplate className="w-full gap-0 [grid-area:_content]">
                        <MarkdownRenderBox text={projectData.description || ""} />
                    </ContentCardTemplate>
                </Suspense>
            ) : (
                <div className="w-full flex [grid-area:_content]">
                    <span className="text-muted-foreground italic">No project description provided</span>
                </div>
            )}
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
                            {projectData.loaders.map((loader) => (
                                <Chip key={loader} className="text-muted-foreground">
                                    {CapitalizeAndFormatString(loader)}
                                </Chip>
                            ))}
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

                {
                    (featuredProjectVersions?.length || 0) > 0 ? (
                        <Card className="p-card-surround grid grid-cols-1 gap-1">
                            <h3 className="text-lg font-bold pb-2">Featured versions</h3>
                            <TooltipProvider>
                                {featuredProjectVersions?.map((version) => (
                                    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                                    <div
                                        key={version.id}
                                        className="w-full flex items-start justify-start p-1.5 pb-2 rounded cursor-pointer hover:bg-background bg_hover_stagger gap-3"
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
                                                <a href={version.primaryFile?.url} className={cn("noClickRedirect flex-shrink-0", buttonVariants({ variant: "default", size: "icon" }))}>
                                                    <DownloadIcon className="w-btn-icon-md h-btn-icon-md" />
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {version?.primaryFile?.name} ({parseFileSize(version.primaryFile?.size || 0)})
                                            </TooltipContent>
                                        </Tooltip>


                                        <div className="flex w-fit h-full grow flex-col select-text gap-1">
                                            <Link
                                                to={getProjectVersionPagePathname(
                                                    projectData.type?.[0],
                                                    projectData.slug,
                                                    version.slug,
                                                )}
                                                className="noClickRedirect w-fit"
                                            >
                                                <p className="font-semibold leading-none">{version.title}</p>
                                            </Link>
                                            <p className="text-pretty leading-tight text-muted-foreground">
                                                {version.loaders.map((loader) => (CapitalizeAndFormatString(loader))).join(", ")} {formatVersionsListString(version.gameVersions)}
                                            </p>
                                            <ReleaseChannelChip releaseChannel={version.releaseChannel} />
                                        </div>
                                    </div>
                                ))}
                            </TooltipProvider>
                        </Card>
                    ) : null
                }

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
        </>
    );
};

export default ProjectPage;

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
