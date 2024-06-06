import { SaveIcon } from "@/components/icons";
import MarkdownEditor from "@/components/markdown-editor";
import { Button } from "@/components/ui/button";
import { AbsolutePositionedSpinner, CubeLoader } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import { Projectcontext } from "@/src/providers/project-context";
import { ContentWrapperCard } from "@/src/settings/panel";
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
		<ContentWrapperCard className="items-start relative">
			<h2 className=" text-xl font-semibold">Description</h2>

			<MarkdownEditor editorValue={description} setEditorValue={setDescription} placeholder="Project description" />

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
	);
};

export default ProjectDescriptSettingsPage;
