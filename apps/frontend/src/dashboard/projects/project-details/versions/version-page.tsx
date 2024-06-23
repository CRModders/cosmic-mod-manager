import CopyBtn from "@/components/copy-btn";
import { ChevronRightIcon, DownloadIcon, EditIcon, FlagIcon, TrashIcon } from "@/components/icons";
import MarkdownRenderBox from "@/components/md-render-box";
import ReleaseChannelIndicator from "@/components/release-channel-pill";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { CubeLoader } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { FormatVersionsList } from "@/lib/semver";
import { cn, constructVersionPageUrl } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { useIsUseAProjectMember } from "@/src/hooks/project-member";
import NotFoundPage from "@/src/not-found";
import { Projectcontext } from "@/src/providers/project-context";
import { ContentWrapperCard } from "@/src/settings/panel";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FileIcon, StarIcon } from "@radix-ui/react-icons";
import { CapitalizeAndFormatString, formatDate, parseFileSize } from "@root/lib/utils";
import type { ProjectVersionData } from "@root/types";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProjectMember } from "../layout";

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function ProjectVersionPage({ projectType }: { projectType: string }) {
	const { projectUrlSlug, versionUrlSlug } = useParams();
	const [versionData, setVersionData] = useState<ProjectVersionData | null>(null);
	const isAProjectMember = useIsUseAProjectMember();
	const { projectData, fetchFeaturedProjectVersions, fetchAllProjectVersions } = useContext(Projectcontext);
	const [deleteVersionDialogOpen, setDeleteVersionDialogOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchVersiondata = async () => {
		setLoading(true);

		const response = await useFetch(`/api/project/${projectUrlSlug}/version/${versionUrlSlug}`);
		const result = await response.json();
		setLoading(false);
		const data = result?.data as ProjectVersionData;
		setVersionData(data || null);
	};

	const deleteVersion = async () => {
		setLoading(true);

		const response = await useFetch(`/api/project/${projectUrlSlug}/version/${versionUrlSlug}/delete`);
		setLoading(false);
		const result = await response.json();

		if (!response.ok) {
			return toast({
				title: result?.message,
				variant: "destructive",
			});
		}

		toast({
			title: result?.message,
		});

		navigate(`/${projectType}/${projectUrlSlug}/versions`);

		if (versionData?.versions[0].is_featured === true) {
			await Promise.all([fetchAllProjectVersions(), fetchFeaturedProjectVersions()]);
		} else {
			await fetchAllProjectVersions();
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchVersiondata();
	}, [versionUrlSlug]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (versionData?.versions[0].url_slug) {
			const constructedUrl = constructVersionPageUrl(versionData.versions[0].url_slug);
			if (window.location.href.replace(window.location.origin, "") !== constructedUrl) {
				navigate(constructedUrl);
			}
		}
	}, [versionData]);

	if (loading === true) {
		return (
			<div className="w-full flex items-center justify-center py-4">
				<CubeLoader size="lg" />
			</div>
		);
	}

	if (versionData === null) {
		return <NotFoundPage />;
	}

	return (
		<div className="w-full flex flex-col gap-4">
			<ContentWrapperCard className="items-start p-6 gap-4">
				<div className="w-full">
					<Breadcrumb>
						<BreadcrumbList className="flex items-center">
							<BreadcrumbItem>
								<BreadcrumbLink href={`/${projectType}/${projectUrlSlug}/versions`} className="text-lg">
									Versions
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="flex items-center justify-center">
								<ChevronRightIcon size="1rem" className=" text-foreground" />
							</BreadcrumbSeparator>
							<BreadcrumbItem>
								<BreadcrumbPage className="text-lg">{versionData?.versions[0].version_title}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
				<div className="w-full flex gap-4 items-center justify-start">
					<h1 className=" text-foreground font-semibold text-3xl">{versionData?.versions[0].version_title}</h1>
					{versionData?.versions[0].is_featured && (
						<>
							<div className="flex items-center justify-center gap-1 text-foreground-muted">
								<StarIcon className="w-4 h-4" />
								<span>Featured</span>
							</div>
						</>
					)}
				</div>

				<div className="flex flex-wrap gap-x-4 gap-y-3">
					<a href={`${serverUrl}/api/file/${encodeURIComponent(versionData?.versions[0].files[0].file_url)}`}>
						<Button className="gap-2" tabIndex={-1}>
							<DownloadIcon size="1.15rem" />
							Download
						</Button>
					</a>

					<Button variant={"secondary"} className="gap-2">
						<FlagIcon size="1rem" />
						Report
					</Button>

					{isAProjectMember === true && (
						<>
							<Link to={`/${projectType}/${projectUrlSlug}/version/${versionData?.versions[0].url_slug}/edit`}>
								<Button variant={"secondary"} className="gap-2" tabIndex={-1}>
									<EditIcon className="w-4 h-4" />
									Edit
								</Button>
							</Link>

							<Dialog open={deleteVersionDialogOpen} onOpenChange={setDeleteVersionDialogOpen}>
								<DialogTrigger asChild>
									<Button variant={"secondary"} className="gap-2 text-danger-text">
										<TrashIcon size="1rem" />
										<p>Delete</p>
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle className="font-semibold text-foreground-muted text-lg">
											Delete version{" "}
											<span className="italic font-normal">{versionData?.versions[0].version_title}</span>
										</DialogTitle>
									</DialogHeader>
									<p className="text-foreground-muted">
										Are you sure you want to delete version{" "}
										<span className=" font-semibold">{versionData?.versions[0].version_title}</span> of project{" "}
										<span className=" font-semibold">{projectData?.name}</span> ?
									</p>
									<DialogFooter className="flex flex-row items-center justify-end">
										<DialogClose asChild>
											<Button variant={"secondary"}>Cancel</Button>
										</DialogClose>
										<Button className="gap-2" variant={"destructive"} onClick={deleteVersion}>
											<TrashIcon size="1.25rem" />
											Delete
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</>
					)}
				</div>
			</ContentWrapperCard>

			<div className="w-full gap-4 grid grid-cols-1 xl:grid-cols-[70%_1fr]">
				<div className="w-full flex flex-col gap-4">
					{versionData?.versions[0]?.changelog?.length ? (
						<ContentWrapperCard className="w-full items-start flex-wrap">
							<h1 className="text-foreground font-semibold text-2xl">Changelog</h1>
							<MarkdownRenderBox text={versionData?.versions[0]?.changelog} />
						</ContentWrapperCard>
					) : null}

					<ContentWrapperCard className="items-start">
						<h1 className="text-foreground font-semibold text-2xl">Files</h1>
						<div className="w-full flex flex-col gap-4">
							{versionData?.versions[0]?.files?.map((versionFile) => {
								return (
									<div
										key={versionFile.id}
										className={cn(
											"w-full flex flex-wrap sm:flex-nowrap items-center justify-between px-6 py-3 gap-x-4 gap-y-2 rounded-lg border-2 border-border",
											versionFile.is_primary === true && "bg-bg-hover",
										)}
									>
										<div className="flex items-center gap-x-4 flex-wrap">
											<div className="flex items-center justify-center gap-2">
												<FileIcon className="w-5 h-5 text-foreground-muted" />
												<p className="w-fit font-semibold text-foreground-muted mr-2">{versionFile.file_name}</p>
											</div>
											<span className="text-sm text-foreground-muted">{parseFileSize(versionFile.file_size)}</span>
											{versionFile.is_primary ? (
												<span className="text-sm text-foreground-muted italic">Primary</span>
											) : null}
										</div>

										<a href={`${serverUrl}/api/file/${encodeURIComponent(versionData?.versions[0].files[0].file_url)}`}>
											<Button className="gap-2" tabIndex={-1}>
												<DownloadIcon size="1.15rem" />
												Download
											</Button>
										</a>
									</div>
								);
							})}
						</div>
					</ContentWrapperCard>
				</div>

				<ContentWrapperCard className="h-fit">
					<h1 className="text-foreground font-semibold text-2xl">Metadata</h1>

					<div className="w-full flex flex-col gap-4">
						{[
							{
								label: "Release channel",
								element: <ReleaseChannelIndicator release_channel={versionData?.versions[0].release_channel} />,
							},
							{
								label: "Version number",
								element: (
									<p className="text-foreground-muted leading-none text-base px-1">
										{versionData.versions[0].version_number}
									</p>
								),
							},
							{
								label: "Loaders",
								element: (
									<p className="text-foreground-muted leading-none text-base px-1">
										{versionData.versions[0].supported_loaders
											.map((loader) => CapitalizeAndFormatString(loader))
											.join(", ")}
									</p>
								),
							},
							{
								label: "Game versions",
								element: (
									<p className="text-foreground-muted leading-tight text-pretty text-base px-1">
										{FormatVersionsList(versionData.versions[0].supported_game_versions)}
									</p>
								),
							},
							// TODO: ADD THIS BACK WHEN IMPLEMENTED
							// {
							// 	label: "Downloads",
							// 	element: <p className="text-foreground-muted leading-none text-base px-1">{"// Not implemented yet"}</p>,
							// },
							{
								label: "Publication date",
								element: (
									<p className="text-foreground-muted leading-none text-base px-1">
										{formatDate(
											new Date(versionData?.versions[0].published_on),
											"${month} ${day}, ${year} at ${hours}:${minutes} ${amPm}",
										)}
									</p>
								),
							},
							{
								label: "Publisher",
								element: (
									<ProjectMember
										username={versionData?.versions[0].publisher.user.user_name}
										role={versionData?.versions[0].publisher.role_title}
										role_title={versionData?.versions[0].publisher.role_title}
										avatar_image={versionData?.versions[0].publisher.user.avatar_image}
									/>
								),
							},
							{
								label: "Version ID",
								element: (
									<div className="w-full flex items-center justify-start">
										<CopyBtn
											text={versionData.versions[0].id}
											label={`${versionData.versions[0].id.slice(0)}`}
											className="px-1"
											labelClassName="text-foreground-muted"
										/>
									</div>
								),
							},
						].map((item) => {
							return (
								<div key={item.label} className="w-full flex flex-col">
									<p className="text-lg font-semibold text-foreground-muted">{item.label}</p>
									{item.element}
								</div>
							);
						})}
					</div>
				</ContentWrapperCard>
			</div>
		</div>
	);
}
