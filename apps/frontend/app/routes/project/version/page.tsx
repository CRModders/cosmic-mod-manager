import { SITE_NAME_SHORT } from "@app/utils/config";
import { formatDate } from "@app/utils/date";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { formatVersionsForDisplay } from "@app/utils/version/format";
import type { MetaArgs } from "react-router";
import VersionPage from "~/pages/project/version/page";
import type { ProjectLoaderData as projectDataLoader } from "~/routes/project/data-wrapper";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";

export default VersionPage;

export function meta(props: MetaArgs) {
    const parentMetaTags = props.matches?.at(-3)?.meta;

    const parentData = props.matches[2].data as projectDataLoader;
    const project = parentData.projectData;
    const versionSlug = props.params.versionSlug;

    if (!parentData || !project?.id) {
        return MetaTags({
            title: "Project not found",
            description: `The project with the slug/ID "${parentData.projectSlug}" does not exist.`,
            image: `${Config.FRONTEND_URL}/icon.png`,
            url: `${Config.FRONTEND_URL}`,
            suffixTitle: true,
        });
    }

    let version = parentData.versions?.find((v) => v.slug === versionSlug || v.id === versionSlug);
    if (versionSlug === "latest") {
        version = parentData.versions?.[0];
    }

    if (!version?.id) {
        return MetaTags({
            title: `Version not found - ${project.name}`,
            description: `${project.name} does not have a version with the slug/ID "${versionSlug}".`,
            image: `${Config.FRONTEND_URL}/icon.png`,
            url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug, "versions")}`,
        });
    }

    const loaders = version.loaders.length ? version.loaders.map((l) => CapitalizeAndFormatString(l)).join(" & ") : null;
    const publishedAt = formatDate(new Date(version.datePublished), "${month} ${day}, ${year}", true);

    const titleIncludesProjectName = version.title.toLowerCase().includes(project.name.toLowerCase());

    return MetaTags({
        title: `${version.title}${titleIncludesProjectName ? "" : ` - ${project.name}`}`,
        description: `Download ${project.name} ${version.versionNumber} on ${SITE_NAME_SHORT}. Supports cosmic reach ${formatVersionsForDisplay(version.gameVersions).join(", ")}${loaders ? ` on ${loaders}` : ""}. Published on ${publishedAt} by ${version.author.userName}. ${version.downloads} downloads.`,
        url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug, `version/${version.slug}`)}`,
        image: project.icon || "",
        parentMetaTags,
    });
}
