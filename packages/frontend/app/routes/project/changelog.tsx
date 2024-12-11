import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import type { MetaArgs } from "react-router";
import VersionChangelogs from "~/pages/project/changelog";

export default VersionChangelogs;

export function meta(props: MetaArgs) {
    const parentMetaTags = props.matches?.at(-2)?.meta;

    return MetaTags({
        url: `${Config.FRONTEND_URL}${props.location.pathname}`,
        linksOnly: true,
        parentMetaTags,
    });
}
