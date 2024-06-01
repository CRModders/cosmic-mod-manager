import CopyBtn from "@/components/copy-btn";
import { CrownIcon, GearIcon, PersonIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import "@/src/globals.css";
import useFetch from "@/src/hooks/fetch";
import NotFoundPage from "@/src/not-found";
import { PanelContent, PanelLayout, SidePanel } from "@/src/settings/panel";
import type { ProjectDataType } from "@/types";
import {
	BookmarkIcon,
	CalendarIcon,
	CubeIcon,
	DotsHorizontalIcon,
	DownloadIcon,
	HeartIcon,
	UpdateIcon,
} from "@radix-ui/react-icons";
import { formatDate, timeSince } from "@root/lib/utils";
import { time_past_phrases } from "@root/types";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, Outlet, NavLink as RouterNavLink, useNavigate, useParams } from "react-router-dom";
import PublishingChecklist from "../publishing-checklist";
import "./../styles.css";

const timestamp_template = "${month} ${day}, ${year} at ${hours}:${minutes} ${amPm}";

export default function ProjectDetailsLayout() {
	const { projectUrlSlug } = useParams();
	const [loading, setLoading] = useState(false);
	const [projectData, setProjectData] = useState<ProjectDataType | null | undefined>(undefined);
	const navigate = useNavigate();

	const fetchProjectData = async () => {
		setLoading(true);

		const response = await useFetch(`/api/project/${projectUrlSlug}`);
		setLoading(false);
		const result = await response.json();

		setProjectData(result?.data || null);

		if (result.data?.id && window.location.href.includes(result.data?.id)) {
			navigate(window.location.pathname.replace(result.data.id, result.data.url_slug));
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchProjectData();
	}, []);

	if (projectData === null) {
		return <NotFoundPage />;
	}

	return (
		<>
			<Helmet>
				<title>{projectData?.name ? `${projectData?.name} - ${projectData?.type} | CRMM` : "CRMM"}</title>
				<meta name="description" content={projectData?.summary} />
			</Helmet>
			<div className="w-full pb-32">
				<PanelLayout>
					<div className="w-full lg:w-80 flex items-center justify-center gap-4 flex-col">
						{loading === true || projectData === undefined ? (
							<div className="w-full min-h-[50vh] flex items-center justify-center">
								<Spinner size="2rem" />
							</div>
						) : (
							<>
								<SidePanel>
									<div className="w-full flex flex-col gap-1 p-2">
										<div className="w-fit p-2 bg-background-shallow rounded-xl">
											<CubeIcon className="w-20 h-20 text-foreground-muted" />
										</div>
										<h1 className="text-2xl font-semibold text-foreground">{projectData?.name}</h1>
										<div className="flex items-center justify-start gap-2 text-foreground-muted">
											<CubeIcon className="w-4 h-4" />
											<span>Mod</span>
										</div>
										<p className="text-foreground-muted">{projectData?.summary}</p>
										<span className="w-full h-[1px] my-2 bg-border" />

										<div className="text-foreground-muted flex items-center justify-start gap-2">
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
										</div>

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
								<SidePanel>
									<div className="w-full flex flex-col gap-1 p-2">
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
											<span className="text-foreground-muted">Unknown</span>
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
												/>
											</div>
										</div>
									</div>
								</SidePanel>
							</>
						)}
					</div>
					<PanelContent>
						<PublishingChecklist />
						<ProjectDetailsNav baseHref="/project/mekanism" />
						<Outlet />
					</PanelContent>
				</PanelLayout>
			</div>
		</>
	);
}

const ProjectMember = ({
	username,
	role,
	role_title,
	avatar_image,
}: { username: string; role: string; role_title: string; avatar_image: string }) => {
	return (
		<Link
			to={`/user/${username}`}
			className="w-full flex items-center justify-start gap-3 hover:bg-background-shallow rounded-lg"
		>
			<div className="flex shrink-0 items-center justify-center rounded-full bg-background-shallow h-14 w-14">
				{avatar_image ? (
					<img src={avatar_image} alt={username} className="w-[100%] p-1 aspect-square rounded-full" />
				) : (
					<PersonIcon size="45%" className="text-foreground-muted" />
				)}
			</div>
			<div className="flex flex-col items-start justify-center">
				<div className="flex items-center justify-center gap-2">
					<h2 className="text-base font-semibold text-foreground-muted leading-tight">{username}</h2>
					{role === "OWNER" && (
						<TooltipWrapper text="Project owner">
							<CrownIcon size="1rem" className="text-orange-500 dark:text-orange-400" />
						</TooltipWrapper>
					)}
				</div>
				<p className="text-foreground-muted text-sm">{role_title}</p>
			</div>
		</Link>
	);
};

const ProjectDetailsNav = ({ baseHref }: { baseHref: string }) => {
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
		<nav className="w-full flex items-center justify-betweens bg-background-shallow py-2 px-6 rounded-lg">
			<ul className="w-full flex flex-wrap gap-x-4 gap-y-2">
				{links.map((link) => {
					return (
						<li key={link.href} className="flex items-center justify-center">
							<RouterNavLink
								key={link.href}
								aria-label={link.label}
								to={link.href}
								className="routerNavLink flex flex-col relative"
							>
								<span className="navLinkText py-2 px-2 flex items-center justify-center">{link.label}</span>
								<span className="activityIndicator" />
							</RouterNavLink>
						</li>
					);
				})}
			</ul>

			<Link to={`${baseHref}/settings`}>
				<Button className="gap-2 hover:bg-background hover:text-foreground-muted text-foreground" variant={"ghost"}>
					<GearIcon size="1.25rem" />
					Settings
				</Button>
			</Link>
		</nav>
	);
};

const TooltipWrapper = ({ children, text }: { text: string; children: React.ReactNode }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent className="text-base">{text}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
