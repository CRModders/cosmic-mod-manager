import { ContentCardTemplate } from "@/components/layout/panel";
import { SuspenseFallback } from "@/components/ui/spinner";
import { projectContext } from "@/src/contexts/curr-project";
import { Suspense, lazy, useContext } from "react";

const MarkdownRenderBox = lazy(() => import("@/components/layout/md-editor/render-md"));

const ProjectPage = () => {
    const { projectData } = useContext(projectContext);

    if (!projectData) return null;
    if (!projectData.description) {
        return <span className="text-muted-foreground italic">No project description provided</span>;
    }

    return (
        <Suspense fallback={<SuspenseFallback />}>
            <ContentCardTemplate className="w-full gap-0 [grid-area:_content]">
                <MarkdownRenderBox text={projectData.description || ""} />
            </ContentCardTemplate>
        </Suspense>
    );
};

export default ProjectPage;
