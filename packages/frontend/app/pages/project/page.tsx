import MarkdownRenderBox from "~/components/layout/md-editor/render-md";
import { useProjectData } from "~/hooks/project";

export default function ProjectPage() {
    const ctx = useProjectData();

    if (!ctx.projectData.description) {
        return <span className="text-muted-foreground italic text-center">No project description provided</span>;
    }

    return (
        <div className="bg-card-background p-card-surround rounded-lg">
            <MarkdownRenderBox text={ctx.projectData.description || ""} />
        </div>
    );
}
