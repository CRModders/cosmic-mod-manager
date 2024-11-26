import { useOutletContext } from "@remix-run/react";
import VersionChangelogs from "~/pages/project/changelog";
import type { ProjectLayoutProps } from "~/pages/project/layout";

export default function _Changelogs() {
    const data = useOutletContext<ProjectLayoutProps>();

    return <VersionChangelogs projectData={data.projectData} allProjectVersions={data.allProjectVersions} />;
}
