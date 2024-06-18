import { SaveIcon } from "@/components/icons";
import MarkdownEditor from "@/components/markdown-editor";
import { Button } from "@/components/ui/button";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import { Projectcontext } from "@/src/providers/project-context";
import { ContentWrapperCard } from "@/src/settings/panel";
import { useContext, useEffect, useState } from "react";

const ProjectDescriptSettingsPage = () => {
	const [loading, setLoading] = useState(false);
	const { projectData, fetchingProjectData, fetchProjectData } = useContext(Projectcontext);
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

	return (
		<ContentWrapperCard className="items-start relative">
			{projectData === undefined ? null : (
				<>
					<h2 className="text-2xl font-semibold">Description</h2>
					<MarkdownEditor editorValue={description} setEditorValue={setDescription} placeholder="Project description" />

					<div className="w-full flex items-center justify-end">
						<Button onClick={updateProjectDescription} disabled={loading || projectData?.description === description}>
							<SaveIcon className="w-4 h-4" />
							Save changes
						</Button>
					</div>
				</>
			)}
			{loading ? <AbsolutePositionedSpinner /> : null}
		</ContentWrapperCard>
	);
};

export default ProjectDescriptSettingsPage;
