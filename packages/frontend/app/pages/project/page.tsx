import type { ProjectDetailsData } from "@shared/types/api";
import MarkdownRenderBox from "~/components/layout/md-editor/render-md";
import { ContentCardTemplate } from "~/components/layout/panel";

interface Props {
    projectData: ProjectDetailsData;
}

export default function ProjectPage({ projectData }: Props) {
    if (!projectData.description) {
        return <span className="text-muted-foreground italic">No project description provided</span>;
    }

    return (
        <ContentCardTemplate className="w-full max-w-full gap-0 [grid-area:_content]">
            <MarkdownRenderBox text={projectData.description || ""} />
        </ContentCardTemplate>
    );
}
