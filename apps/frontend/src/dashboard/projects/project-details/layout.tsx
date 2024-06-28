import CopyBtn from "@/components/copy-btn";
import {
    BookIcon,
    ChevronRightIcon,
    CrownIcon,
    DiscordIcon,
    DownloadIcon,
    GearIcon,
    PersonIcon,
} from "@/components/icons";
import ReleaseChannelIndicator from "@/components/release-channel-pill";
import { Button } from "@/components/ui/button";
import { AbsolutePositionedSpinner, SuspenseFallback } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormatVersionsList } from "@/lib/semver";
import { FormatProjectTypes } from "@/lib/utils";
import "@/src/globals.css";
import { PanelContent, PanelLayout, SidePanel } from "@/components/panel-layout";
import NotFoundPage from "@/src/not-found";
import { AuthContext } from "@/src/providers/auth-provider";
import { Projectcontext } from "@/src/providers/project-context";
import {
    BookmarkIcon,
    CalendarIcon,
    CodeIcon,
    CubeIcon,
    DotsHorizontalIcon,
    ExclamationTriangleIcon,
    HeartIcon,
    UpdateIcon,
} from "@radix-ui/react-icons";
import { CapitalizeAndFormatString, createURLSafeSlug, formatDate, timeSince } from "@root/lib/utils";
import type { ProjectDataType, ProjectVersionsList } from "@root/types";
import { time_past_phrases } from "@root/types";
import React, { Suspense, useContext } from "react";
import { Helmet } from "react-helmet";
import { Link, Outlet, NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import PublishingChecklist from "../publishing-checklist";
import "./../styles.css";

const timestamp_template = "${month} ${day}, ${year} at ${hours}:${minutes} ${amPm}";
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function ProjectDetailsLayout() {
    const { projectData, fetchingProjectData, featuredProjectVersions } = useContext(Projectcontext);
    const { session } = useContext(AuthContext);

    if (projectData === null) {
        return <NotFoundPage />;
    }

    return (
        <>
            <Helmet>
                <title>{`${projectData?.name} - ${CapitalizeAndFormatString(projectData?.type[0])} | CRMM`}</title>
                <meta name="description" content={projectData?.summary} />
            </Helmet>
            {projectData === undefined ? null : (
                <div className="w-full pb-32">
                    <PanelLayout>
                        <div className="w-full lg:w-80 flex items-center justify-center gap-4 flex-col">
                            <SidePanel>
                                <div className="w-full flex flex-col gap-1 p-2">
                                    <div className="w-fit p-2 bg-background-shallow rounded-xl">
                                        <CubeIcon className="w-20 h-20 text-foreground-muted" />
                                    </div>
                                    <h1 className="text-2xl font-semibold text-foreground">{projectData?.name}</h1>
                                    <Link
                                        to={`/${createURLSafeSlug(projectData.type[0]).value}s`}
                                        className=" w-fit flex items-start justify-start gap-2 text-foreground-muted hover:underline hover:underline-offset-2"
                                    >
                                        <CubeIcon className="w-4 h-4 mt-0.5" />
                                        <span className="leading-tight">{FormatProjectTypes(projectData.type)}</span>
                                    </Link>
                                    <p className="text-foreground-muted">{projectData?.summary}</p>
                                    <span className="w-full h-[1px] my-2 bg-border" />

                                    {/* // TODO: TO BE ADDED AFTER IMPLEMENTED */}
                                    {/* <div className="text-foreground-muted flex items-center justify-start gap-2">
											<DownloadIcon className="w-4 h-4" />
											<p className="flex gap-1 items-end justify-start">
												<strong className="text-xl text-foreground dark:text-foreground-muted">82.4k</strong>
												<span>downloads</span>
											</p>
										</div>
										<div className="text-foreground-muted flex items-center justify-start gap-2 mb-2">
											<HeartIcon className="w-4 h-4" />
											<p className="flex gap-1 items-end justify-start">
												<strong className="text-xl text-foreground dark:text-foreground-muted">3.8k</strong>
												<span>followers</span>
											</p>
										</div> */}

                                    <div className="flex items-center justify-start gap-2 text-foreground-muted">
                                        <CalendarIcon className="w-4 h-4" />
                                        <TooltipWrapper text={formatDate(new Date(projectData?.created_on), timestamp_template)}>
                                            <p>Created {timeSince(new Date(projectData?.created_on), time_past_phrases)}</p>
                                        </TooltipWrapper>
                                    </div>
                                    <div className="flex items-center justify-start gap-2 text-foreground-muted">
                                        <UpdateIcon className="w-4 h-4" />
                                        <TooltipWrapper text={formatDate(new Date(projectData?.updated_on), timestamp_template)}>
                                            <p>Updated {timeSince(new Date(projectData?.updated_on), time_past_phrases)}</p>
                                        </TooltipWrapper>
                                    </div>

                                    <span className="w-full h-[1px] my-2 bg-border" />

                                    <div className="w-full flex flex-wrap items-center justify-between gap-2">
                                        <Button className="gap-2 grow" variant="secondary">
                                            <HeartIcon className="w-4 h-4" />
                                            Follow
                                        </Button>
                                        <Button className="gap-2 grow" variant="secondary">
                                            <BookmarkIcon className="w-4 h-4" />
                                            Save
                                        </Button>
                                        <Button className="gap-2" variant="secondary" size="icon">
                                            <DotsHorizontalIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </SidePanel>

                            <AdditionalProjectDetailsCard
                                className="hidden lg:flex"
                                projectData={projectData}
                                featuredProjectVersions={featuredProjectVersions}
                            />
                        </div>
                        <PanelContent>
                            <Suspense fallback={<SuspenseFallback />}>
                                <PublishingChecklist />
                            </Suspense>
                            <ProjectDetailsNav
                                baseHref={`/${createURLSafeSlug(projectData?.type[0] || "").value}/${projectData?.url_slug}`}
                                user_id={session?.user_id}
                                members_id_list={projectData?.members?.map((member) => member.user.id) || []}
                            />
                            <Outlet />
                            <AdditionalProjectDetailsCard
                                className="flex lg:hidden"
                                projectData={projectData}
                                featuredProjectVersions={featuredProjectVersions}
                            />
                        </PanelContent>
                    </PanelLayout>
                </div>
            )}

            {fetchingProjectData ? <AbsolutePositionedSpinner size="lg" className="fixed" preventScroll={true} /> : null}
        </>
    );
}

export const ProjectMember = ({
    username,
    role,
    role_title,
    avatar_image,
}: { username: string; role: string; role_title: string; avatar_image: string }) => {
    return (
        <Link
            to={`/user/${username}`}
            role="link"
            className="w-full p-1 flex items-center justify-start gap-2 hover:bg-background-shallow rounded-lg"
        >
            <div className="flex shrink-0 items-center justify-center rounded-full bg-background-shallow h-12 w-12">
                {avatar_image ? (
                    <img src={avatar_image} alt={username} className="w-[100%] p-1 aspect-square rounded-full" />
                ) : (
                    <PersonIcon size="45%" className="text-foreground-muted" />
                )}
            </div>
            <div className="w-full flex flex-col items-start justify-start overflow-hidden">
                <div className="flex items-center justify-center gap-2">
                    <h2 className="text-sm font-semibold text-foreground-muted leading-tight">{username}</h2>
                    {role === "OWNER" && (
                        <TooltipWrapper text="Project owner">
                            <CrownIcon size="0.85rem" className="text-orange-500 dark:text-orange-400" />
                        </TooltipWrapper>
                    )}
                </div>
                <p className="text-foreground-muted text-sm">{role_title}</p>
            </div>
        </Link>
    );
};

const AdditionalProjectDetailsCard = ({
    className,
    projectData,
    featuredProjectVersions,
}: {
    className: string;
    projectData: ProjectDataType;
    featuredProjectVersions: ProjectVersionsList | null | undefined;
}) => {
    const navigate = useNavigate();

    return (
        <SidePanel className={className}>
            <div className="w-full flex flex-col gap-1 p-2">
                {projectData?.external_links?.issue_tracker_link ||
                    projectData?.external_links?.project_source_link ||
                    projectData?.external_links?.project_wiki_link ||
                    projectData?.external_links?.discord_invite_link ? (
                    <div className="w-full flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-foreground">External resources</h2>
                        <div className="w-full flex gap-x-3 gap-y-2 flex-wrap">
                            {projectData?.external_links?.issue_tracker_link ? (
                                <ExternalLink
                                    url={projectData?.external_links?.issue_tracker_link}
                                    label="Issues"
                                    icon={<ExclamationTriangleIcon className="w-4 h-4" />}
                                />
                            ) : null}

                            {projectData?.external_links?.project_source_link ? (
                                <ExternalLink
                                    url={projectData?.external_links?.project_source_link}
                                    label="Source"
                                    icon={<CodeIcon className="w-5 h-5" />}
                                />
                            ) : null}

                            {projectData?.external_links?.project_wiki_link ? (
                                <ExternalLink
                                    url={projectData?.external_links?.project_wiki_link}
                                    label="Wiki"
                                    icon={<BookIcon className="w-4 h-4" />}
                                />
                            ) : null}

                            {projectData?.external_links?.discord_invite_link ? (
                                <ExternalLink
                                    url={projectData?.external_links?.discord_invite_link}
                                    label="Discord"
                                    icon={<DiscordIcon className="w-4 h-4 text-foreground-muted fill-current dark:fill-current" />}
                                />
                            ) : null}
                        </div>
                        <span className="w-full h-[1px] my-2 bg-border" />
                    </div>
                ) : null}

                {featuredProjectVersions?.versions?.length ? (
                    <div className="w-full flex flex-col">
                        <div className="w-full flex items-center justify-between flex-wrap mb-3">
                            <h2 className="text-lg font-semibold text-foreground">Featured versions</h2>
                            <Link
                                to={`/${createURLSafeSlug(projectData?.type[0]).value}/${projectData?.url_slug}/versions#all-versions`}
                                className="text-blue-500 dark:text-blue-400 flex items-center justify-center gap-1 hover:underline underline-offset-2"
                            >
                                <span>See all</span>
                                <ChevronRightIcon size="1rem" />
                            </Link>
                        </div>
                        {featuredProjectVersions?.versions.map((version) => {
                            return (
                                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                                <div
                                    key={version.id}
                                    className="w-full flex items-start justify-start p-2 pb-2.5 rounded-lg cursor-pointer hover:bg-bg-hover gap-3"
                                    onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                                        if (
                                            // @ts-expect-error
                                            !e.target.closest(".versionFileDownloadLink") &&
                                            // @ts-expect-error
                                            !e.target.closest(".versionPageLink")
                                        ) {
                                            const link = `/${createURLSafeSlug(projectData?.type[0] || "").value}/${projectData?.url_slug
                                                }/version/${version.url_slug}`;
                                            if (window.location.pathname !== link) {
                                                window.scrollTo({ top: 0 });
                                                navigate(link);
                                            }
                                        }
                                    }}
                                >
                                    <a
                                        href={`${serverUrl}/api/file/${encodeURIComponent(version.files[0].file_url)}`}
                                        className="versionFileDownloadLink"
                                    >
                                        <Button tabIndex={-1} size={"icon"} className="h-fit w-fit p-2 rounded-lg">
                                            <DownloadIcon size="1.1rem" />
                                        </Button>
                                    </a>

                                    <div className="flex w-fit h-full grow flex-col gap-1 select-text">
                                        <Link
                                            to={`/${createURLSafeSlug(projectData?.type[0] || "").value}/${projectData?.url_slug
                                                }/version/${version.url_slug}`}
                                            className="versionPageLink w-fit"
                                        >
                                            <p className="text-lg leading-none font-semibold text-foreground-muted">
                                                {version.version_title}
                                            </p>
                                        </Link>
                                        <p className="text-foreground-muted leading-none text-pretty">
                                            {`${version.supported_loaders.map((loader) => CapitalizeAndFormatString(loader)).join(", ")} ${FormatVersionsList(version.supported_game_versions)}`}
                                        </p>
                                        <ReleaseChannelIndicator release_channel={version.release_channel} />
                                    </div>
                                </div>
                            );
                        })}
                        <span className="w-full h-[1px] my-2 bg-border" />
                    </div>
                ) : null}
                <h2 className="text-lg font-semibold text-foreground">Project members</h2>
                <div className="w-full flex items-center justify-center gap-2 flex-col">
                    {projectData?.members?.map((member) => {
                        return (
                            <React.Fragment key={member.user.user_name}>
                                <ProjectMember
                                    username={member.user.user_name}
                                    role={member.role}
                                    role_title={member.role_title}
                                    avatar_image={member.user.avatar_image || ""}
                                />
                            </React.Fragment>
                        );
                    })}
                </div>

                <span className="w-full h-[1px] my-2 bg-border" />

                <h2 className="text-lg font-semibold text-foreground">Technical information</h2>
                <div className="w-full grid grid-cols-2">
                    <span className="font-semibold text-foreground-muted">License</span>
                    {projectData?.license ? (
                        projectData?.licenseUrl ? (
                            <a
                                rel="noreferrer"
                                target="_blank"
                                href={projectData.licenseUrl}
                                className="w-fit text-blue-500 dark:text-blue-400 hover:underline underline-offset-2"
                            >
                                {projectData.license}
                            </a>
                        ) : (
                            <span className="text-foreground-muted">{projectData?.license}</span>
                        )
                    ) : (
                        <span className="text-foreground-muted">Unknown</span>
                    )}
                </div>
                <div className="grid grid-cols-2">
                    <span className="font-semibold text-foreground-muted">Client side</span>
                    <span className="text-foreground-muted">Unknown</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="font-semibold text-foreground-muted">Server side</span>
                    <span className="text-foreground-muted">Unknown</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="font-semibold text-foreground-muted">Project ID</span>
                    <div className="w-fit flex items-center justify-start gap-2 rounded pl-2 pr-1">
                        <CopyBtn
                            text={projectData.id}
                            label={`...${projectData.id.slice(projectData.id.length - 10)}`}
                            labelClassName="text-foreground-muted"
                        />
                    </div>
                </div>
            </div>
        </SidePanel>
    );
};

const ProjectDetailsNav = ({
    baseHref,
    user_id,
    members_id_list,
}: { baseHref: string; user_id: string | undefined; members_id_list: string[] }) => {
    const isProjectMember = user_id && (members_id_list || []).includes(user_id);

    const links = [
        {
            label: "Description",
            href: `${baseHref}/description`,
        },
        {
            label: "Gallery",
            href: `${baseHref}/gallery`,
        },
        {
            label: "Changelog",
            href: `${baseHref}/changelog`,
        },
        {
            label: "Versions",
            href: `${baseHref}/versions`,
        },
    ];

    return (
        <nav
            className="w-full flex flex-wrap items-center justify-betweens bg-background py-2 px-6 gap-x-4 gap-y-2 rounded-lg border border-border/75"
            id="project-page-nav"
        >
            <ul className="w-fit grow flex flex-wrap gap-x-4">
                {links.map((link) => {
                    return (
                        <li key={link.href} className="flex items-center justify-center">
                            <RouterNavLink
                                key={link.href}
                                aria-label={link.label}
                                to={link.href}
                                className="routerNavLink flex flex-col relative"
                            >
                                <span className="navLinkText py-0.5 flex items-center justify-center">{link.label}</span>
                                <span className="activityIndicator" />
                            </RouterNavLink>
                        </li>
                    );
                })}
            </ul>

            {isProjectMember === true && (
                <Link to={`${baseHref}/settings`}>
                    <Button className="gap-2" variant={"ghost"} tabIndex={-1}>
                        <GearIcon size="1.25rem" />
                        Settings
                    </Button>
                </Link>
            )}
        </nav>
    );
};

const TooltipWrapper = ({ children, text }: { text: string; children: React.ReactNode }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>{children}</TooltipTrigger>
                <TooltipContent className="text-sm">{text}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const ExternalLink = ({ url, label, icon }: { url: string; icon: React.ReactNode; label: string }) => {
    return (
        <Link to={url} className="flex items-center justify-center" target="_blank" referrerPolicy="no-referrer">
            <Button tabIndex={-1} variant={"link"} className="p-0 w-fit h-fit gap-1">
                {icon}
                {label}
            </Button>
        </Link>
    );
};
