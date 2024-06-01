import { SaveIcon, TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/src/hooks/fetch";
import { ContentWrapperCard } from "@/src/settings/panel";
import type { ProjectDataType } from "@/types";
import { CubeIcon, UploadIcon } from "@radix-ui/react-icons";
import { frontendUrl, maxProjectSummaryLength } from "@root/config";
import { ProjectVisibility } from "@root/types";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

const GeneralProjectSettings = () => {
	const { projectUrlSlug } = useParams();
	const [projectData, setProjectData] = useState<ProjectDataType | null | undefined>(undefined);
	const [loading, setLoading] = useState(false);

	// Form states
	const [projectName, setProjectName] = useState("");
	const [projectUrl, setProjectUrl] = useState("");
	const [projectSummary, setProjectSummary] = useState("");
	const [visibility, setProjectVisibility] = useState<ProjectVisibility>(ProjectVisibility.PUBLIC);

	const fetchProjectData = async () => {
		setLoading(true);

		const response = await useFetch(`/api/project/${projectUrlSlug}`);
		setLoading(false);
		const result = await response.json();

		setProjectData(result?.data || null);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchProjectData();
	}, []);

	useEffect(() => {
		if (projectData?.id) {
			setProjectName(projectData?.name);
			setProjectUrl(projectData?.url_slug);
			setProjectSummary(projectData?.summary);
		}
	}, [projectData]);

	return (
		<div className="w-full flex flex-col items-center justify-center gap-4">
			<Helmet>
				<title>Projects | CRMM</title>
				<meta name="description" content="Your projects on crmm." />
			</Helmet>

			{loading === true || projectData === undefined ? (
				<div className="w-full min-h-[50vh] flex items-center justify-center">
					<Spinner size="2rem" />
				</div>
			) : (
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
								{frontendUrl}/project/
							</label>
							<Input
								id="settings-project-url-input"
								type="text"
								className="px-0 border-none bg-transparent w-full md:w-[32ch] text-base dark:text-foreground-muted"
								value={projectUrl}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setProjectUrl(e.target.value);
								}}
							/>
						</div>
					</div>
					<div className="w-full flex flex-col items-start justify-center gap-1">
						<Label htmlFor="settings-project-name-input" className="font-semibold text-lg">
							Summary
						</Label>
						<Textarea
							placeholder="Enter project summary..."
							cols={8}
							maxLength={maxProjectSummaryLength}
							className="resize-none w-full md:w-[48ch] h-28 text-base dark:text-foreground-muted"
							value={projectSummary}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
								setProjectSummary(e.target.value);
							}}
						/>
					</div>

					<div className="w-full flex flex-col gap-1">
						<p className="font-semibold text-lg">Visibility</p>
						<div className="w-full flex gap-6 items-center justify-between">
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
								<SelectTrigger className="w-fit min-w-[24ch]">
									<SelectValue placeholder="Theme" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={ProjectVisibility.PRIVATE}>{ProjectVisibility.PRIVATE}</SelectItem>
									<SelectItem value={ProjectVisibility.PUBLIC}>{ProjectVisibility.PUBLIC}</SelectItem>
									<SelectItem value={ProjectVisibility.ARCHIVED}>{ProjectVisibility.ARCHIVED}</SelectItem>
									<SelectItem value={ProjectVisibility.UNLISTED}>{ProjectVisibility.UNLISTED}</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="w-full flex items-center justify-end mt-4 mb-2">
						<Button className="gap-2 px-6 bg-accent-bg hover:bg-accent-bg/85 dark:text-foreground">
							<SaveIcon size="1rem" />
							<span>Save changes</span>
						</Button>
					</div>
				</ContentWrapperCard>
			)}
		</div>
	);
};

export default GeneralProjectSettings;
