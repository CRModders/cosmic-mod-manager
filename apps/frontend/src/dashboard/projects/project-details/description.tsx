import { SuspenseFallback } from "@/components/ui/spinner";
import { Projectcontext } from "@/src/providers/project-context";
import { ContentWrapperCard } from "@/src/settings/panel";
import { Suspense, lazy, useContext } from "react";
const MarkdownRenderBox = lazy(() => import("@/components/md-render-box"));

const ProjectDescription = () => {
	const { projectData } = useContext(Projectcontext);

	return (
		<>
			{projectData?.description && (
				<ContentWrapperCard className="items-start flex-wrap">
					<Suspense fallback={<SuspenseFallback />}>
						<MarkdownRenderBox text={projectData.description} />
					</Suspense>
				</ContentWrapperCard>
			)}
		</>
	);
};

export default ProjectDescription;
