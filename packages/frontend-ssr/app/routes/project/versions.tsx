import { useOutletContext } from "@remix-run/react";
import type { ProjectLayoutProps } from "~/pages/project/layout";
import ProjectVersionsPage from "~/pages/project/versions";

export default function _Versions() {
    const data = useOutletContext<ProjectLayoutProps>();

    return (
        <ProjectVersionsPage
            projectData={data.projectData}
            allProjectVersions={data.allProjectVersions}
            currUsersMembership={data.currUsersMembership}
        />
    );
}
