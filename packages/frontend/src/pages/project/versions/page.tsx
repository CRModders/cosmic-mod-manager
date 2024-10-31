import { DownloadAnimationContext } from "@/components/download-ripple";
import PaginatedNavigation from "@/components/pagination-nav";
import loaderIcons from "@/components/tag-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LabelledCheckbox } from "@/components/ui/checkbox";
import Chip, { ChipButton } from "@/components/ui/chip";
import { copyTextToClipboard } from "@/components/ui/copy-btn";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { VariantButtonLink } from "@/components/ui/link";
import { MultiSelect } from "@/components/ui/multi-select";
import { ReleaseChannelBadge, releaseChannelBackgroundColor, releaseChannelTextColor } from "@/components/ui/release-channel-pill";
import { FullWidthSpinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatGameVersionsList } from "@/lib/semver";
import { cn, getProjectPagePathname, getProjectVersionPagePathname, timeSince } from "@/lib/utils";
import { useSession } from "@/src/contexts/auth";
import { projectContext } from "@/src/contexts/curr-project";
import useTheme from "@/src/hooks/use-theme";
import { LoadingStatus } from "@/types";
import { SITE_NAME_SHORT } from "@shared/config";
import { getGameVersionsFromValues } from "@shared/config/game-versions";
import { CapitalizeAndFormatString, doesMemberHaveAccess, parseFileSize } from "@shared/lib/utils";
import { getLoaderFromString } from "@shared/lib/utils/convertors";
import { GameVersionReleaseType, ProjectPermission, type VersionReleaseChannel } from "@shared/types";
import type { ProjectDetailsData, ProjectVersionData } from "@shared/types/api";
import {
    CalendarIcon,
    ChevronDownIcon,
    DownloadIcon,
    FilterIcon,
    InfoIcon,
    LinkIcon,
    MoreVerticalIcon,
    SquareArrowOutUpRightIcon,
    UploadIcon,
    XCircleIcon,
    XIcon,
} from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./../styles.css";

interface FilterItems {
    loaders: string[];
    gameVersions: string[];
    releaseChannels: string[];
}

const ProjectVersionsPage = () => {
    const { theme } = useTheme();
    const [showAllVersions, setShowAllVersions] = useState(false);
    const [filters, setFilters] = useState<FilterItems>({ loaders: [], gameVersions: [], releaseChannels: [] });
    const { projectData, allProjectVersions, currUsersMembership } = useContext(projectContext);
    const { session } = useSession();

    const resetFilters = () => {
        setFilters({ loaders: [], gameVersions: [], releaseChannels: [] });
    };

    const filteredItems = useMemo(() => {
        const filteredItems: ProjectVersionData[] = [];

        for (const version of allProjectVersions || []) {
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

        return filteredItems;
    }, [filters, allProjectVersions]);

    if (projectData === undefined || allProjectVersions === undefined) {
        return <FullWidthSpinner />;
    }

    if (projectData === null || allProjectVersions === null) return null;

    const availableReleaseChannels: string[] = [];
    for (const version of allProjectVersions) {
        if (!availableReleaseChannels.includes(version.releaseChannel)) {
            availableReleaseChannels.push(version.releaseChannel);
        }
    }

    const loadersFilterVisible = projectData.loaders.length > 1;
    const gameVersionsFilterVisible = projectData.gameVersions.length > 1;
    const releaseChannelsFilterVisible = availableReleaseChannels.length > 1;

    const hasSnapshotVersion = getGameVersionsFromValues(projectData.gameVersions).some((ver) =>
        [GameVersionReleaseType.SNAPSHOT].includes(ver.releaseType),
    );
    const gameVersionOptions = getGameVersionsFromValues(projectData.gameVersions)
        .filter((ver) => showAllVersions || ![GameVersionReleaseType.SNAPSHOT].includes(ver.releaseType))
        .map((ver) => ({ label: ver.label, value: ver.value }));

    return (
        <>
            {currUsersMembership.status === LoadingStatus.LOADED &&
            doesMemberHaveAccess(
                ProjectPermission.UPLOAD_VERSION,
                currUsersMembership.data?.permissions,
                currUsersMembership.data?.isOwner,
            ) ? (
                <UploadVersionLinkCard uploadPageUrl={`${getProjectPagePathname(projectData.type[0], projectData.slug)}/version/new`} />
            ) : null}

            {loadersFilterVisible || gameVersionsFilterVisible || releaseChannelsFilterVisible ? (
                <div className="w-full flex flex-wrap items-center justify-start gap-2">
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
                            popupAlign="start"
                            selectedOptions={[...filters.gameVersions]}
                            options={gameVersionOptions}
                            onChange={(values) => {
                                setFilters((prev) => ({ ...prev, gameVersions: values }));
                            }}
                            footerItem={
                                hasSnapshotVersion ? (
                                    <LabelledCheckbox
                                        checked={showAllVersions}
                                        onCheckedChange={(checked) => setShowAllVersions(checked === true)}
                                        className="text-extra-muted-foreground px-2 py-1"
                                    >
                                        Show all versions
                                    </LabelledCheckbox>
                                ) : null
                            }
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
                            popupAlign="start"
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

                    {getGameVersionsFromValues(filters.gameVersions).map((version) => (
                        <ChipButton
                            key={version.value}
                            onClick={() => {
                                setFilters((prev) => ({ ...prev, gameVersions: prev.gameVersions.filter((v) => v !== version.value) }));
                            }}
                        >
                            <XIcon className="w-btn-icon-sm h-btn-icon-sm" />
                            {version.label}
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

            <ProjectVersionsListTable projectData={projectData} allProjectVersions={filteredItems} />
        </>
    );
};

export const Component = ProjectVersionsPage;

const UploadVersionLinkCard = ({ uploadPageUrl }: { uploadPageUrl: string }) => {
    return (
        <Card className="p-card-surround w-full flex flex-row flex-wrap items-center justify-start gap-x-4 gap-y-2">
            <VariantButtonLink url={uploadPageUrl} variant={"default"}>
                <UploadIcon className="w-btn-icon h-btn-icon" />
                Upload a version
            </VariantButtonLink>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <InfoIcon className="h-btn-icon w-btn-icon" />
                Upload a new project version
            </div>
        </Card>
    );
};

const ProjectVersionsListTable = ({
    projectData,
    allProjectVersions,
}: { projectData: ProjectDetailsData; allProjectVersions: ProjectVersionData[] }) => {
    const pageSearchParamKey = "page";
    const [urlSearchParams] = useSearchParams();
    const perPageLimit = 20;
    const page = urlSearchParams.get(pageSearchParamKey) || "1";
    const pagesCount = Math.ceil((allProjectVersions?.length || 0) / perPageLimit);
    const activePage = Number.parseInt(page) <= pagesCount ? Number.parseInt(page) : 1;
    const navigate = useNavigate();
    const { show: showDownloadAnimation } = useContext(DownloadAnimationContext);

    const versionPagePathname = (versionSlug: string) => getProjectVersionPagePathname(projectData.type[0], projectData.slug, versionSlug);

    const Pagination =
        (allProjectVersions?.length || 0) > perPageLimit ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageSearchParamKey} />
        ) : null;

    return (
        <>
            <Helmet>
                <title>
                    {projectData?.name || ""} - Versions | {SITE_NAME_SHORT}
                </title>
            </Helmet>

            {allProjectVersions?.length ? (
                <TooltipProvider>
                    <Card className="w-full overflow-hidden">
                        <Table>
                            <TableHeader className="hidden md:table-header-group">
                                <TableRow className="hover:bg-transparent dark:hover:bg-transparent h-16">
                                    {/* MOBILE ONLY */}
                                    <TableHead className="w-full grow md:hidden pl-table-side-pad-sm"> </TableHead>
                                    {/* MOBILE ONLY */}
                                    <TableHead className="md:hidden pr-table-side-pad-sm"> </TableHead>

                                    {/* MID WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:table-cell w-10 pl-table-side-pad"> </TableHead>
                                    {/* MID WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:table-cell">Name</TableHead>
                                    {/* MID WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:table-cell">Compatibility</TableHead>

                                    {/* MID WIDTH AND BELOW XL*/}
                                    <TableHead className="hidden md:table-cell xl:hidden">Stats</TableHead>

                                    {/* XL WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:hidden xl:table-cell">Published</TableHead>
                                    {/* XL WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:hidden xl:table-cell">Downloads</TableHead>

                                    {/* MID WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:table-cell pr-table-side-pad"> </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allProjectVersions.slice((activePage - 1) * perPageLimit, activePage * perPageLimit).map((version) => (
                                    <TableRow
                                        key={version.id}
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            //@ts-expect-error
                                            if (!e.target.closest(".noClickRedirect")) {
                                                navigate(versionPagePathname(version.slug));
                                            }
                                        }}
                                    >
                                        <TableCell className="md:hidden pl-table-side-pad-sm">
                                            {/* MOBILE ONLY */}
                                            <div className="w-full flex flex-col items-start justify-start gap-1.5">
                                                <div className="w-full flex items-center justify-start gap-2.5">
                                                    <ReleaseChannelBadge releaseChannel={version.releaseChannel} />
                                                    <VersionName
                                                        title={version.title}
                                                        number={version.versionNumber}
                                                        url={versionPagePathname(version.slug)}
                                                    />
                                                </div>
                                                <div className="w-full flex flex-wrap items-center justify-start gap-1.5">
                                                    <GameVersions gameVersions={version.gameVersions} />
                                                    <ProjectLoaders versionLoaders={version.loaders} />
                                                </div>
                                                <div className="flex flex-wrap items-start justify-start gap-3">
                                                    <DatePublished dateStr={version.datePublished} />
                                                    <DownloadsCount downloads={version.downloads} />
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* MID WIDTH AND ABOVE */}
                                        <TableCell className="hidden md:table-cell pl-table-side-pad pr-2">
                                            <ReleaseChannelBadge releaseChannel={version.releaseChannel} />
                                        </TableCell>

                                        {/* MID WIDTH AND ABOVE */}
                                        <TableCell className="hidden md:table-cell">
                                            <VersionName
                                                title={version.title}
                                                number={version.versionNumber}
                                                url={versionPagePathname(version.slug)}
                                            />
                                        </TableCell>

                                        {/* MID WIDTH AND ABOVE */}
                                        <TableCell className="hidden md:table-cell">
                                            <div className="w-full flex flex-wrap items-start justify-start gap-1.5">
                                                <GameVersions gameVersions={version.gameVersions} />
                                                <ProjectLoaders versionLoaders={version.loaders} />
                                            </div>
                                        </TableCell>

                                        {/* MID WIDTH AND BELOW XL*/}
                                        <TableCell className="hidden md:table-cell xl:hidden">
                                            <div className="min-w-max lex flex-wrap items-start justify-start gap-3">
                                                <DatePublished dateStr={version.datePublished} />
                                                <DownloadsCount downloads={version.downloads} />
                                            </div>
                                        </TableCell>

                                        {/* XL WIDTH AND ABOVE */}
                                        <TableCell className="hidden md:hidden xl:table-cell">
                                            <DatePublished dateStr={version.datePublished} iconVisible={false} />
                                        </TableCell>

                                        {/* XL WIDTH AND ABOVE */}
                                        <TableCell className="hidden md:hidden xl:table-cell">
                                            <DownloadsCount downloads={version.downloads} iconVisible={false} />
                                        </TableCell>

                                        {/* ALWAYS THE SAME */}
                                        <TableCell className="pr-table-side-pad-sm md:pr-table-side-pad">
                                            <div className="w-full flex gap-1 items-center justify-end">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <VariantButtonLink
                                                            url={version.primaryFile?.url || ""}
                                                            variant={"outline"}
                                                            size={"icon"}
                                                            className="noClickRedirect shrink-0 !w-10 !h-10 rounded-full"
                                                            aria-label={`download ${version.title}`}
                                                            onClick={() => showDownloadAnimation()}
                                                        >
                                                            <DownloadIcon className="w-btn-icon h-btn-icon" strokeWidth={2.2} />
                                                        </VariantButtonLink>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {version.primaryFile?.name} ({parseFileSize(version.primaryFile?.size || 0)})
                                                    </TooltipContent>
                                                </Tooltip>

                                                <ThreeDotMenu version={version} versionPageUrl={versionPagePathname(version.slug)} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TooltipProvider>
            ) : null}

            {Pagination ? <div className="w-full flex items-center justify-center">{Pagination}</div> : null}
        </>
    );
};

const VersionName = ({ title, number, url }: { title: string; number: string; url: string }) => {
    return (
        <div className="flex flex-col items-start justify-center gap-1 overflow-hidden max-w-[24ch] lg:max-w-[32ch]" title={number}>
            <Link to={url} className="noClickRedirect leading-none font-bold text-foreground whitespace-pre-wrap">
                {number}
            </Link>
            <span className="leading-none font-medium text-muted-foreground/85 text-sm">{title}</span>
        </div>
    );
};

const GameVersions = ({ gameVersions }: { gameVersions: string[] }) => {
    return (
        <>
            {formatGameVersionsList(gameVersions).map((version) => (
                <Chip key={version} className="text-muted-foreground">
                    {version}
                </Chip>
            ))}
        </>
    );
};

const ProjectLoaders = ({ versionLoaders }: { versionLoaders: string[] }) => {
    const { theme } = useTheme();

    return (
        <>
            {versionLoaders.map((loader) => {
                const loaderData = getLoaderFromString(loader);
                if (!loaderData) return null;
                const accentForeground = loaderData?.metadata?.accent?.foreground;
                // @ts-ignore
                const loaderIcon: ReactNode = loaderIcons[loaderData.name];

                return (
                    <Chip
                        key={loaderData.name}
                        style={{
                            color: accentForeground
                                ? theme === "dark"
                                    ? accentForeground?.dark
                                    : accentForeground?.light
                                : "hsla(var(--muted-foreground))",
                        }}
                    >
                        {loaderIcon ? loaderIcon : null}
                        {CapitalizeAndFormatString(loaderData.name)}
                    </Chip>
                );
            })}
        </>
    );
};

const DatePublished = ({ dateStr, iconVisible = true }: { dateStr: string | Date; iconVisible?: boolean }) => {
    const date = new Date(dateStr);

    if (!date) {
        return null;
    }

    return (
        <span className="flex gap-1.5 items-center justify-start text-muted-foreground font-medium whitespace-nowrap">
            {iconVisible === true ? <CalendarIcon className="w-3.5 h-3.5" /> : null}
            {timeSince(date)}
        </span>
    );
};

const DownloadsCount = ({ downloads, iconVisible = true }: { downloads: number; iconVisible?: boolean }) => {
    return (
        <span className="flex gap-1.5 items-center justify-start text-muted-foreground font-medium">
            {iconVisible === true ? <DownloadIcon className="w-3.5 h-3.5" /> : null}
            {downloads}
        </span>
    );
};

const ThreeDotMenu = ({ version, versionPageUrl }: { version: ProjectVersionData; versionPageUrl: string }) => {
    const [dropDownOpen, setDropDownOpen] = useState(false);

    return (
        <DropdownMenu open={dropDownOpen} onOpenChange={setDropDownOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost-no-shadow"
                    size="icon"
                    className="noClickRedirect rounded-full shrink-0 !w-10 !h-10"
                    aria-label="more options"
                >
                    <MoreVerticalIcon className="w-btn-icon-md h-btn-icon-md" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="noClickRedirect">
                <VariantButtonLink
                    url={versionPageUrl}
                    variant={"ghost-no-shadow"}
                    size={"sm"}
                    target="_blank"
                    onClick={() => {
                        setDropDownOpen(false);
                    }}
                >
                    <SquareArrowOutUpRightIcon className="w-btn-icon-sm h-btn-icon-sm text-muted-foreground" />
                    Open in new tab
                </VariantButtonLink>

                <Button
                    variant={"ghost-no-shadow"}
                    size={"sm"}
                    className="justify-start"
                    onClick={() => {
                        copyTextToClipboard(`${window.location.origin}${versionPageUrl}`);
                        setDropDownOpen(false);
                    }}
                >
                    <LinkIcon className="w-btn-icon-sm h-btn-icon-sm text-muted-foreground" />
                    Copy link
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
