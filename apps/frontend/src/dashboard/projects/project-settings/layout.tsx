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
import useFetch from "@/src/hooks/fetch";
import NotFoundPage from "@/src/not-found";
import { PanelContent, PanelLayout, SidePanel, SidepanelLink } from "@/src/settings/panel";
import type { ProjectDataType } from "@/types";
import { CubeIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import PublishingChecklist from "../publishing-checklist";

export default function ProjectSettingsLayout() {
	const { projectUrlSlug } = useParams();
	const [projectData, setProjectData] = useState<ProjectDataType | null | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [baseUrl, setBaseUrl] = useState("");
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

	useEffect(() => {
		if (projectData?.url_slug) {
			setBaseUrl(`/project/${projectData?.url_slug}/settings`);
		}
	}, [projectData]);

	if (projectData === null) {
		return <NotFoundPage />;
	}

	return (
		<div className="w-full pb-32">
			<PanelLayout>
				<SidePanel>
					{loading === true || projectData === undefined ? (
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
											<BreadcrumbLink href={`/project/${projectData.url_slug}`}>{projectData?.name}</BreadcrumbLink>
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
		href: "general",
		icon: <GearIcon size="1rem" />,
	},
	{
		name: "Tags",
		href: "tags",
		icon: <TagsIcon size="1rem" />,
	},
	{
		name: "Description",
		href: "description",
		icon: <TextIcon size="1rem" />,
	},
	{
		name: "License",
		href: "license",
		icon: <CopyrightIcon size="1rem" />,
	},
	{
		name: "Links",
		href: "links",
		icon: <ChainIcon size="1rem" />,
	},
	{
		name: "Members",
		href: "members",
		icon: <PeopleIcon size="1rem" />,
	},
];

const viewPageLinks = [
	{
		name: "Analytics",
		href: "analytics",
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
