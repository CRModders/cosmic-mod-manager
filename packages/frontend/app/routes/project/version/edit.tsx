import { useOutletContext } from "@remix-run/react";
import type { ProjectLayoutProps } from "~/pages/project/layout";
import EditVersionPage from "~/pages/project/version/edit-version";

export default function _EditVersion() {
    const data = useOutletContext<ProjectLayoutProps>();

    return (
        <EditVersionPage
            projectData={data.projectData}
            allProjectVersions={data.allProjectVersions}
            projectDependencies={data.dependencies}
        />
    );
}
