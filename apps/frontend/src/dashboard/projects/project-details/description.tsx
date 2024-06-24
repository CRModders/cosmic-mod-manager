import MarkdownRenderBox from "@/components/md-render-box";
import { Projectcontext } from "@/src/providers/project-context";
import { ContentWrapperCard } from "@/src/settings/panel";
import { useContext } from "react";

const ProjectDescription = () => {
    const { projectData } = useContext(Projectcontext);

    return (
        <>
            {projectData?.description && (
                <ContentWrapperCard className="items-start flex-wrap">
                    <MarkdownRenderBox text={projectData.description} />
                </ContentWrapperCard>
            )}
        </>
    );
};

export default ProjectDescription;
