import { useOutletContext } from "@remix-run/react";
import type { ProjectLayoutProps } from "~/pages/project/layout";
import VersionPage from "~/pages/project/version/page";

export default function _VersionPage() {
    const data = useOutletContext<ProjectLayoutProps>();

    return (
        <VersionPage
            projectData={data.projectData}
            allProjectVersions={data.allProjectVersions}
            projectDependencies={data.dependencies}
            currUsersMembership={data.currUsersMembership}
        />
    );
}
