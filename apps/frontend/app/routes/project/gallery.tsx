import type { MetaArgs } from "react-router";
import ProjectGallery from "~/pages/project/gallery/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { PageUrl } from "~/utils/urls";

export default ProjectGallery;

export function meta(props: MetaArgs) {
    const parentMetaTags = props.matches?.at(-2)?.meta;

    return MetaTags({
        url: `${Config.FRONTEND_URL}${PageUrl(props.location.pathname)}`,
        linksOnly: true,
        parentMetaTags,
    });
}
