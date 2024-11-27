import { useOutletContext } from "@remix-run/react";
import ProjectPageLayout from "~/pages/project/layout";
import type { ProjectDataWrapperContext } from "./data-wrapper";

export default function _ProjectLayout() {
    const data = useOutletContext<ProjectDataWrapperContext>();

    return <ProjectPageLayout {...data} />;
}
