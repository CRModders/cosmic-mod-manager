import { Projectcontext } from "@/src/providers/project-context";
import { ContentWrapperCard } from "@/src/settings/panel";
import { useContext } from "react";

const ProjectDescription = () => {
	const { projectData } = useContext(Projectcontext);

	return (
		<>
			{projectData?.description && (
				<ContentWrapperCard className="items-start flex-wrap">
					<p className="text-foreground/95 text-base">
						{projectData.description.split("\n").map((txt, index) => {
							const key = index;
							return (
								<span key={key} className="flex">
									{txt.replaceAll(" ", "‎ ")}
								</span>
							);
						})}
					</p>
				</ContentWrapperCard>
			)}
		</>
	);
};

export default ProjectDescription;
