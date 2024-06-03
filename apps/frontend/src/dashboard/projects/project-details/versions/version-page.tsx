import CopyBtn from "@/components/copy-btn";
import { ChevronRightIcon, EditIcon, FlagIcon, TrashIcon } from "@/components/icons";
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
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { useIsUseAProjectMember } from "@/src/hooks/project-member";
import NotFoundPage from "@/src/not-found";
import { Projectcontext } from "@/src/providers/project-context";
import { ContentWrapperCard } from "@/src/settings/panel";
import type { ProjectVersionData } from "@/types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DownloadIcon, FileIcon, StarIcon } from "@radix-ui/react-icons";
import { CapitalizeAndFormatString, formatDate, parseFileSize } from "@root/lib/utils";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProjectMember } from "../layout";

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
		const result = await response.json();
		setLoading(false);

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
		if (versionData?.versions[0].url_slug && !window.location.pathname.includes(versionData?.versions[0].url_slug)) {
			navigate(window.location.pathname.replace(versionData?.versions[0].id, versionData?.versions[0].url_slug));
		}
	}, [versionData]);

	if (loading === true) {
		return (
			<div className="w-full flex items-center justify-center py-4">
				<Spinner size="1.5rem" />
			</div>
		);
	}

	if (versionData === null) {
		return <NotFoundPage />;
	}

	return (
		<div className="w-full flex flex-col gap-4">
			<ContentWrapperCard className="items-start">
				<div className="w-full px-1">
					<Breadcrumb>
						<BreadcrumbList className="flex items-center">
							<BreadcrumbItem>
								<BreadcrumbLink href={`/${projectType}/${projectUrlSlug}/versions`} className=" text-base">
									Versions
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="flex items-center justify-center">
								<ChevronRightIcon size="1rem" className=" text-foreground" />
							</BreadcrumbSeparator>
							<BreadcrumbItem>
								<BreadcrumbPage>{versionData?.versions[0].version_title}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
				<div className="w-full flex gap-6 items-center justify-start">
					<h1 className=" text-foreground font-semibold text-2xl">{versionData?.versions[0].version_title}</h1>
					{versionData?.versions[0].is_featured && (
						<>
							<div className="flex items-center justify-center gap-1 text-foreground-muted">
								<StarIcon className="w-4 h-4" />
								<p>Featured</p>
							</div>
						</>
					)}
				</div>

				<div className="flex flex-wrap gap-x-4 gap-y-3">
					<a
						href={`${window.location.origin}/api/file/${encodeURIComponent(
							versionData?.versions[0].files[0].file_url,
						)}`}
					>
						<Button
							className="bg-accent-bg hover:bg-accent-bg/85 dark:text-foreground font-semibold gap-2"
							tabIndex={-1}
						>
							<DownloadIcon className="w-4 h-4" />
							<p>Download</p>
						</Button>
					</a>

					<Button variant={"secondary"} className="gap-2 text-foreground-muted">
						<FlagIcon size="1rem" />
						<p>Report</p>
					</Button>

					{isAProjectMember === true && (
						<>
							<Link to={`/${projectType}/${projectUrlSlug}/version/${versionData?.versions[0].url_slug}/edit`}>
								<Button variant={"secondary"} className="text-foreground-muted gap-2" tabIndex={-1}>
									<EditIcon className="w-4 h-4" />
									<p>Edit</p>
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
											Delete version {versionData?.versions[0].version_title}
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
										<Button
											className="gap-2 bg-danger-bg dark:text-foreground hover:bg-danger-bg/85"
											onClick={deleteVersion}
										>
											<TrashIcon size="1.25rem" />
											<span>Delete</span>
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</>
					)}
				</div>
			</ContentWrapperCard>

			<div className="w-full flex flex-wrap lg:flex-nowrap gap-4">
				<div className="w-fit grow flex flex-col gap-4">
					{versionData?.versions[0]?.changelog?.length ? (
						<ContentWrapperCard className="items-start flex-wrap">
							<h1 className="text-foreground font-semibold text-2xl">Changelog</h1>
							<p className="text-foreground/95 text-base">
								{versionData?.versions[0]?.changelog.split("\n").map((txt, index) => {
									const key = index;
									return (
										<span key={key} className="flex">
											{txt.replaceAll(" ", "‎ ")}
										</span>
									);
								})}
							</p>
						</ContentWrapperCard>
					) : null}
					<ContentWrapperCard className="items-start">
						<h1 className=" text-foreground font-semibold text-2xl">Files</h1>
						<div className="w-full flex flex-col gap-4">
							{versionData?.versions[0]?.files?.map((versionFile) => {
								return (
									<div
										key={versionFile.id}
										className={cn(
											"w-full flex items-center justify-between py-3 px-6 flex-wrap gap-4 rounded-lg border-2 border-border",
											versionFile.is_primary === true && "bg-bg-hover",
										)}
									>
										<div className="flex gap-3 items-center">
											<FileIcon className="w-5 h-5 text-foreground-muted" />
											<p className="text-lg font-semibold text-foreground-muted mr-2">{versionFile.file_name}</p>
											<p className="text-base text-foreground-muted">{parseFileSize(versionFile.file_size)}</p>
											{versionFile.is_primary && <p className="text-base text-foreground-muted italic">Primary</p>}
										</div>

										<a href={`/api/file/${encodeURIComponent(versionData?.versions[0].files[0].file_url)}`}>
											<Button
												className={cn(
													"gap-2",
													versionFile.is_primary === true
														? "bg-accent-bg hover:bg-accent-bg/85 dark:text-foreground"
														: "",
												)}
												variant={versionFile.is_primary === true ? "default" : "secondary"}
												tabIndex={-1}
											>
												<DownloadIcon className="w-5 h-5" />
												<span>Download</span>
											</Button>
										</a>
									</div>
								);
							})}
						</div>
					</ContentWrapperCard>
				</div>

				<ContentWrapperCard className="w-full items-start h-fit lg:max-w-xs">
					<h1 className=" text-foreground font-semibold text-2xl">Metadata</h1>

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
									<p className="text-foreground-muted leading-none text-base px-1">
										{versionData.versions[0].supported_game_versions.join(", ")}
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
											label={`...${versionData.versions[0].id.slice(-10)}`}
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
