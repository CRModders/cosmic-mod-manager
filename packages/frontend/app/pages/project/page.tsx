import type { ProjectDetailsData } from "@shared/types/api";
import MarkdownRenderBox from "~/components/layout/md-editor/render-md";

interface Props {
    projectData: ProjectDetailsData;
}

export default function ProjectPage({ projectData }: Props) {
    if (!projectData.description) {
        return <span className="text-muted-foreground italic text-center">No project description provided</span>;
    }

    return (
        <div className="bg-card-background p-card-surround rounded-lg">
            <MarkdownRenderBox text={projectData.description || ""} />
        </div>
    );
}
