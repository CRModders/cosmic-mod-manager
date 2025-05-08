import { Button } from "@app/components/ui/button";
import { LabelledCheckbox } from "@app/components/ui/checkbox";
import { ChipButton } from "@app/components/ui/chip";
import { CommandSeparator } from "@app/components/ui/command";
import { MultiSelect } from "@app/components/ui/multi-select";
import { releaseChannelTextColor } from "@app/components/ui/release-channel-pill";
import { getLoaderFromString } from "@app/utils/convertors";
import { sortVersionsWithReference } from "@app/utils/project";
import {
    type GameVersion,
    gameVersionsList,
    getGameVersionsFromValues,
    isExperimentalGameVersion,
} from "@app/utils/src/constants/game-versions";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { VersionReleaseChannel } from "@app/utils/types";
import type { ProjectVersionData } from "@app/utils/types/api";
import { ChevronDownIcon, FilterIcon, FlaskConicalIcon, XCircleIcon } from "lucide-react";
import { useMemo, useState } from "react";
import useTheme from "~/hooks/theme";
import { useTranslation } from "~/locales/provider";

interface FilterItems {
    loaders: string[];
    gameVersions: string[];
    releaseChannels: string[];
}

interface VersionFiltersProps {
    showDevVersions_Default?: boolean;
    allProjectVersions: ProjectVersionData[];
    supportedGameVersions: string[];
}

export default function VersionFilters(props: VersionFiltersProps) {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const [showExperimentalGameVersions, setShowExperimentalGameVersions] = useState(false);
    const [showDevVersions, setShowDevVersions] = useState(props.showDevVersions_Default ?? false);
    const [filters, setFilters] = useState<FilterItems>({ loaders: [], gameVersions: [], releaseChannels: [] });

    function resetFilters() {
        setFilters({ loaders: [], gameVersions: [], releaseChannels: [] });
    }

    // Filters list
    // Loaders
    const loaderFilters: string[] = [];
    for (const version of props.allProjectVersions) {
        if (version.releaseChannel === VersionReleaseChannel.DEV && !showDevVersions) continue;

        for (const loader of version.loaders) {
            if (!loaderFilters.includes(loader)) {
                loaderFilters.push(loader);
            }
        }
    }

    // Game versions
    let gameVersionFilters: GameVersion[] = [];
    for (const version of props.allProjectVersions) {
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
    for (const version of props.allProjectVersions) {
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

    const filteredItems = useMemo(() => {
        return filterVersionItems(props.allProjectVersions, filters, showDevVersions);
    }, [filters, props.allProjectVersions, showDevVersions]);

    const hasSnapshotVersion = getGameVersionsFromValues(props.supportedGameVersions).some((ver) =>
        isExperimentalGameVersion(ver.releaseType),
    );
    const hasDevVersions = props.allProjectVersions.some((ver) => ver.releaseChannel === VersionReleaseChannel.DEV);

    const filterComponent = (
        <>
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
                            searchBox={props.supportedGameVersions.length > 5}
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
                                setFilters((prev) => ({
                                    ...prev,
                                    releaseChannels: prev.releaseChannels.filter((c) => c !== channel),
                                }));
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
                                setFilters((prev) => ({
                                    ...prev,
                                    gameVersions: prev.gameVersions.filter((v) => v !== version.value),
                                }));
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
                                    setFilters((prev) => ({
                                        ...prev,
                                        loaders: prev.loaders.filter((l) => l !== loader),
                                    }));
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
        </>
    );

    return {
        component: filterComponent,
        anyFilterEnabled: anyFilterEnabled,
        filteredItems: filteredItems,
        showDevVersions: showDevVersions,
    };
}

export function filterVersionItems(allProjectVersions: ProjectVersionData[], filters: FilterItems, showDevVersions = false) {
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
}
