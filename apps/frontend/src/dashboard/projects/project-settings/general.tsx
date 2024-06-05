import { SaveIcon, TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AbsolutePositionedSpinner, CubeLoader } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import { Projectcontext } from "@/src/providers/project-context";
import { ContentWrapperCard } from "@/src/settings/panel";
import { Cross2Icon, CubeIcon, UploadIcon } from "@radix-ui/react-icons";
import { maxProjectSummaryLength } from "@root/config";
import { CapitalizeAndFormatString, createURLSafeSlug, getProjectVisibilityType } from "@root/lib/utils";
import { ProjectVisibility } from "@root/types";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GeneralProjectSettings = () => {
	const { projectData, fetchingProjectData, fetchProjectData } = useContext(Projectcontext);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	// Form states
	const [projectName, setProjectName] = useState("");
	const [projectUrl, setProjectUrl] = useState("");
	const [projectSummary, setProjectSummary] = useState("");
	const [visibility, setProjectVisibility] = useState<ProjectVisibility | "">("");

	const saveProjectData = async () => {
		setLoading(true);

		const response = await useFetch(`/api/project/${projectData?.url_slug}/update`, {
			method: "POST",
			body: JSON.stringify({
				name: projectName,
				url_slug: projectUrl,
				summary: projectSummary,
				visibility: visibility,
			}),
		});
		setLoading(false);
		const result = await response.json();
		toast({
			title: result?.message,
		});

		if (!response.ok) {
			return;
		}

		await fetchProjectData(result?.data?.url_slug);
	};

	useEffect(() => {
		if (projectData?.id) {
			setProjectName(projectData?.name);
			setProjectUrl(projectData?.url_slug);
			setProjectSummary(projectData?.summary);
			setProjectVisibility(getProjectVisibilityType(projectData?.visibility));
		}
	}, [projectData]);

	return (
		<div className="w-full flex flex-col items-center justify-center gap-4">
			{loading === true || projectData === undefined || fetchingProjectData === true ? (
				<div className="w-full py-8 flex items-center justify-center">
					<CubeLoader size="lg" />
				</div>
			) : (
				<>
					<ContentWrapperCard className="w-full flex flex-col items-start justify-center gap-6">
						<h1 className="w-full flex items-center justify-start font-semibold text-2xl text-foreground">
							Project information
						</h1>

						<div className="flex flex-col">
							<p className="text-xl font-semibold text-foreground p-1">Icon</p>
							<div className="flex gap-4">
								<span className="p-2 flex items-center justify-center rounded-lg bg-background-shallow">
									{}
									<CubeIcon className="w-20 h-20 text-foreground-muted" />
								</span>
								<div className="flex flex-col items-start justify-center gap-2">
									<Button variant={"secondary"} className="gap-2 text-foreground-muted">
										<UploadIcon className="w-4 h-4" />
										Upload icon
									</Button>
									<Button variant={"secondary"} className="gap-2 text-foreground-muted">
										<TrashIcon className="w-4 h-4" />
										Remove icon
									</Button>
								</div>
							</div>
						</div>

						<div className="w-full flex flex-col items-start justify-center gap-1">
							<Label htmlFor="settings-project-name-input" className="font-semibold text-lg">
								Name
							</Label>
							<Input
								type="text"
								className="w-full md:w-[32ch] text-base dark:text-foreground-muted"
								id="settings-project-name-input"
								value={projectName}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setProjectName(e.target.value);
								}}
							/>
						</div>

						<div className="w-full md:w-fit flex flex-col items-start justify-start gap-1">
							<Label htmlFor="settings-project-url-input" className="font-semibold text-lg">
								URL
							</Label>

							<div className="w-full flex items-center justify-center px-3 rounded-md bg-background-shallow border border-border focus-within:bg-transparent focus-within:border-border-hicontrast transition-colors">
								<label htmlFor="settings-project-url-input" className="text-foreground/50 text-base cursor-text">
									/{createURLSafeSlug(projectData?.type || "").value}/
								</label>
								<Input
									id="settings-project-url-input"
									type="text"
									className="px-0 border-none bg-transparent w-full md:w-[32ch] text-base dark:text-foreground-muted"
									value={projectUrl}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										setProjectUrl(createURLSafeSlug(e.target.value).value);
									}}
								/>
							</div>
						</div>
						<div className="w-full flex flex-col items-start justify-center gap-1">
							<Label htmlFor="settings-summary-textarea" className="font-semibold text-lg">
								Summary
							</Label>
							<Textarea
								placeholder="Enter project summary..."
								cols={8}
								maxLength={maxProjectSummaryLength}
								className="resize-none w-full md:w-[48ch] h-28 text-base dark:text-foreground-muted"
								id="settings-summary-textarea"
								value={projectSummary}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
									setProjectSummary(e.target.value);
								}}
							/>
						</div>

						<div className="w-full flex flex-col gap-1">
							<p className="font-semibold text-lg">Visibility</p>
							<div className="w-full flex flex-wrap lg:flex-nowrap gap-6 items-center justify-between">
								<div>
									<p className=" text-foreground-muted">
										Listed and archived projects are visible in search. Unlisted projects are published, but not visible
										in search or on user profiles. Private projects are only accessible by members of the project.
									</p>
								</div>

								<Select
									value={visibility}
									onValueChange={(value: string) => {
										setProjectVisibility(value as ProjectVisibility);
									}}
								>
									<SelectTrigger className="w-fit max-w-full min-w-[24ch]">
										<SelectValue placeholder="Visibility" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={ProjectVisibility.PRIVATE}>
											{CapitalizeAndFormatString(ProjectVisibility.PRIVATE)}
										</SelectItem>
										<SelectItem value={ProjectVisibility.PUBLIC}>
											{CapitalizeAndFormatString(ProjectVisibility.PUBLIC)}
										</SelectItem>
										<SelectItem value={ProjectVisibility.ARCHIVED}>
											{CapitalizeAndFormatString(ProjectVisibility.ARCHIVED)}
										</SelectItem>
										<SelectItem value={ProjectVisibility.UNLISTED}>
											{CapitalizeAndFormatString(ProjectVisibility.UNLISTED)}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="w-full flex items-center justify-end mt-4 mb-2">
							<Button
								className="gap-2 px-6 bg-accent-bg hover:bg-accent-bg/85 dark:text-foreground"
								disabled={
									projectName === projectData?.name &&
									projectUrl === projectData?.url_slug &&
									projectSummary === projectData?.summary &&
									visibility === getProjectVisibilityType(projectData?.visibility)
								}
								onClick={saveProjectData}
							>
								<SaveIcon size="1rem" />
								<span>Save changes</span>
							</Button>
						</div>
					</ContentWrapperCard>
					<DeleteProjectCard projectName={projectData?.name || ""} projectUrlSlug={projectData?.url_slug || ""} />
				</>
			)}
		</div>
	);
};

export default GeneralProjectSettings;

const DeleteProjectCard = ({ projectName, projectUrlSlug }: { projectName: string; projectUrlSlug: string }) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [inputValue, setinputValue] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const deleteProject = async () => {
		setLoading(true);

		const response = await useFetch(`/api/project/${projectUrlSlug}/delete`);
		setLoading(false);
		const result = await response.json();
		if (!response.ok) {
			return toast({ title: result?.message, variant: "destructive" });
		}
		toast({ title: result?.message });
		navigate("/dashboard/projects");
	};

	return (
		<ContentWrapperCard className="items-start">
			<h2 className="font-semibold text-foreground text-2xl">Delete project</h2>
			<p className="text-foreground-muted">
				Removes your project from our servers and search. Clicking on this will delete your project, so be extra
				careful!
			</p>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogTrigger asChild>
					<Button className=" bg-danger-bg hover:bg-danger-bg/85 gap-2 dark:text-foreground">
						<TrashIcon size="1.15rem" />
						<span>Delete project</span>
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure you want to delete this project?</DialogTitle>
					</DialogHeader>
					<p className="text-foreground-muted">
						If you proceed, all versions and any attached data will be removed from our servers. This may break other
						projects, so be careful.
					</p>

					<div className="w-full flex flex-col items-start justify-center gap-1">
						<p className="text-foreground font-semibold">
							To verify, type <span className="font-medium italic text-foreground-muted">{projectName}</span> below:
						</p>
						<Input
							type="text"
							value={inputValue}
							onChange={(e) => {
								setinputValue(e.target.value);
							}}
						/>
					</div>
					<DialogFooter className="w-full flex flex-row flex-wrap-reverse items-center justify-end gap-2">
						<DialogClose asChild>
							<Button className="gap-2 text-foreground-muted" variant={"secondary"}>
								<Cross2Icon />
								<span>Cancel</span>
							</Button>
						</DialogClose>

						<Button
							onClick={deleteProject}
							className=" bg-danger-bg hover:bg-danger-bg/85 gap-2 dark:text-foreground"
							disabled={projectName !== inputValue || loading}
						>
							<TrashIcon size="1.15rem" />
							<span>Delete project</span>
						</Button>
					</DialogFooter>

					{loading && <AbsolutePositionedSpinner />}
				</DialogContent>
			</Dialog>
		</ContentWrapperCard>
	);
};
