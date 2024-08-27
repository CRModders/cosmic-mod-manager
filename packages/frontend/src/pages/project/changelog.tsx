import MarkdownRenderBox from "@/components/layout/md-editor/render-md";
import PaginatedNavigation from "@/components/pagination-nav";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatDate, getProjectVersionPagePathname, projectFileUrl } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import { SITE_NAME_SHORT } from "@shared/config";
import { VersionReleaseChannel } from "@shared/types";
import type { ProjectDetailsData, ProjectVersionData } from "@shared/types/api";
import { DownloadIcon } from "lucide-react";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { Link, useSearchParams } from "react-router-dom";

const VersionChangelogs = () => {
    const { projectData, allProjectVersions } = useContext(projectContext);

    if (!projectData || !allProjectVersions?.length) return null;

    return <ChangelogsList projectData={projectData} versionsList={allProjectVersions} />;
};

export default VersionChangelogs;

const ChangelogsList = ({ projectData, versionsList }: { projectData: ProjectDetailsData; versionsList: ProjectVersionData[] }) => {
    const pageSearchParamKey = "page";
    const [urlSearchParams] = useSearchParams();
    const perPageLimit = 20;
    const page = urlSearchParams.get(pageSearchParamKey) || "1";
    const pagesCount = Math.ceil((versionsList?.length || 0) / perPageLimit);
    const activePage = Number.parseInt(page) <= pagesCount ? Number.parseInt(page) : 1;

    const Pagination =
        (versionsList.length || 0) > perPageLimit ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageSearchParamKey} />
        ) : null;

    return (
        <>
            <Helmet>
                <title>
                    {projectData?.name || ""} - Changelog | {SITE_NAME_SHORT}
                </title>
            </Helmet>

            <span className="text-extra-muted-foreground italic">TODO: ADD FILTERS</span>

            <Card className="p-5 w-full flex flex-col items-start justify-start">
                {versionsList.slice((activePage - 1) * perPageLimit, activePage * perPageLimit).map((version) => {
                    return (
                        <div key={version.id} className="w-full pl-7 mb-4 relative text-muted-foreground">
                            <div className="w-full flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                                <div className="flex flex-wrap gap-x-1.5 items-baseline justify-start">
                                    <ChangelogBar releaseChannel={version.releaseChannel} />
                                    <h2 className="leading-tight">
                                        <Link
                                            to={getProjectVersionPagePathname(projectData.type[0], projectData.slug, version.slug)}
                                            className="text-xl font-bold text-muted-foreground"
                                        >
                                            {version.title}
                                        </Link>
                                    </h2>
                                    <span>
                                        by{" "}
                                        <Link to={`/user/${version.author.userName}`} className="text-link-foreground hover:underline">
                                            {version.author.userName}
                                        </Link>
                                    </span>
                                    <span>on {formatDate(new Date(version.datePublished), "${month} ${day}, ${year}", true)}</span>
                                </div>

                                {version.primaryFile?.url ? (
                                    <a
                                        href={projectFileUrl(version.primaryFile.url)}
                                        className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
                                    >
                                        <DownloadIcon className="w-btn-icon h-btn-icon" />
                                        Download
                                    </a>
                                ) : null}
                            </div>
                            {version.changelog ? <MarkdownRenderBox text={version.changelog} className="mt-2 mr-2" /> : null}
                        </div>
                    );
                })}
            </Card>

            {Pagination}

        </>
    );
};

const ChangelogBar = ({ releaseChannel }: { releaseChannel: VersionReleaseChannel }) => {
    return (
        <>
            <div
                className={cn(
                    "absolute w-1 h-full bg-current top-2.5 left-2 rounded-full",
                    releaseChannel === VersionReleaseChannel.RELEASE
                        ? "text-blue-500 dark:text-blue-400"
                        : releaseChannel === VersionReleaseChannel.BETA
                            ? "text-orange-500 dark:text-orange-400"
                            : releaseChannel === VersionReleaseChannel.ALPHA
                                ? "text-danger-background"
                                : "",
                )}
            >
                <span className="absolute top-0 left-[-0.5rem] w-4 h-4 rounded-full bg-current translate-x-[0.125rem]" />
            </div>
        </>
    );
};
