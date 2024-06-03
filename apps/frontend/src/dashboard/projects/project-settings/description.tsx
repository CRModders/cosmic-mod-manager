import { SaveIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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
		const result = await response.json();
		setLoading(false);

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
				<Spinner size="1.5rem" />
			</div>
		);
	}

	return (
		<ContentWrapperCard className="items-start">
			<h2 className=" text-xl font-semibold">Description</h2>

			<Textarea
				placeholder="Project description..."
				maxLength={maxProjectDescriptionLength}
				className="resize-none w-full text-base h-96 dark:text-foreground font-mono"
				value={description}
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
					{loading ? <Spinner size="1.25rem" /> : <SaveIcon size="1.25rem" />}
					<span>Save changes</span>
				</Button>
			</div>
		</ContentWrapperCard>
	);
};

export default ProjectDescriptSettingsPage;
