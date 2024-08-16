import { ContentCardTemplate } from "@/components/layout/panel";
import { SuspenseFallback } from "@/components/ui/spinner";
import { Projectcontext } from "@/src/contexts/curr-project";
import { Suspense, lazy, useContext } from "react";

const MarkdownRenderBox = lazy(() => import("@/components/layout/md-editor/render-md"));

const ProjectPage = () => {
    const { projectData } = useContext(Projectcontext);

    if (!projectData) return null;

    if (projectData.id && !projectData.description) {
        return (
            <div className="w-full flex items-center justify-center">
                <span className="text-muted-foreground italic">No project description provided</span>
            </div>
        );
    }

    return (
        <Suspense fallback={<SuspenseFallback />}>
            <ContentCardTemplate className="w-full gap-0">
                <MarkdownRenderBox text={projectData.description || ""} />
            </ContentCardTemplate>
        </Suspense>
    );
};

export default ProjectPage;
