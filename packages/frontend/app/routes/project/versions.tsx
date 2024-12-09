import type { MetaArgs } from "react-router";
import { useOutletContext } from "react-router";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import type { ProjectLayoutProps } from "~/pages/project/layout";
import ProjectVersionsPage from "~/pages/project/versions";

export default function _Versions() {
    const data = useOutletContext<ProjectLayoutProps>();

    return (
        <ProjectVersionsPage
            projectData={data.projectData}
            allProjectVersions={data.allProjectVersions}
            currUsersMembership={data.currUsersMembership}
        />
    );
}

export function meta(props: MetaArgs) {
    const parentMetaTags = props.matches?.at(-2)?.meta;

    return MetaTags({
        url: `${Config.FRONTEND_URL}${props.location.pathname}`,
        linksOnly: true,
        parentMetaTags,
    });
}
