import { ChevronRightIcon, SaveIcon } from "@/components/icons";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelectInput } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CubeLoader } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { constructVersionPageUrl } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { useIsUseAProjectMember } from "@/src/hooks/project-member";
import { Projectcontext } from "@/src/providers/project-context";
import { ContentWrapperCard } from "@/src/settings/panel";
import type { ProjectVersionData } from "@/types";
import { Cross1Icon, FileIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { GameVersions, maxChangelogLength } from "@root/config";
import { CapitalizeAndFormatString, createURLSafeSlug, parseFileSize } from "@root/lib/utils";
import { ReleaseChannels, getProjectLoaders } from "@root/types";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditVersionPage = ({ projectType }: { projectType: string }) => {
	const { projectUrlSlug, versionUrlSlug } = useParams();
	const [versionData, setVersionData] = useState<ProjectVersionData | null | undefined>(undefined);

	const { projectData, fetchFeaturedProjectVersions, fetchAllProjectVersions } = useContext(Projectcontext);
	const [loading, setLoading] = useState(false);
	const isAProjectMember = useIsUseAProjectMember();
	const navigate = useNavigate();

	// Formdata
	const [versionName, setVersionName] = useState("");
	const [changelog, setChangelog] = useState("");
	const [versionNumber, setVersionNumber] = useState("");
	const [releaseChannel, setReleaseChannel] = useState<ReleaseChannels>(ReleaseChannels.RELEASE);
	const [loaders, setLoaders] = useState<string[]>([]);
	const [supportedGameVersions, setSupportedGameVersions] = useState<string[]>([]);

	const toggleVersionFeaturing = async () => {
		setLoading(true);

		const response = await useFetch(`/api/project/${projectUrlSlug}/version/${versionUrlSlug}/set-featured`, {
			method: "POST",
			body: JSON.stringify({
				is_featured: !(versionData?.versions[0].is_featured === true),
			}),
		});
		setLoading(false);
		const result = await response.json();

		if (!response.ok) {
			return toast({ title: result?.message, variant: "destructive" });
		}

		toast({ title: result?.message });
		await Promise.all([fetchAllProjectVersions(), fetchFeaturedProjectVersions(), fetchVersiondata()]);
	};

	const updateProjectVersion = async () => {
		if (!versionName) return toast({ title: "Version title is required", variant: "destructive" });
		if (!versionNumber) return toast({ title: "Version number is required", variant: "destructive" });
		if (!supportedGameVersions?.length)
			return toast({ title: "Supported game versions is required", variant: "destructive" });

		if (createURLSafeSlug(versionNumber).value !== versionNumber) {
			return toast({
				title: "Version number should be a url safe string",
				variant: "destructive",
			});
		}

		setLoading(true);
		const formData = new FormData();
		formData.append("versionName", versionName);
		formData.append("changelog", changelog);
		formData.append("versionNumber", versionNumber);
		formData.append("releaseChannel", releaseChannel);
		formData.append("loaders", JSON.stringify(loaders));
		formData.append("supportedGameVersions", JSON.stringify(supportedGameVersions));

		const response = await useFetch(`/api/project/${projectUrlSlug}/version/${versionUrlSlug}/update`, {
			method: "POST",
			body: formData,
		});
		setLoading(false);
		const result = await response.json();

		if (!response.ok) {
			return toast({
				title: result?.message,
				variant: "destructive",
			});
		}

		await Promise.all([fetchAllProjectVersions(), fetchFeaturedProjectVersions()]);

		toast({
			title: result?.message,
		});

		navigate(constructVersionPageUrl(result?.data?.url_slug || ""));
	};

	const fetchVersiondata = async () => {
		setLoading(true);

		const response = await useFetch(`/api/project/${projectUrlSlug}/version/${versionUrlSlug}`);
		setLoading(false);
		const result = await response.json();
		const data = result?.data as ProjectVersionData;
		setVersionData(data || null);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchVersiondata();
	}, [versionUrlSlug]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (isAProjectMember === false) {
			return navigate(`/${projectType}/${projectUrlSlug}/version/${versionUrlSlug}`, { replace: true });
		}
	}, [isAProjectMember]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (versionData?.versions[0].url_slug) {
			const constructedUrl = constructVersionPageUrl(versionData.versions[0].url_slug);
			if (window.location.href.replace(window.location.origin, "") !== constructedUrl) {
				navigate(constructedUrl);
			}
		}
		if (versionData?.id) {
			const versionDetails = versionData?.versions[0];
			setVersionName(versionDetails.version_title);
			setChangelog(versionDetails.changelog);
			setVersionNumber(versionDetails.version_number);
			setReleaseChannel(CapitalizeAndFormatString(versionDetails.release_channel) as ReleaseChannels);
			setLoaders(versionDetails.supported_loaders);
			setSupportedGameVersions(versionDetails.supported_game_versions);
		}
	}, [versionData]);

	if (isAProjectMember === undefined) {
		return null;
	}

	if (versionData === undefined) {
		return (
			<div className="w-full flex items-center justify-center py-8">
				<CubeLoader size="lg" />
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-4 items-start justify-center">
			<ContentWrapperCard>
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
								<BreadcrumbPage>{versionName}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				<div className="w-full flex flex-col gap-4">
					<Input
						type="text"
						className="w-full text-lg py-2 px-4 h-12"
						placeholder="Enter the version title..."
						value={versionName}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setVersionName(e.target.value || "");
						}}
					/>

					<div className="flex flex-wrap gap-4 items-center justify-start">
						<Button
							className="gap-2 bg-accent-bg hover:bg-accent-bg/85 dark:text-foreground"
							onClick={updateProjectVersion}
							disabled={loading}
						>
							{loading === true ? <CubeLoader size="xs" /> : <SaveIcon className="w-4 h-4" />}
							<span className="text-base font-semibold">Save</span>
						</Button>

						<Button disabled={loading} className="gap-2" variant={"secondary"} onClick={toggleVersionFeaturing}>
							{loading === true ? (
								<CubeLoader size="xs" />
							) : versionData?.versions[0].is_featured === true ? (
								<StarFilledIcon className="w-4 h-4" />
							) : (
								<StarIcon className="w-4 h-4" />
							)}
							<span className="text-base font-semibold text-foreground-muted">
								{versionData?.versions[0].is_featured === true ? "Unfeature version" : "Feature version"}
							</span>
						</Button>

						<Link to={`/${projectType}/${projectUrlSlug}/version/${versionUrlSlug}`}>
							<Button className="gap-2" variant={"secondary"} disabled={loading}>
								<Cross1Icon />
								<span>Discard changes</span>
							</Button>
						</Link>
					</div>
				</div>
			</ContentWrapperCard>

			<div className="w-full gap-4 grid grid-cols-1 xl:grid-cols-[70%_1fr]">
				<div className="w-full flex flex-col gap-4">
					<ContentWrapperCard>
						<div className="w-full flex flex-col items-start justify-center gap-1">
							<Label htmlFor="version-changelog-textarea" className="font-semibold text-lg">
								Changelog
							</Label>
							<Textarea
								placeholder="Version changelog..."
								maxLength={maxChangelogLength}
								className="resize-none w-full text-base h-96 dark:text-foreground font-mono"
								id="version-changelog-textarea"
								spellCheck={false}
								value={changelog}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
									setChangelog(e.target.value);
								}}
							/>
						</div>
					</ContentWrapperCard>

					{/* // TODO: Add dependency thing */}
					{/* <ContentWrapperCard>2</ContentWrapperCard> */}
				</div>

				<ContentWrapperCard className="w-full h-fit">
					<div className="w-full flex flex-col items-start justify-center gap-1">
						<p className="font-semibold text-2xl">Metadata</p>
					</div>

					{/* // TODO: Add release channels support */}
					<div className="w-full flex flex-col">
						<Label htmlFor="version-release-channel-selector" className="font-semibold text-foreground text-lg">
							Release channel
						</Label>
						<Select
							defaultValue={releaseChannel}
							onValueChange={(value) => {
								setReleaseChannel(value as ReleaseChannels);
							}}
						>
							<SelectTrigger className="w-full min-w-[24ch]" id="version-release-channel-selector">
								<SelectValue placeholder="Theme" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={ReleaseChannels.RELEASE}>
									{CapitalizeAndFormatString(ReleaseChannels.RELEASE)}
								</SelectItem>
								<SelectItem value={ReleaseChannels.BETA}>{CapitalizeAndFormatString(ReleaseChannels.BETA)}</SelectItem>
								<SelectItem value={ReleaseChannels.ALPHA}>
									{CapitalizeAndFormatString(ReleaseChannels.ALPHA)}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="w-full flex flex-col">
						<Label htmlFor="version-number-input" className="font-semibold text-foreground text-lg">
							Version number
						</Label>
						<div className="w-full flex items-center justify-center px-3 rounded-md bg-background-shallow border border-border focus-within:bg-transparent focus-within:border-border-hicontrast transition-colors">
							<label htmlFor="version-number-input" className="text-foreground/50 text-base cursor-text pr-2">
								#
							</label>
							<Input
								id="version-number-input"
								type="text"
								className="px-0 border-none bg-transparent text-base dark:text-foreground-muted"
								value={versionNumber}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setVersionNumber(e.target.value);
								}}
							/>
						</div>
					</div>

					<div className="w-full flex flex-col">
						<Label className="font-semibold text-foreground text-lg">Loaders</Label>
						<MultiSelectInput
							options={Object.values(getProjectLoaders(projectData?.type || ""))}
							inputPlaceholder="Choose loaders.."
							input_id={"supported-loaders-filter-input"}
							initialSelected={loaders?.map((val) => val)}
							setSelectedValues={setLoaders}
						/>
					</div>
					<div className="w-full flex flex-col">
						<Label className="font-semibold text-foreground text-lg">Game versions</Label>
						<MultiSelectInput
							options={GameVersions}
							inputPlaceholder="Choose versions.."
							input_id={"supported-game-version-filter-input"}
							initialSelected={supportedGameVersions?.map((val) => val)}
							setSelectedValues={setSupportedGameVersions}
						/>
					</div>
				</ContentWrapperCard>
			</div>

			<div className="w-full gap-4 grid grid-cols-1 xl:grid-cols-[70%_1fr]">
				<ContentWrapperCard className="w-full grow">
					<div className="w-full flex flex-col items-start justify-center gap-1">
						<p className="font-semibold text-2xl">Files</p>
					</div>

					{versionData?.versions[0].files[0].id &&
						versionData?.versions[0].files.map((file) => {
							return (
								<div
									key={file.id}
									className="w-full flex items-center justify-between py-3 px-6 flex-wrap gap-4 rounded-lg bg-bg-hover"
								>
									<div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
										<FileIcon className="w-5 h-5 text-foreground-muted" />
										<p className="text-lg font-semibold text-foreground-muted mr-2">{file.file_name}</p>
										<p className="text-base text-foreground-muted">{parseFileSize(file.file_size)}</p>
										{file.is_primary && <p className="italic text-foreground-muted">Primary</p>}
									</div>

									{file.is_primary !== true && (
										<Label htmlFor="version-main-file-input">
											<p className="py-2 px-6 font-semibold text-foreground text-base cursor-pointer rounded-lg bg-background border border-transparent hover:border-border-hicontrast hover:bg-bg-hover transition-colors">
												Replace file
											</p>
										</Label>
									)}
								</div>
							);
						})}

					{/* // TODO: ADD Additional file uploads */}
					{/* <div>

                    </div> */}
				</ContentWrapperCard>
				<div className="w-full h-fit" />
			</div>
		</div>
	);
};

export default EditVersionPage;
