import { SaveIcon } from "@/components/icons";
import MarkdownEditor from "@/components/markdown-editor";
import { Button } from "@/components/ui/button";
import { AbsolutePositionedSpinner, CubeLoader } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import { Projectcontext } from "@/src/providers/project-context";
import { ContentWrapperCard } from "@/src/settings/panel";
import { maxProjectDescriptionLength } from "@root/config";
import { useContext, useEffect, useState } from "react";

const ProjectDescriptSettingsPage = () => {
	const [loading, setLoading] = useState(false);
	const { projectData, fetchProjectData } = useContext(Projectcontext);
	const [description, setDescription] = useState("");

	const updateProjectDescription = async () => {
		if (projectData?.description === description) return;
		setLoading(true);

		const response = await useFetch(`/api/project/${projectData?.url_slug}/update-description`, {
			method: "POST",
			body: JSON.stringify({ description: description }),
		});
		setLoading(false);
		const result = await response.json();

		if (!response.ok) {
			return toast({ title: result?.message, variant: "destructive" });
		}

		await fetchProjectData();
	};

	useEffect(() => {
		if (projectData?.id) {
			setDescription(projectData?.description || "");
		}
	}, [projectData]);

	if (projectData === undefined) {
		return (
			<div className="w-full flex items-center justify-center py-8">
				<CubeLoader size="lg" />
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-4">
			<ContentWrapperCard>
				<MarkdownEditor />
			</ContentWrapperCard>

			<ContentWrapperCard className="items-start relative">
				<h2 className=" text-xl font-semibold">Description</h2>

				<Textarea
					placeholder="Project description..."
					maxLength={maxProjectDescriptionLength}
					className="resize-y w-full text-base h-full min-h-96 dark:text-foreground font-mono"
					value={description}
					spellCheck={false}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
						setDescription(e.target.value);
					}}
				/>

				<div className="w-full flex items-center justify-end">
					<Button
						className=" bg-accent-bg hover:bg-accent-bg/85 dark:text-foreground gap-2"
						onClick={updateProjectDescription}
						disabled={loading || projectData?.description === description}
					>
						<SaveIcon size="1.25rem" />
						<span>Save changes</span>
					</Button>
				</div>

				{loading && <AbsolutePositionedSpinner />}
			</ContentWrapperCard>
		</div>
	);
};

export default ProjectDescriptSettingsPage;
