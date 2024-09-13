import MarkdownRenderBox from "@/components/layout/md-editor/render-md";
import PaginatedNavigation from "@/components/pagination-nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChipButton } from "@/components/ui/chip";
import { MultiSelect } from "@/components/ui/multi-select";
import { releaseChannelBackgroundColor, releaseChannelTextColor } from "@/components/ui/release-channel-pill";
import { cn, formatDate, getProjectVersionPagePathname, projectFileUrl } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import useTheme from "@/src/hooks/use-theme";
import { SITE_NAME_SHORT } from "@shared/config";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { getLoaderFromString } from "@shared/lib/utils/convertors";
import { VersionReleaseChannel } from "@shared/types";
import type { ProjectDetailsData, ProjectVersionData } from "@shared/types/api";
import { ChevronDownIcon, DownloadIcon, FilterIcon, XCircleIcon, XIcon } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useSearchParams } from "react-router-dom";

const VersionChangelogs = () => {
    const { projectData, allProjectVersions } = useContext(projectContext);

    if (!projectData || !allProjectVersions?.length) return null;

    return <ChangelogsList projectData={projectData} versionsList={allProjectVersions} />;
};

export default VersionChangelogs;

interface FilterItems {
    loaders: string[];
    gameVersions: string[];
    releaseChannels: string[];
}

const ChangelogsList = ({ projectData, versionsList }: { projectData: ProjectDetailsData; versionsList: ProjectVersionData[] }) => {
    const { theme } = useTheme();
    const pageSearchParamKey = "page";
    const [urlSearchParams] = useSearchParams();
    const perPageLimit = 20;
    const page = urlSearchParams.get(pageSearchParamKey) || "1";
    const pagesCount = Math.ceil((versionsList?.length || 0) / perPageLimit);
    const activePage = Number.parseInt(page) <= pagesCount ? Number.parseInt(page) : 1;
    const [filters, setFilters] = useState<FilterItems>({ loaders: [], gameVersions: [], releaseChannels: [] });

    const Pagination =
        (versionsList.length || 0) > perPageLimit ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageSearchParamKey} />
        ) : null;

    const visibleItems = useMemo(() => {
        const filteredItems: ProjectVersionData[] = [];

        for (const version of versionsList) {
            if (filters.loaders.length) {
                let loaderMatch = false;
                for (const loaderFilter of filters.loaders) {
                    if (version.loaders.includes(loaderFilter)) {
                        loaderMatch = true;
                        break;
                    }
                }

                if (!loaderMatch) continue;
            }

            if (filters.gameVersions.length) {
                let versionMatch = false;
                for (const versionFilter of filters.gameVersions) {
                    if (version.gameVersions.includes(versionFilter)) {
                        versionMatch = true;
                        break;
                    }
                }

                if (!versionMatch) continue;
            }

            if (filters.releaseChannels.length) {
                if (!filters.releaseChannels.includes(version.releaseChannel)) continue;
            }

            filteredItems.push(version);
        }

        return filteredItems.slice((activePage - 1) * perPageLimit, activePage * perPageLimit);
    }, [activePage, filters, versionsList]);

    const availableReleaseChannels: string[] = [];
    for (const version of versionsList) {
        if (!availableReleaseChannels.includes(version.releaseChannel)) {
            availableReleaseChannels.push(version.releaseChannel);
        }
    }

    const resetFilters = () => {
        setFilters({ loaders: [], gameVersions: [], releaseChannels: [] });
    };

    const loadersFilterVisible = projectData.loaders.length > 1;
    const gameVersionsFilterVisible = projectData.gameVersions.length > 1;
    const releaseChannelsFilterVisible = availableReleaseChannels.length > 1;

    return (
        <>
            <Helmet>
                <title>
                    {projectData?.name || ""} - Changelog | {SITE_NAME_SHORT}
                </title>
            </Helmet>
            {loadersFilterVisible || gameVersionsFilterVisible || releaseChannelsFilterVisible ? (
                <div className="w-full flex items-center justify-start gap-2">
                    {loadersFilterVisible ? (
                        <MultiSelect
                            popupAlign="start"
                            selectedOptions={[...filters.loaders]}
                            options={projectData.loaders.map((loader) => ({
                                label: CapitalizeAndFormatString(loader) || "",
                                value: loader,
                            }))}
                            onChange={(values) => {
                                setFilters((prev) => ({ ...prev, loaders: values }));
                            }}
                        >
                            <Button variant="secondary-inverted">
                                <FilterIcon className="w-btn-icon h-btn-icon" />
                                Loaders
                                <ChevronDownIcon className="w-btn-icon-md h-btn-icon-md text-extra-muted-foreground" />
                            </Button>
                        </MultiSelect>
                    ) : null}

                    {gameVersionsFilterVisible ? (
                        <MultiSelect
                            selectedOptions={[...filters.gameVersions]}
                            options={projectData.gameVersions.map((ver) => ({ label: ver, value: ver }))}
                            onChange={(values) => {
                                setFilters((prev) => ({ ...prev, gameVersions: values }));
                            }}
                        >
                            <Button variant="secondary-inverted">
                                <FilterIcon className="w-btn-icon h-btn-icon" />
                                Game versions
                                <ChevronDownIcon className="w-btn-icon-md h-btn-icon-md text-extra-muted-foreground" />
                            </Button>
                        </MultiSelect>
                    ) : null}

                    {releaseChannelsFilterVisible ? (
                        <MultiSelect
                            selectedOptions={[...filters.releaseChannels]}
                            options={availableReleaseChannels.map((channel) => ({
                                label: CapitalizeAndFormatString(channel) || "",
                                value: channel,
                            }))}
                            onChange={(values) => {
                                setFilters((prev) => ({ ...prev, releaseChannels: values }));
                            }}
                        >
                            <Button variant="secondary-inverted">
                                <FilterIcon className="w-btn-icon h-btn-icon" />
                                Channels
                                <ChevronDownIcon className="w-btn-icon-md h-btn-icon-md text-extra-muted-foreground" />
                            </Button>
                        </MultiSelect>
                    ) : null}
                </div>
            ) : null}

            {filters.loaders.length + filters.gameVersions.length + filters.releaseChannels.length > 0 ? (
                <div className="w-full flex items-center justify-start flex-wrap gap-x-2 gap-y-1">
                    {filters.loaders.length + filters.gameVersions.length + filters.releaseChannels.length > 1 ? (
                        <ChipButton onClick={resetFilters}>
                            <XCircleIcon className="w-btn-icon-sm h-btn-icon-sm" />
                            Clear all filters
                        </ChipButton>
                    ) : null}

                    {filters.releaseChannels.map((channel) => (
                        <ChipButton
                            key={channel}
                            className={cn(
                                releaseChannelTextColor(channel as VersionReleaseChannel),
                                releaseChannelBackgroundColor(channel as VersionReleaseChannel),
                            )}
                            onClick={() => {
                                setFilters((prev) => ({ ...prev, releaseChannels: prev.releaseChannels.filter((c) => c !== channel) }));
                            }}
                        >
                            <XIcon className="w-btn-icon-sm h-btn-icon-sm" />
                            {CapitalizeAndFormatString(channel)}
                        </ChipButton>
                    ))}

                    {filters.gameVersions.map((version) => (
                        <ChipButton
                            key={version}
                            onClick={() => {
                                setFilters((prev) => ({ ...prev, gameVersions: prev.gameVersions.filter((v) => v !== version) }));
                            }}
                        >
                            <XIcon className="w-btn-icon-sm h-btn-icon-sm" />
                            {CapitalizeAndFormatString(version)}
                        </ChipButton>
                    ))}

                    {filters.loaders.map((loader) => {
                        const loaderData = getLoaderFromString(loader);
                        if (!loaderData) return null;
                        const accentForeground = loaderData.metadata?.accent?.foreground;

                        return (
                            <ChipButton
                                key={loader}
                                onClick={() => {
                                    setFilters((prev) => ({ ...prev, loaders: prev.loaders.filter((l) => l !== loader) }));
                                }}
                                style={{
                                    color: accentForeground
                                        ? theme === "dark"
                                            ? accentForeground?.dark
                                            : accentForeground?.light
                                        : "hsla(var(--muted-foreground))",
                                }}
                            >
                                <XIcon className="w-btn-icon-sm h-btn-icon-sm" />
                                {CapitalizeAndFormatString(loader)}
                            </ChipButton>
                        );
                    })}
                </div>
            ) : null}

            <Card className="p-5 w-full flex flex-col items-start justify-start">
                {visibleItems.map((version) => {
                    return (
                        <div key={version.id} className="w-full pl-7 mb-4 relative dark:text-muted-foreground">
                            <div className="w-full flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                                <div className="flex flex-wrap gap-x-1.5 items-baseline justify-start">
                                    <ChangelogBar releaseChannel={version.releaseChannel} />
                                    <h2 className="leading-tight">
                                        <Link
                                            to={getProjectVersionPagePathname(projectData.type[0], projectData.slug, version.slug)}
                                            className="text-xl font-bold"
                                        >
                                            {version.title}
                                        </Link>
                                    </h2>
                                    <span>
                                        by{" "}
                                        <Link to={`/user/${version.author.userName}`} className="link_blue hover:underline">
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
