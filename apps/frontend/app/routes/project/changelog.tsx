import type { MetaArgs } from "react-router";
import VersionChangelogs from "~/pages/project/changelog";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { PageUrl } from "~/utils/urls";

export default VersionChangelogs;

export function meta(props: MetaArgs) {
    const parentMetaTags = props.matches?.at(-2)?.meta;

    return MetaTags({
        url: `${Config.FRONTEND_URL}${PageUrl(props.location.pathname)}`,
        linksOnly: true,
        parentMetaTags,
    });
}
