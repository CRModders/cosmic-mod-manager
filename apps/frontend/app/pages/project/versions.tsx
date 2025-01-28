import loaderIcons from "@app/components/icons/tag-icons";
import { DownloadAnimationContext } from "@app/components/misc/download-animation";
import PaginatedNavigation from "@app/components/misc/pagination-nav";
import { Button } from "@app/components/ui/button";
import { Card } from "@app/components/ui/card";
import { LabelledCheckbox } from "@app/components/ui/checkbox";
import Chip, { ChipButton } from "@app/components/ui/chip";
import { CommandSeparator } from "@app/components/ui/command";
import { copyTextToClipboard } from "@app/components/ui/copy-btn";
import { Prefetch } from "@app/components/ui/link";
import { MultiSelect } from "@app/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@app/components/ui/popover";
import { ReleaseChannelBadge, releaseChannelTextColor } from "@app/components/ui/release-channel-pill";
import { Separator } from "@app/components/ui/separator";
import { FullWidthSpinner } from "@app/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@app/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTemplate, TooltipTrigger } from "@app/components/ui/tooltip";
import { type GameVersion, gameVersionsList, getGameVersionsFromValues, isExperimentalGameVersion } from "@app/utils/config/game-versions";
import { getLoaderFromString } from "@app/utils/convertors";
import { parseFileSize } from "@app/utils/number";
import { doesMemberHaveAccess, sortVersionsWithReference } from "@app/utils/project";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { ProjectPermission, VersionReleaseChannel } from "@app/utils/types";
import type { ProjectDetailsData, ProjectVersionData } from "@app/utils/types/api";
import { formatVersionsForDisplay } from "@app/utils/version/format";
import { formatGameVersionsList_verbose } from "@app/utils/version/format-verbose";
import {
    CalendarIcon,
    ChevronDownIcon,
    DownloadIcon,
    EditIcon,
    FilterIcon,
    FlaskConicalIcon,
    InfoIcon,
    LinkIcon,
    MoreVerticalIcon,
    SquareArrowOutUpRightIcon,
    UploadIcon,
    XCircleIcon,
} from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { FormattedCount } from "~/components/ui/count";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import Link, { useNavigate, VariantButtonLink } from "~/components/ui/link";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import useTheme from "~/hooks/theme";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { ProjectPagePath, VersionPagePath } from "~/utils/urls";

interface FilterItems {
    loaders: string[];
    gameVersions: string[];
    releaseChannels: string[];
}

export default function ProjectVersionsPage() {
    const { t } = useTranslation();
    const session = useSession();
    const { theme } = useTheme();

    const ctx = useProjectData();
    const projectData = ctx.projectData;
    const allProjectVersions = ctx.allProjectVersions;

    const [showExperimentalGameVersions, setShowExperimentalGameVersions] = useState(false);
    const [showDevVersions, setShowDevVersions] = useState(false);
    const [filters, setFilters] = useState<FilterItems>({ loaders: [], gameVersions: [], releaseChannels: [] });

    function resetFilters() {
        setFilters({ loaders: [], gameVersions: [], releaseChannels: [] });
    }

    const filteredItems = useMemo(() => {
        const filteredItems: ProjectVersionData[] = [];

        for (const version of allProjectVersions || []) {
            // Check for dev version
            if (version.releaseChannel === VersionReleaseChannel.DEV && !showDevVersions) continue;

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
    }, [filters, allProjectVersions, showDevVersions]);

    if (projectData === undefined || allProjectVersions === undefined) {
        return <FullWidthSpinner />;
    }

    // Return
    if (projectData === null || allProjectVersions === null) return null;

    // Filters list
    // Loaders
    const loaderFilters: string[] = [];
    for (const version of allProjectVersions) {
        if (version.releaseChannel === VersionReleaseChannel.DEV && !showDevVersions) continue;

        for (const loader of version.loaders) {
            if (!loaderFilters.includes(loader)) {
                loaderFilters.push(loader);
            }
        }
    }

    // Game versions
    let gameVersionFilters: GameVersion[] = [];
    for (const version of allProjectVersions) {
        if (version.releaseChannel === VersionReleaseChannel.DEV && !showDevVersions) continue;

        for (const gameVersion of getGameVersionsFromValues(version.gameVersions)) {
            if (!showExperimentalGameVersions && isExperimentalGameVersion(gameVersion.releaseType)) continue;

            if (gameVersionFilters.some((ver) => ver.value === gameVersion.value)) continue;
            gameVersionFilters.push(gameVersion);
        }
    }
    // Sort game versions
    gameVersionFilters = getGameVersionsFromValues(
        sortVersionsWithReference(
            gameVersionFilters.map((ver) => ver.value),
            gameVersionsList,
        ),
    );

    // Release channels
    const releaseChannelFilters: string[] = [];
    for (const version of allProjectVersions) {
        const channel = version.releaseChannel;

        if (channel === VersionReleaseChannel.DEV && !showDevVersions) continue;
        if (!releaseChannelFilters.includes(channel)) {
            releaseChannelFilters.push(channel);
        }
    }

    const loadersFilterVisible = loaderFilters.length > 1;
    const gameVersionsFilterVisible = gameVersionFilters.length > 1;
    const releaseChannelsFilterVisible = releaseChannelFilters.length > 1;

    const anyFilterEnabled = filters.loaders.length + filters.gameVersions.length + filters.releaseChannels.length > 0;

    const hasSnapshotVersion = getGameVersionsFromValues(projectData.gameVersions).some((ver) =>
        isExperimentalGameVersion(ver.releaseType),
    );
    const hasDevVersions = allProjectVersions.some((ver) => ver.releaseChannel === VersionReleaseChannel.DEV);
    const canUploadVersion = doesMemberHaveAccess(
        ProjectPermission.UPLOAD_VERSION,
        ctx.currUsersMembership?.permissions,
        ctx.currUsersMembership?.isOwner,
        session?.role,
    );

    return (
        <>
            {canUploadVersion ? (
                <UploadVersionLinkCard uploadPageUrl={ProjectPagePath(ctx.projectType, projectData.slug, "version/new")} />
            ) : null}

            {loadersFilterVisible || gameVersionsFilterVisible || releaseChannelsFilterVisible || hasDevVersions ? (
                <div className="flex flex-wrap items-center justify-start gap-2">
                    {loadersFilterVisible ? (
                        <MultiSelect
                            selectedValues={filters.loaders}
                            options={loaderFilters.map((loader) => ({
                                label: CapitalizeAndFormatString(loader) || "",
                                value: loader,
                            }))}
                            onValueChange={(values) => {
                                setFilters((prev) => ({ ...prev, loaders: values }));
                            }}
                            searchBox={false}
                            defaultMinWidth={false}
                            customTrigger={
                                <Button variant="secondary-inverted">
                                    <FilterIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    Loaders
                                    <ChevronDownIcon aria-hidden className="w-btn-icon-md h-btn-icon-md text-extra-muted-foreground" />
                                </Button>
                            }
                            noResultsElement={t.common.noResults}
                        />
                    ) : null}

                    {gameVersionsFilterVisible ? (
                        <MultiSelect
                            searchBox={projectData.gameVersions.length > 5}
                            selectedValues={filters.gameVersions}
                            options={gameVersionFilters.map((ver) => ({ label: ver.label, value: ver.value }))}
                            onValueChange={(values) => {
                                setFilters((prev) => ({ ...prev, gameVersions: values }));
                            }}
                            defaultMinWidth={false}
                            customTrigger={
                                <Button variant="secondary-inverted">
                                    <FilterIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    {t.search.gameVersions}
                                    <ChevronDownIcon aria-hidden className="w-btn-icon-md h-btn-icon-md text-extra-muted-foreground" />
                                </Button>
                            }
                            fixedFooter={
                                hasSnapshotVersion ? (
                                    <>
                                        <CommandSeparator />
                                        <LabelledCheckbox
                                            checked={showExperimentalGameVersions}
                                            onCheckedChange={(checked) => setShowExperimentalGameVersions(checked === true)}
                                            className="text-extra-muted-foreground pe-2 ps-3.5 my-1"
                                        >
                                            {t.form.showAllVersions}
                                        </LabelledCheckbox>
                                    </>
                                ) : null
                            }
                            noResultsElement={t.common.noResults}
                        />
                    ) : null}

                    {releaseChannelsFilterVisible ? (
                        <MultiSelect
                            searchBox={false}
                            defaultMinWidth={false}
                            selectedValues={[...filters.releaseChannels]}
                            options={releaseChannelFilters.map((channel) => ({
                                label: CapitalizeAndFormatString(channel) || "",
                                value: channel,
                            }))}
                            onValueChange={(values) => {
                                setFilters((prev) => ({ ...prev, releaseChannels: values }));
                            }}
                            customTrigger={
                                <Button variant="secondary-inverted">
                                    <FilterIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    {t.search.channels}
                                    <ChevronDownIcon aria-hidden className="w-btn-icon-md h-btn-icon-md text-extra-muted-foreground" />
                                </Button>
                            }
                            noResultsElement={t.common.noResults}
                        />
                    ) : null}

                    {hasDevVersions ? (
                        <LabelledCheckbox
                            className="mx-2 sm:ms-auto"
                            checked={showDevVersions}
                            onCheckedChange={(checked) => setShowDevVersions(checked === true)}
                        >
                            <span className="flex items-center justify-center gap-1">
                                <FlaskConicalIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                {t.project.showDevVersions}
                            </span>
                        </LabelledCheckbox>
                    ) : null}
                </div>
            ) : null}

            {filters.loaders.length + filters.gameVersions.length + filters.releaseChannels.length > 0 ? (
                <div className="w-full flex items-center justify-start flex-wrap gap-x-2 gap-y-1">
                    {filters.loaders.length + filters.gameVersions.length + filters.releaseChannels.length > 1 ? (
                        <ChipButton onClick={resetFilters}>
                            {t.search.clearFilters}
                            <XCircleIcon aria-hidden className="w-btn-icon-sm h-btn-icon-sm" />
                        </ChipButton>
                    ) : null}

                    {filters.releaseChannels.map((channel) => (
                        <ChipButton
                            key={channel}
                            className={releaseChannelTextColor(channel as VersionReleaseChannel)}
                            onClick={() => {
                                setFilters((prev) => ({ ...prev, releaseChannels: prev.releaseChannels.filter((c) => c !== channel) }));
                            }}
                        >
                            {CapitalizeAndFormatString(channel)}
                            <XCircleIcon aria-hidden className="w-btn-icon-sm h-btn-icon-sm" />
                        </ChipButton>
                    ))}

                    {getGameVersionsFromValues(filters.gameVersions).map((version) => (
                        <ChipButton
                            key={version.value}
                            onClick={() => {
                                setFilters((prev) => ({ ...prev, gameVersions: prev.gameVersions.filter((v) => v !== version.value) }));
                            }}
                        >
                            {version.label}
                            <XCircleIcon aria-hidden className="w-btn-icon-sm h-btn-icon-sm" />
                        </ChipButton>
                    ))}

                    {filters.loaders.map((loader) => {
                        const loaderData = getLoaderFromString(loader);
                        if (!loaderData) return null;
                        const accentForeground = loaderData.metadata?.foreground;
                        let color = "hsla(var(--muted-foreground))";
                        if (accentForeground) {
                            color = theme === "dark" ? accentForeground.dark : accentForeground.light;
                        }

                        return (
                            <ChipButton
                                key={loader}
                                onClick={() => {
                                    setFilters((prev) => ({ ...prev, loaders: prev.loaders.filter((l) => l !== loader) }));
                                }}
                                style={{
                                    color: color,
                                }}
                            >
                                {CapitalizeAndFormatString(loader)}
                                <XCircleIcon aria-hidden className="w-btn-icon-sm h-btn-icon-sm" />
                            </ChipButton>
                        );
                    })}
                </div>
            ) : null}

            <ProjectVersionsListTable
                projectType={ctx.projectType}
                projectData={projectData}
                allProjectVersions={filteredItems}
                canEditVersion={doesMemberHaveAccess(
                    ProjectPermission.UPLOAD_VERSION,
                    ctx.currUsersMembership?.permissions || [],
                    ctx.currUsersMembership?.isOwner === true,
                    session?.role,
                )}
                anyFilterEnabled={anyFilterEnabled}
            />
        </>
    );
}

function UploadVersionLinkCard({ uploadPageUrl }: { uploadPageUrl: string }) {
    const { t } = useTranslation();

    return (
        <Card className="p-card-surround flex flex-row flex-wrap items-center justify-start gap-x-4 gap-y-2">
            <VariantButtonLink url={uploadPageUrl} variant="default" prefetch={Prefetch.Render}>
                <UploadIcon aria-hidden className="w-btn-icon h-btn-icon" />
                {t.project.uploadVersion}
            </VariantButtonLink>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <InfoIcon aria-hidden className="h-btn-icon w-btn-icon" />
                {t.project.uploadNewVersion}
            </div>
        </Card>
    );
}

interface VersionsTableProps {
    projectType: string;
    projectData: ProjectDetailsData;
    allProjectVersions: ProjectVersionData[];
    canEditVersion: boolean;
    anyFilterEnabled: boolean;
}

function ProjectVersionsListTable({ projectType, projectData, allProjectVersions, canEditVersion, anyFilterEnabled }: VersionsTableProps) {
    const { t } = useTranslation();
    const pageSearchParamKey = "page";
    const [urlSearchParams] = useSearchParams();

    const perPageLimit = 20;
    const page = urlSearchParams.get(pageSearchParamKey) || "1";
    const pagesCount = Math.ceil((allProjectVersions?.length || 0) / perPageLimit);
    const activePage = Number.parseInt(page) <= pagesCount ? Number.parseInt(page) : 1;

    const customNavigate = useNavigate();
    const { show: showDownloadAnimation } = useContext(DownloadAnimationContext);

    function versionPagePathname(versionSlug: string) {
        return VersionPagePath(projectType, projectData.slug, versionSlug);
    }

    const Pagination =
        (allProjectVersions?.length || 0) > perPageLimit ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageSearchParamKey} />
        ) : null;

    if (!allProjectVersions.length) {
        return (
            <div className="flex items-center justify-center py-6">
                <span className="text-lg italic text-extra-muted-foreground">{t.project.noProjectVersions}</span>
            </div>
        );
    }

    return (
        <>
            {allProjectVersions?.length ? (
                <TooltipProvider>
                    <Card className="overflow-hidden">
                        <Table>
                            <TableHeader className="hidden md:table-header-group">
                                <TableRow className="hover:bg-transparent dark:hover:bg-transparent h-16">
                                    {/* MOBILE ONLY */}
                                    <TableHead className="w-full grow md:hidden ps-table-side-pad-sm"> </TableHead>
                                    {/* MOBILE ONLY */}
                                    <TableHead className="md:hidden pe-table-side-pad-sm"> </TableHead>

                                    {/* MID WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:table-cell w-10 ps-table-side-pad"> </TableHead>
                                    {/* MID WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:table-cell">{t.form.name}</TableHead>
                                    {/* MID WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:table-cell">{t.project.compatibility}</TableHead>

                                    {/* MID WIDTH AND BELOW XL*/}
                                    <TableHead className="hidden md:table-cell xl:hidden">{t.project.stats}</TableHead>

                                    {/* XL WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:hidden xl:table-cell">{t.project.published}</TableHead>
                                    {/* XL WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:hidden xl:table-cell">{t.project.downloads}</TableHead>

                                    {/* MID WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:table-cell pe-table-side-pad"> </TableHead>
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
                                                customNavigate(versionPagePathname(version.slug));
                                            }
                                        }}
                                    >
                                        <TableCell className="md:hidden ps-table-side-pad-sm">
                                            {/* MOBILE ONLY */}
                                            <div className="w-full flex flex-col items-start justify-start gap-1.5">
                                                <div className="w-full flex items-center justify-start gap-2.5" title={version.title}>
                                                    <ReleaseChannelBadge releaseChannel={version.releaseChannel} />
                                                    <VersionName
                                                        title={version.title}
                                                        number={version.versionNumber}
                                                        url={versionPagePathname(version.slug)}
                                                    />
                                                </div>
                                                <div className="w-full flex flex-wrap items-center justify-start gap-1.5">
                                                    <GameVersions gameVersions={version.gameVersions} verbose={anyFilterEnabled} />
                                                    <ProjectLoaders versionLoaders={version.loaders} />
                                                </div>
                                                <div className="flex flex-wrap items-start justify-start gap-3">
                                                    <DatePublished dateStr={version.datePublished} />
                                                    <DownloadsCount downloads={version.downloads} />
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* MID WIDTH AND ABOVE */}
                                        <TableCell className="hidden md:table-cell ps-table-side-pad pe-2">
                                            <ReleaseChannelBadge releaseChannel={version.releaseChannel} />
                                        </TableCell>

                                        {/* MID WIDTH AND ABOVE */}
                                        <TableCell className="hidden md:table-cell" title={version.title}>
                                            <VersionName
                                                title={version.title}
                                                number={version.versionNumber}
                                                url={versionPagePathname(version.slug)}
                                            />
                                        </TableCell>

                                        {/* MID WIDTH AND ABOVE */}
                                        <TableCell className="hidden md:table-cell">
                                            <div className="w-full flex flex-wrap items-start justify-start gap-1.5">
                                                <GameVersions gameVersions={version.gameVersions} verbose={anyFilterEnabled} />
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
                                        <TableCell className="pe-table-side-pad-sm md:pe-table-side-pad">
                                            <div className="w-full flex gap-1 items-center justify-end">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <VariantButtonLink
                                                            url={version.primaryFile?.url || ""}
                                                            variant={"outline"}
                                                            size={"icon"}
                                                            className="noClickRedirect shrink-0 !w-10 !h-10 rounded-full"
                                                            aria-label={`download ${version.title}`}
                                                            onClick={showDownloadAnimation}
                                                        >
                                                            <DownloadIcon aria-hidden className="w-btn-icon h-btn-icon" strokeWidth={2.2} />
                                                        </VariantButtonLink>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {version.primaryFile?.name} ({parseFileSize(version.primaryFile?.size || 0)})
                                                    </TooltipContent>
                                                </Tooltip>

                                                <ThreeDotMenu
                                                    canEditVersion={canEditVersion}
                                                    versionPageUrl={versionPagePathname(version.slug)}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TooltipProvider>
            ) : null}

            {Pagination ? <div className="flex items-center justify-center">{Pagination}</div> : null}
        </>
    );
}

function VersionName({ title, number, url }: { title: string; number: string; url: string }) {
    return (
        <div className="flex flex-col items-start justify-center overflow-hidden max-w-[24ch] lg:max-w-[32ch]">
            <Link
                prefetch={Prefetch.Render}
                to={url}
                className="noClickRedirect leading-tight font-bold text-foreground md:whitespace-nowrap"
            >
                {number}
            </Link>
            <span className="leading-snug font-medium text-muted-foreground/85 text-[0.77rem] md:whitespace-nowrap">{title}</span>
        </div>
    );
}

function GameVersions({ gameVersions, verbose }: { gameVersions: string[]; verbose: boolean }) {
    if (verbose) {
        return formatGameVersionsList_verbose(gameVersions).map((version) => (
            <Chip key={version} className="text-muted-foreground">
                {version}
            </Chip>
        ));
    }

    return formatVersionsForDisplay(gameVersions).map((version) => (
        <Chip key={version} className="text-muted-foreground">
            {version}
        </Chip>
    ));
}

function ProjectLoaders({ versionLoaders }: { versionLoaders: string[] }) {
    const { theme } = useTheme();

    return (
        <>
            {versionLoaders.map((loader) => {
                const loaderData = getLoaderFromString(loader);
                if (!loaderData) return null;
                const accentForeground = loaderData?.metadata?.foreground;
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
}

function DatePublished({ dateStr, iconVisible = true }: { dateStr: string | Date; iconVisible?: boolean }) {
    return (
        <TooltipTemplate content={<FormattedDate date={dateStr} />}>
            <span className="flex gap-1.5 items-center justify-start text-muted-foreground font-medium whitespace-nowrap cursor-help">
                {iconVisible === true ? <CalendarIcon aria-hidden className="w-3.5 h-3.5" /> : null}
                <TimePassedSince date={dateStr} capitalize />
            </span>
        </TooltipTemplate>
    );
}

function DownloadsCount({ downloads, iconVisible = true }: { downloads: number; iconVisible?: boolean }) {
    return (
        <span className="flex gap-1.5 items-center justify-start text-muted-foreground font-medium">
            {iconVisible === true ? <DownloadIcon aria-hidden className="w-3.5 h-3.5" /> : null}
            <FormattedCount count={downloads} />
        </span>
    );
}

function ThreeDotMenu({ versionPageUrl, canEditVersion }: { versionPageUrl: string; canEditVersion: boolean }) {
    const { t } = useTranslation();
    const [popoverOpen, setPopoverOpen] = useState(false);

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost-no-shadow"
                    size="icon"
                    className="noClickRedirect rounded-full shrink-0 !w-10 !h-10"
                    aria-label="more options"
                >
                    <MoreVerticalIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="noClickRedirect p-1 gap-1 min-w-fit">
                <VariantButtonLink
                    className="justify-start"
                    url={versionPageUrl}
                    variant="ghost-no-shadow"
                    size="sm"
                    target="_blank"
                    onClick={() => {
                        setPopoverOpen(false);
                    }}
                >
                    <SquareArrowOutUpRightIcon aria-hidden className="w-btn-icon h-btn-icon text-muted-foreground" />
                    {t.project.openInNewTab}
                </VariantButtonLink>

                <Button
                    variant={"ghost-no-shadow"}
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                        copyTextToClipboard(`${Config.FRONTEND_URL}${versionPageUrl}`);
                        setPopoverOpen(false);
                    }}
                >
                    <LinkIcon aria-hidden className="w-btn-icon h-btn-icon text-muted-foreground" />
                    {t.project.copyLink}
                </Button>

                {canEditVersion ? (
                    <>
                        <Separator />
                        <VariantButtonLink
                            url={`${versionPageUrl}/edit`}
                            variant={"ghost-no-shadow"}
                            className="justify-start"
                            size="sm"
                            onClick={() => {
                                setPopoverOpen(false);
                            }}
                        >
                            <EditIcon aria-hidden className="w-btn-icon h-btn-icon text-muted-foreground" />
                            {t.form.edit}
                        </VariantButtonLink>
                    </>
                ) : null}
            </PopoverContent>
        </Popover>
    );
}
