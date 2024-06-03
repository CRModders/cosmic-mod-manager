import {
	BarChartIcon,
	ChainIcon,
	CopyrightIcon,
	GearIcon,
	PeopleIcon,
	PhotoIcon,
	TagsIcon,
	TextIcon,
	VersionIcon,
} from "@/components/icons";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Spinner } from "@/components/ui/spinner";
import "@/src/globals.css";
import NotFoundPage from "@/src/not-found";
import { AuthContext } from "@/src/providers/auth-provider";
import { Projectcontext } from "@/src/providers/project-context";
import { PanelContent, PanelLayout, SidePanel, SidepanelLink } from "@/src/settings/panel";
import { CubeIcon } from "@radix-ui/react-icons";
import { createURLSafeSlug } from "@root/lib/utils";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import PublishingChecklist from "../publishing-checklist";

export function ProjectSettingsLayoutContent({
	projectType,
	projectUrlSlug,
}: { projectType: string; projectUrlSlug: string }) {
	const [baseUrl, setBaseUrl] = useState("");
	const { projectData, fetchingProjectData } = useContext(Projectcontext);
	const { session } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (projectData?.url_slug) {
			setBaseUrl(`/${createURLSafeSlug(projectData?.type || "").value}/${projectData?.url_slug}`);
		}
	}, [projectData]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (session === undefined) return;

		if (!session?.user_id) {
			return navigate(`/${projectType}/${projectUrlSlug}`);
		}

		if (session?.user_id && projectData?.members) {
			for (const member of projectData.members) {
				if (member?.user?.id === session.user_id) return;
			}
			return navigate(`/${projectType}/${projectUrlSlug}`);
		}
	}, [session, projectData]);

	if (projectData === null) {
		return <NotFoundPage />;
	}

	return (
		<div className="w-full pb-32">
			<PanelLayout>
				<SidePanel>
					{fetchingProjectData === true || projectData === undefined ? (
						<div className="w-full min-h-[50vh] flex items-center justify-center">
							<Spinner size="2rem" />
						</div>
					) : (
						<>
							<div className="w-full px-1">
								<Breadcrumb>
									<BreadcrumbList>
										<BreadcrumbItem>
											<BreadcrumbLink href="/dashboard/projects">Projects</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											<BreadcrumbLink href={`/${createURLSafeSlug(projectData.type).value}/${projectData.url_slug}`}>
												{projectData?.name}
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											<BreadcrumbPage>Settings</BreadcrumbPage>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</div>

							<div className="mt-4 flex gap-2">
								<span className="p-2 rounded-lg bg-background-shallow">
									<CubeIcon className="w-10 h-10 text-foreground-muted" />
								</span>
								<div className="flex flex-col items-start justify-center">
									<h2 className="text-lg text-foreground font-semibold">{projectData?.name}</h2>
									<p className="capitalize text-foreground-muted font-semibold">{projectData?.status?.toLowerCase()}</p>
								</div>
							</div>

							<div className="w-full mt-6">
								<h1 className="w-full px-1 text-2xl font-semibold mb-2 text-foreground">Project settings</h1>
								<ul className="w-full flex flex-col items-start justify-center gap-1">
									{SidePanelLinks?.map((link) => {
										return (
											<React.Fragment key={link.href}>
												<SidepanelLink href={`${baseUrl}/${link.href}`} label={link.name} icon={link.icon} />
											</React.Fragment>
										);
									})}
								</ul>
							</div>
							<div className="w-full mt-4">
								<h1 className="w-full px-1 text-xl font-semibold mb-2 text-foreground">View</h1>
								<ul className="w-full flex flex-col items-start justify-center gap-1">
									{viewPageLinks?.map((link) => {
										return (
											<React.Fragment key={link.href}>
												<SidepanelLink href={`${baseUrl}/${link.href}`} label={link.name} icon={link.icon} />
											</React.Fragment>
										);
									})}
								</ul>
							</div>
							<div className="w-full mt-4">
								<h1 className="w-full px-1 text-xl font-semibold mb-2 text-foreground">Upload</h1>
								<ul className="w-full flex flex-col items-start justify-center gap-1">
									{UploadPageLinks?.map((link) => {
										return (
											<React.Fragment key={link.href}>
												<SidepanelLink href={`${baseUrl}/${link.href}`} label={link.name} icon={link.icon} />
											</React.Fragment>
										);
									})}
								</ul>
							</div>
						</>
					)}
				</SidePanel>
				<PanelContent>
					<PublishingChecklist />
					<Outlet />
				</PanelContent>
			</PanelLayout>
		</div>
	);
}

const SidePanelLinks = [
	{
		name: "General",
		href: "settings/general",
		icon: <GearIcon size="1rem" />,
	},
	{
		name: "Tags",
		href: "settings/tags",
		icon: <TagsIcon size="1rem" />,
	},
	{
		name: "Description",
		href: "settings/description",
		icon: <TextIcon size="1rem" />,
	},
	{
		name: "License",
		href: "settings/license",
		icon: <CopyrightIcon size="1rem" />,
	},
	{
		name: "Links",
		href: "settings/links",
		icon: <ChainIcon size="1rem" />,
	},
	{
		name: "Members",
		href: "settings/members",
		icon: <PeopleIcon size="1rem" />,
	},
];

const viewPageLinks = [
	{
		name: "Analytics",
		href: "settings/analytics",
		icon: <BarChartIcon size="1rem" />,
	},
];

const UploadPageLinks = [
	{
		name: "Gallery",
		href: "gallery",
		icon: <PhotoIcon size="1rem" />,
	},
	{
		name: "Versions",
		href: "versions",
		icon: <VersionIcon size="1rem" />,
	},
];

export default function ProjectSettingsLayout({ projectType }: { projectType: string }) {
	const { projectUrlSlug } = useParams();
	return (
		<>
			<Helmet>
				<title>Project settings | CRMM</title>
				<meta name="description" content="Your projects on crmm." />
			</Helmet>
			<ProjectSettingsLayoutContent projectUrlSlug={projectUrlSlug || ""} projectType={projectType || ""} />
		</>
	);
}
