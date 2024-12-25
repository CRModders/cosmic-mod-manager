import { SITE_NAME_SHORT } from "@app/utils/config";
import { formatDate } from "@app/utils/date";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { formatVersionsForDisplay } from "@app/utils/version/format";
import { type MetaArgs, useParams, useSearchParams } from "react-router";
import { useProjectData } from "~/hooks/project";
import VersionPage from "~/pages/project/version/page";
import NotFoundPage from "~/routes/$";
import type { ProjectLoaderData as projectDataLoader } from "~/routes/project/data-wrapper";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";

export default function _() {
    const ctx = useProjectData();
    const { projectSlug, versionSlug } = useParams();
    const [searchParams] = useSearchParams();

    let versionData = ctx.allProjectVersions?.find((version) => version.slug === versionSlug || version.id === versionSlug);
    if (versionSlug === "latest") {
        const gameVersion = searchParams.get("gameVersion");
        const loader = searchParams.get("loader");
        const releaseChannel = searchParams.get("releaseChannel");

        if (!gameVersion && !loader && !releaseChannel) versionData = ctx.allProjectVersions[0];
        else {
            versionData = ctx.allProjectVersions?.filter((ver) => {
                if (gameVersion?.length && !ver.gameVersions.includes(gameVersion)) return false;
                if (loader?.length && !ver.loaders.includes(loader)) return false;
                if (releaseChannel?.length && ver.releaseChannel !== releaseChannel.toLowerCase()) return false;

                return true;
            })[0];
        }
    }

    if (!versionData || !projectSlug || !versionSlug) {
        return (
            <NotFoundPage
                className="no_full_page py-16"
                title="Version not found"
                description="The version you are looking for doesn't exist"
                linkLabel="See versions list"
                linkHref={ProjectPagePath(ctx.projectType, projectSlug || "", "versions")}
            />
        );
    }

    return <VersionPage ctx={ctx} versionData={versionData} projectSlug={projectSlug} versionSlug={versionSlug} />;
}

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
