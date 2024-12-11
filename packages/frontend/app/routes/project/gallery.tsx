import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import type { MetaArgs } from "react-router";
import ProjectGallery from "~/pages/project/gallery/page";

export default ProjectGallery;

export function meta(props: MetaArgs) {
    const parentMetaTags = props.matches?.at(-2)?.meta;

    return MetaTags({
        url: `${Config.FRONTEND_URL}${props.location.pathname}`,
        linksOnly: true,
        parentMetaTags,
    });
}
