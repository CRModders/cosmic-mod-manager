import { SITE_NAME_SHORT } from "@app/utils/constants";
import { CapitalizeAndFormatString } from "@app/utils/string";
import type { TeamMember } from "@app/utils/types/api";
import type { MetaArgs } from "react-router";
import ProjectGallery from "~/pages/project/gallery/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { PageUrl, ProjectPagePath } from "~/utils/urls";
import type { ProjectLoaderData } from "./data-wrapper";

export default ProjectGallery;

export function meta(props: MetaArgs) {
    const parentMetaTags = props.matches?.at(-2)?.meta;
    const projectLoaderData = props.matches[2]?.data as unknown as ProjectLoaderData | undefined;

    const project = projectLoaderData?.projectData;
    if (project?.id) {
        const owner = project.members.find((member) => member.isOwner) as TeamMember;
        const organisation = project.organisation;

        const author = organisation?.name || owner.userName;
        return MetaTags({
            title: `${project.name} - Cosmic Reach ${CapitalizeAndFormatString(project.type?.[0])}`,
            description: project.summary,
            siteMetaDescription: `${project.summary} - Download the Cosmic Reach ${CapitalizeAndFormatString(project.type[0])} ${project.name} by ${author} on ${SITE_NAME_SHORT}`,
            image: project.icon || "",
            url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug)}/gallery`,
        });
    }

    return MetaTags({
        url: `${Config.FRONTEND_URL}${PageUrl(props.location.pathname)}`,
        linksOnly: true,
        parentMetaTags,
    });
}
