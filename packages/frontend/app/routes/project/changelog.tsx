import type { MetaArgs } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import VersionChangelogs from "~/pages/project/changelog";
import type { ProjectLayoutProps } from "~/pages/project/layout";

export default function _Changelogs() {
    const data = useOutletContext<ProjectLayoutProps>();

    return <VersionChangelogs projectData={data.projectData} allProjectVersions={data.allProjectVersions} />;
}

export function meta(props: MetaArgs) {
    const parentMetaTags = props.matches?.at(-2)?.meta;

    return MetaTags({
        url: `${Config.FRONTEND_URL}${props.location.pathname}`,
        linksOnly: true,
        parentMetaTags,
    });
}
