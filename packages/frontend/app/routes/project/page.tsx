import { useOutletContext } from "react-router";
import type { ProjectLayoutProps } from "~/pages/project/layout";
import ProjectPage from "~/pages/project/page";

export default function _ProjectPage() {
    const { projectData } = useOutletContext<ProjectLayoutProps>();

    return <ProjectPage projectData={projectData} />;
}
