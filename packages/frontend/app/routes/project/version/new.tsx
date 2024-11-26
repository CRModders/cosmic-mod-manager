import { useOutletContext } from "@remix-run/react";
import type { ProjectLayoutProps } from "~/pages/project/layout";
import UploadVersionPage from "~/pages/project/version/new-version";

export default function _NewVersion() {
    const data = useOutletContext<ProjectLayoutProps>();

    return <UploadVersionPage projectData={data.projectData} />;
}
