import { DownloadAnimationContext } from "@app/components/misc/download-animation";
import PaginatedNavigation from "@app/components/misc/pagination-nav";
import { buttonVariants } from "@app/components/ui/button";
import { Card } from "@app/components/ui/card";
import { TooltipProvider, TooltipTemplate } from "@app/components/ui/tooltip";
import { cn } from "@app/components/utils";
import { FormatDate_ToLocaleString } from "@app/utils/date";
import { VersionReleaseChannel } from "@app/utils/types";
import { DownloadIcon, FlaskConicalIcon } from "lucide-react";
import { useContext } from "react";
import { useSearchParams } from "react-router";
import MarkdownRenderBox from "~/components/md-renderer";
import Link from "~/components/ui/link";
import { useProjectData } from "~/hooks/project";
import { formatLocaleCode } from "~/locales";
import { useTranslation } from "~/locales/provider";
import { VersionAuthor_Header } from "~/locales/shared-enums";
import { UserProfilePath, VersionPagePath } from "~/utils/urls";
import VersionFilters from "./version-filters";

const ITEMS_PER_PAGE = 15;

export default function VersionChangelogs() {
    const ctx = useProjectData();
    const { t, locale } = useTranslation();
    const pageSearchParamKey = "page";
    const [urlSearchParams] = useSearchParams();
    const page = urlSearchParams.get(pageSearchParamKey) || "1";
    const pagesCount = Math.ceil((ctx.allProjectVersions?.length || 0) / ITEMS_PER_PAGE);
    const activePage = Number.parseInt(page) <= pagesCount ? Number.parseInt(page) : 1;

    const { show: showDownloadAnimation } = useContext(DownloadAnimationContext);

    const filterData = VersionFilters({
        allProjectVersions: ctx.allProjectVersions,
        supportedGameVersions: ctx.projectData.gameVersions,
        showDevVersions_Default: true,
    });

    const Pagination =
        (filterData.filteredItems.length || 0) > ITEMS_PER_PAGE ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageSearchParamKey} />
        ) : null;

    const visibleVersionItems = filterData.filteredItems.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

    return (
        <>
            {filterData.component}

            <Card className="p-5 w-full flex flex-col items-start justify-start">
                {visibleVersionItems.map((version, index) => {
                    const nextVersion = visibleVersionItems[index + 1];
                    const isDuplicate =
                        nextVersion?.changelog &&
                        nextVersion.changelog.length > 0 &&
                        nextVersion?.changelog === version.changelog &&
                        version.releaseChannel === nextVersion.releaseChannel;

                    const header = t.version.authoredBy(
                        version.title,
                        version.author.userName,
                        FormatDate_ToLocaleString(version.datePublished, {
                            includeTime: false,
                            shortMonthNames: true,
                            locale: formatLocaleCode(locale),
                        }),
                    );

                    return (
                        <div key={version.id} className="w-full ps-7 mb-4 relative dark:text-muted-foreground">
                            <div className="w-full flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                                <div className="flex flex-wrap gap-x-1.5 items-baseline justify-start">
                                    <ChangelogBar releaseChannel={version.releaseChannel} isDuplicate={isDuplicate === true} />
                                    {version.releaseChannel === VersionReleaseChannel.DEV ? (
                                        <TooltipProvider>
                                            <TooltipTemplate content="Dev release!" className="font-normal">
                                                <FlaskConicalIcon
                                                    aria-hidden
                                                    className="w-btn-icon-md h-btn-icon-md text-danger-foreground cursor-help"
                                                />
                                            </TooltipTemplate>
                                        </TooltipProvider>
                                    ) : null}

                                    {header.map((item, index) => {
                                        const key = `${version.id}-${index}-${item[0]}`;
                                        if (item[0] === VersionAuthor_Header.VERSION) {
                                            return (
                                                <h2 className="leading-tight" key={key}>
                                                    <Link
                                                        to={VersionPagePath(ctx.projectType, ctx.projectData.slug, version.slug)}
                                                        className="text-[1.25rem] font-bold flex items-baseline gap-2"
                                                    >
                                                        {item[1]}
                                                    </Link>
                                                </h2>
                                            );
                                        }

                                        if (item[0] === VersionAuthor_Header.AUTHOR) {
                                            return (
                                                <Link
                                                    key={key}
                                                    to={UserProfilePath(version.author.userName)}
                                                    className="link_blue hover:underline"
                                                >
                                                    {version.author.userName}
                                                </Link>
                                            );
                                        }

                                        if (item[0] === VersionAuthor_Header.PUBLISH_DATE) {
                                            return <span key={key}> {item[1]} </span>;
                                        }

                                        return <span key={key}>{item[1]}</span>;
                                    })}
                                </div>

                                {version.primaryFile?.url ? (
                                    <a
                                        href={version.primaryFile.url}
                                        className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
                                        onClick={showDownloadAnimation}
                                        rel="nofollow noindex"
                                    >
                                        <DownloadIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                        {t.common.download}
                                    </a>
                                ) : null}
                            </div>
                            {version.changelog && !isDuplicate ? (
                                <MarkdownRenderBox addIdToHeadings={false} text={version.changelog} className="me-2" />
                            ) : null}
                        </div>
                    );
                })}
            </Card>

            {Pagination}
        </>
    );
}

function ChangelogBar({ releaseChannel, isDuplicate }: { releaseChannel: VersionReleaseChannel; isDuplicate: boolean }) {
    return (
        <>
            <div
                className={cn(
                    "changelog-bar absolute w-1 h-full top-2.5 start-2 rounded-full",
                    releaseChannel === VersionReleaseChannel.RELEASE
                        ? "text-blue-500 dark:text-blue-400"
                        : releaseChannel === VersionReleaseChannel.BETA
                          ? "text-orange-500 dark:text-orange-400"
                          : releaseChannel === VersionReleaseChannel.ALPHA || releaseChannel === VersionReleaseChannel.DEV
                            ? "text-danger-background"
                            : "",

                    isDuplicate && "duplicate",
                )}
            >
                <span className="absolute top-0 left-[-0.5rem] w-4 h-4 rounded-full translate-x-[0.125rem] bg-current" />
            </div>
        </>
    );
}
