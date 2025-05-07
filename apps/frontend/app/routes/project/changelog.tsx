import VersionChangelogs from "~/pages/project/changelog";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { FormatUrl_WithHintLocale, ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/changelog";

export default VersionChangelogs;

export function meta(props: Route.MetaArgs) {
    const projectLoaderData = props.matches[1]?.data;

    const project = projectLoaderData?.projectData;
    if (project?.id) {
        return MetaTags({
            title: `${project.name} - Changelog`,
            description: `View the changelog of ${project.name}'s ${projectLoaderData.versions?.length || 0} version(s).`,
            image: project.icon || "",
            url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug, "changelog")}`,
        });
    }

    const parentMetaTags = props.matches?.at(-2)?.meta;
    return MetaTags({
        url: `${Config.FRONTEND_URL}${FormatUrl_WithHintLocale(props.location.pathname)}`,
        linksOnly: true,
        parentMetaTags,
    });
}
