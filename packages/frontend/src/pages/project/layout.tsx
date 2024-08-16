import { CubeIcon, DiscordIcon } from "@/components/icons";
import { ContentCardTemplate, Panel, PanelAside, PanelContent } from "@/components/layout/panel";
import AvatarImg from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CopyBtn from "@/components/ui/copy-btn";
import { ButtonLink } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { FullWidthSpinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatDate, timeSince } from "@/lib/utils";
import { Projectcontext } from "@/src/contexts/curr-project";
import { SITE_NAME_SHORT } from "@shared/config";
import { Capitalize } from "@shared/lib/utils";
import type { ProjectDetailsData } from "@shared/types/api";
import {
    BookOpenIcon,
    BookmarkIcon,
    CalendarIcon,
    CodeIcon,
    CrownIcon,
    HeartIcon,
    MoreHorizontalIcon,
    RefreshCcwIcon,
    SquareArrowOutUpRightIcon,
    TriangleAlertIcon,
    UserIcon,
} from "lucide-react";
import type React from "react";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { Link, Outlet, useParams } from "react-router-dom";
import NotFoundPage from "../not-found";
import ProjectNav from "./project-nav";

const ProjectPageLayout = ({ projectType }: { projectType: string }) => {
    const { slug } = useParams();
    const { projectData } = useContext(Projectcontext);

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

            <Panel className="pb-12">
                <PanelAside className="flex flex-col gap-panel-cards">
                    <ContentCardTemplate className="flex flex-col items-start justify-center gap-1">
                        <AvatarImg
                            url={projectData.icon || ""}
                            alt={projectData.name}
                            fallback={<CubeIcon className="w-3/4 h-3/4 text-muted-foreground" />}
                            imgClassName="rounded"
                            wrapperClassName="rounded h-24"
                        />

                        <h2 className="font-semibold text-xl mt-1 leading-tight mb-0.5">{projectData?.name}</h2>
                        <div className="w-full flex flex-col items-start justify-start gap-0.5 text-muted-foreground">
                            <Link to={`/${projectType}s`} className="flex items-center justify-center gap-2 hover:underline">
                                <CubeIcon className="w-4 h-4" />
                                {Capitalize(projectType)}
                            </Link>
                            <p>{projectData?.summary}</p>
                        </div>
                        <Separator className="my-1.5" />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild className="cursor-text">
                                    <p className="flex gap-2 items-center justify-center text-muted-foreground">
                                        <CalendarIcon className="w-btn-icon h-btn-icon" />
                                        Created {timeSince(new Date(projectData.datePublished))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>{formatDate(new Date(projectData.datePublished))}</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild className="cursor-text">
                                    <p className="flex gap-2 items-center justify-center text-muted-foreground">
                                        <RefreshCcwIcon className="w-btn-icon h-btn-icon" />
                                        Updated {timeSince(new Date(projectData.dateUpdated))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>{formatDate(new Date(projectData.dateUpdated))}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Separator className="my-1.5" />

                        <div className="w-full flex flex-wrap items-center justify-between gap-2">
                            <Button variant={"secondary"} className="grow">
                                <HeartIcon className="w-btn-icon h-btn-icon" />
                                Follow
                            </Button>
                            <Button variant={"secondary"} className="grow">
                                <BookmarkIcon className="w-btn-icon h-btn-icon" />
                                Save
                            </Button>
                            <Button variant={"secondary"} className="aspect-square p-0">
                                <MoreHorizontalIcon className="w-btn-icon h-btn-icon" />
                            </Button>
                        </div>
                    </ContentCardTemplate>

                    <AdditionalProjectDetails projectData={projectData} className="hidden lg:flex" />
                </PanelAside>

                <PanelContent>
                    <ContentCardTemplate className="px-3 py-2" cardClassname="!p-0">
                        <ProjectNav
                            baseHref={`/${projectData?.type[0] || projectType}/${projectData?.slug || slug}`}
                            isAProjectMember={true}
                        />
                    </ContentCardTemplate>
                    <Outlet />
                    <AdditionalProjectDetails projectData={projectData} className="flex lg:hidden" />
                </PanelContent>
            </Panel>
        </>
    );
};

export default ProjectPageLayout;

const AdditionalProjectDetails = ({ projectData, className }: { projectData: ProjectDetailsData; className?: string }) => {
    return (
        <div className={cn("w-full flex flex-col items-start justify-start gap-panel-cards", className)}>
            {projectData?.issueTrackerUrl ||
            projectData?.projectSourceUrl ||
            projectData?.projectWikiUrl ||
            projectData?.discordInviteUrl ? (
                <ContentCardTemplate title="Links" className="items-start justify-start" headerClassName="pb-3" titleClassName="text-lg">
                    <div className="w-full flex items-start justify-center flex-col gap-y-1.5">
                        {projectData?.issueTrackerUrl ? (
                            <ExternalLink
                                url={projectData?.issueTrackerUrl}
                                label="Report issues"
                                icon={<TriangleAlertIcon className="w-btn-icon h-btn-icon" />}
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
                    </div>
                </ContentCardTemplate>
            ) : null}

            <ContentCardTemplate className={cn("w-full flex flex-col items-start justify-start gap-1", className)}>
                <h2 className="text-lg font-semibold mb-1">Project members</h2>
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

                <Separator className="my-2" />

                <h2 className="text-lg font-semibold">Technical information</h2>
                <div className="w-full flex flex-col items-start justify-center gap-0.5">
                    <div className="w-full grid grid-cols-[max-content,_1fr] gap-x-4 gap-y-0.5 items-center justify-start">
                        <span>License</span>
                        {projectData.licenseName ? (
                            projectData.licenseUrl ? (
                                <Link to={projectData.licenseUrl}>{projectData.licenseName} </Link>
                            ) : (
                                <span>{projectData.licenseName}</span>
                            )
                        ) : (
                            <span className="text-muted-foreground">Unknown</span>
                        )}

                        <span>Client side</span>
                        <span className="text-muted-foreground">{Capitalize(projectData.clientSide)}</span>

                        <span>Server side</span>
                        <span className="text-muted-foreground">{Capitalize(projectData.serverSide)}</span>

                        <span>Project ID</span>
                        <CopyBtn
                            id="project-layout-sidenav-project-id-copy-btn"
                            text={projectData.id}
                            label={projectData.id}
                            maxLabelChars={12}
                        />
                    </div>
                </div>
            </ContentCardTemplate>
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
        <ButtonLink url={`/user/${userName}`} className={cn("py-1.5 px-2 h-fit items-start gap-3 font-normal", className)}>
            <AvatarImg url={avatarImageUrl} alt={userName} fallback={<UserIcon className="w-1/2 aspect-square text-muted-foreground" />} />
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
        <Link to={url} className="flex items-center justify-center" target="_blank" referrerPolicy="no-referrer">
            <Button tabIndex={-1} variant={"link"} className="p-0 w-fit h-fit gap-2 text-muted-foreground">
                {icon}
                {label}
                <SquareArrowOutUpRightIcon className="w-btn-icon h-btn-icon text-extra-muted-foreground" />
            </Button>
        </Link>
    );
};
