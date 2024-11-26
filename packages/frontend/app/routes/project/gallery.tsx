import { useOutletContext } from "@remix-run/react";
import ProjectGallery from "~/pages/project/gallery/page";
import type { ProjectLayoutProps } from "~/pages/project/layout";

export default function _Gallery() {
    const data = useOutletContext<ProjectLayoutProps>();

    return <ProjectGallery projectData={data.projectData} currUsersMembership={data.currUsersMembership} />;
}
