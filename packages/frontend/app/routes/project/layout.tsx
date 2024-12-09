import { useOutletContext } from "react-router";
import ProjectPageLayout from "~/pages/project/layout";
import type { ProjectDataWrapperContext } from "./data-wrapper";

export default function _ProjectLayout() {
    const data = useOutletContext<ProjectDataWrapperContext>();

    return <ProjectPageLayout {...data} />;
}
