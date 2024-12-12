import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { PageUrl } from "@root/utils/urls";
import type { MetaArgs } from "react-router";
import ProjectVersionsPage from "~/pages/project/versions";

export default ProjectVersionsPage;

export function meta(props: MetaArgs) {
    const parentMetaTags = props.matches?.at(-2)?.meta;

    return MetaTags({
        url: `${Config.FRONTEND_URL}${PageUrl(props.location.pathname)}`,
        linksOnly: true,
        parentMetaTags,
    });
}
