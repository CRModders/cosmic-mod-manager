import { type MetaArgs, useOutletContext } from "@remix-run/react";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import ProjectGallery from "~/pages/project/gallery/page";
import type { ProjectLayoutProps } from "~/pages/project/layout";

export default function _Gallery() {
    const data = useOutletContext<ProjectLayoutProps>();

    return <ProjectGallery projectData={data.projectData} currUsersMembership={data.currUsersMembership} />;
}

export function meta(props: MetaArgs) {
    const parentMetaTags = props.matches?.at(-2)?.meta;

    return MetaTags({
        url: `${Config.FRONTEND_URL}${props.location.pathname}`,
        linksOnly: true,
        parentMetaTags,
    });
}
