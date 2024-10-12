import MarkdownRenderBox from "@/components/layout/md-editor/render-md";
import { ContentCardTemplate } from "@/components/layout/panel";
import { projectContext } from "@/src/contexts/curr-project";
import { useContext } from "react";

const ProjectPage = () => {
    const { projectData } = useContext(projectContext);

    if (!projectData) return null;
    if (!projectData.description) {
        return <span className="text-muted-foreground italic">No project description provided</span>;
    }

    return (
        <ContentCardTemplate className="w-full max-w-full gap-0 [grid-area:_content]">
            <MarkdownRenderBox text={projectData.description || ""} />
        </ContentCardTemplate>
    );
};

export const Component = ProjectPage;
