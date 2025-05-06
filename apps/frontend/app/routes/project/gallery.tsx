import { CapitalizeAndFormatString } from "@app/utils/string";
import type { TeamMember } from "@app/utils/types/api";
import ProjectGallery from "~/pages/project/gallery/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { FormatUrl_WithHintLocale, ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/gallery";

export default ProjectGallery;

export function meta(props: Route.MetaArgs) {
    const parentMetaTags = props.matches?.at(-2)?.meta;
    const projectLoaderData = props.matches[1]?.data;

    const project = projectLoaderData?.projectData;
    if (project?.id) {
        const owner = project.members.find((member) => member.isOwner) as TeamMember;
        const organisation = project.organisation;

        const author = organisation?.name || owner.userName;
        return MetaTags({
            title: `${project.name} - Cosmic Reach ${CapitalizeAndFormatString(project.type?.[0])}`,
            description: project.summary,
            siteMetaDescription: `${project.summary} - Download the Cosmic Reach ${CapitalizeAndFormatString(project.type[0])} ${project.name} by ${author} on ${Config.SITE_NAME_SHORT}`,
            image: project.icon || "",
            url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug)}/gallery`,
        });
    }

    return MetaTags({
        url: `${Config.FRONTEND_URL}${FormatUrl_WithHintLocale(props.location.pathname)}`,
        linksOnly: true,
        parentMetaTags,
    });
}
