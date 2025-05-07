import ProjectGallery from "~/pages/project/gallery/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { FormatUrl_WithHintLocale, ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/gallery";

export default ProjectGallery;

export function meta(props: Route.MetaArgs) {
    const projectLoaderData = props.matches[1]?.data;

    const project = projectLoaderData?.projectData;
    if (project?.id) {
        return MetaTags({
            title: `${project.name} - Gallery`,
            description: `View ${project.gallery.length} image(s) of ${project.name} on ${Config.SITE_NAME_SHORT}`,
            image: project.icon || "",
            url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug, "gallery")}`,
        });
    }

    const parentMetaTags = props.matches?.at(-2)?.meta;
    return MetaTags({
        url: `${Config.FRONTEND_URL}${FormatUrl_WithHintLocale(props.location.pathname)}`,
        linksOnly: true,
        parentMetaTags,
    });
}
