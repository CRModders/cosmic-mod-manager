import { TagIcon } from "@app/components/icons/tag-icons";
import { Button } from "@app/components/ui/button";
import { LabelledCheckbox } from "@app/components/ui/checkbox";
import { Input } from "@app/components/ui/input";
import { cn } from "@app/components/utils";
import GAME_VERSIONS, { isExperimentalGameVersion } from "@app/utils/config/game-versions";
import {
    categoryFilterParamNamespace,
    environmentFilterParamNamespace,
    gameVersionFilterParamNamespace,
    licenseFilterParamNamespace,
    loaderFilterParamNamespace,
} from "@app/utils/config/search";
import { getALlLoaderFilters, getValidProjectCategories } from "@app/utils/project";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { ProjectType, TagHeaderType } from "@app/utils/types";
import { ChevronDownIcon, ChevronUpIcon, FilterXIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "~/components/ui/link";
import { SkipNav } from "~/components/ui/skip-nav";
import { useTranslation } from "~/locales/provider";
import { deletePageOffsetParam, updateSearchParam } from "./layout";

interface Props {
    type: ProjectType[];
    showFilters: boolean;
    searchParams: URLSearchParams;
}

const matchesSearch = (strings: string[], query: string) => {
    const queryLower = query.toLowerCase();
    for (const str of strings) {
        const strLower = str.toLowerCase();

        if (strLower.includes(queryLower) || queryLower.includes(strLower)) {
            return true;
        }
    }
    return false;
};

const filtersKeyList = [
    loaderFilterParamNamespace,
    gameVersionFilterParamNamespace,
    environmentFilterParamNamespace,
    categoryFilterParamNamespace,
    licenseFilterParamNamespace,
];

function clearFilters() {
    const currUrl = new URL(window.location.href);
    for (const key of filtersKeyList) {
        currUrl.searchParams.delete(key);
    }

    return currUrl.href.replace(window.location.origin, "");
}

function FilterSidebar({ type, showFilters, searchParams }: Props) {
    const { t } = useTranslation();
    const [showAllVersions, setShowAllVersions] = useState(false);
    const [query, setQuery] = useState("");
    const _navigate = useNavigate();

    function navigate(to: string) {
        return _navigate(to, { viewTransition: true, preventScrollReset: true });
    }

    // Labels
    const loadersFilterLabel = t.search.loaders;
    const gameVersionsFilterLabel = t.search.gameVersions;
    const environmentFilterLabel = t.search.environment;
    const categoryFilterLabel = t.search.categories;
    const featureFilterLabel = t.search.features;
    const resolutionFilterLabel = t.search.resolutions;
    const performanceFilterLabel = t.search.performanceImpact;
    const licenseFilterLabel = t.search.license;

    // Filters list
    const loaderFilters = getALlLoaderFilters(type);
    // Project Loader filters
    const loaderFilterOptions = loaderFilters
        .map((loader) => loader.name)
        .filter((loader) => matchesSearch([loader, loadersFilterLabel], query));

    // Game version filters
    const gameVersionFilterOptions = GAME_VERSIONS.filter((version) => {
        if (!showAllVersions && isExperimentalGameVersion(version.releaseType)) return false;
        return true;
    })
        .map((version) => ({ value: version.value, label: version.label }))
        .filter((version) => {
            if (!version) return false;
            return matchesSearch([version.label, version.value, gameVersionsFilterLabel], query);
        });

    // Environment filters
    const environmentFilterOptions = ["client", "server"].filter((env) => matchesSearch([env, environmentFilterLabel], query));

    // Category filters
    const categoryFilterOptions = getValidProjectCategories(type, TagHeaderType.CATEGORY)
        .map((c) => c.name)
        .filter((category) => matchesSearch([category, categoryFilterLabel], query));

    // Feature filters
    const featureFilterOptions = getValidProjectCategories(type, TagHeaderType.FEATURE)
        .map((f) => f.name)
        .filter((feature) => matchesSearch([feature, featureFilterLabel], query));

    // Resolution filters
    const resolutionFilterOptions = getValidProjectCategories(type, TagHeaderType.RESOLUTION)
        .map((r) => r.name)
        .filter((resolution) => matchesSearch([resolution, resolutionFilterLabel], query));

    // Performance impact filters
    const performanceFilterOptions = getValidProjectCategories(type, TagHeaderType.PERFORMANCE_IMPACT)
        .map((p) => p.name)
        .filter((performance) => matchesSearch([performance, performanceFilterLabel], query));

    // License filters
    const licenseFilterOptions = [{ value: "oss", label: t.search.openSourceOnly }].filter((license) =>
        matchesSearch([license.label, license.value, licenseFilterLabel], query),
    );

    const isModOrModpack = type.includes(ProjectType.MOD) || type.includes(ProjectType.MODPACK);
    const isUniversalSearchPage = type.length > 1;
    const defaultOpenAdditionalFilters = !isUniversalSearchPage;

    return (
        <aside
            className={cn(
                "relative thin-scrollbar h-fit flex flex-col gap-3 p-card-surround bg-card-background rounded-lg",
                !showFilters && "hidden lg:flex",
            )}
            style={{ gridArea: "sidebar" }}
        >
            <SkipNav />

            <div className="flex items-center justify-center gap-2">
                <Input
                    placeholder={t.search.searchFilters}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                    }}
                />

                <Button
                    variant="secondary"
                    className="shrink-0 !w-10 !h-10"
                    title={t.search.clearFilters}
                    size="icon"
                    onClick={() => {
                        const newUrl = clearFilters();
                        navigate(newUrl);
                    }}
                >
                    <FilterXIcon className="w-btn-icon-md h-btn-icon-md" />
                </Button>
            </div>

            <FilterCategory
                items={loaderFilterOptions}
                selectedItems={searchParams.getAll(loaderFilterParamNamespace)}
                label={loadersFilterLabel}
                onCheckedChange={(loaderName) => {
                    const newUrl = updateSearchParam({
                        key: loaderFilterParamNamespace,
                        value: loaderName,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                    navigate(newUrl);
                }}
            />

            <FilterCategory
                items={gameVersionFilterOptions}
                selectedItems={searchParams.getAll(gameVersionFilterParamNamespace)}
                label={gameVersionsFilterLabel}
                listWrapperClassName="max-h-[15rem] overflow-y-auto px-0.5"
                formatLabel={false}
                onCheckedChange={(version) => {
                    const newUrl = updateSearchParam({
                        key: gameVersionFilterParamNamespace,
                        value: version,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                    navigate(newUrl);
                }}
                footerItem={
                    <LabelledCheckbox
                        checked={showAllVersions}
                        onCheckedChange={(checked) => {
                            setShowAllVersions(checked === true);
                        }}
                        className="mt-3 ml-0.5 text-extra-muted-foreground"
                    >
                        {t.form.showAllVersions}
                    </LabelledCheckbox>
                }
            />

            {isModOrModpack && (
                <FilterCategory
                    items={environmentFilterOptions}
                    selectedItems={searchParams.getAll(environmentFilterParamNamespace)}
                    label={environmentFilterLabel}
                    onCheckedChange={(env) => {
                        const newUrl = updateSearchParam({
                            key: environmentFilterParamNamespace,
                            value: env,
                            deleteIfExists: true,
                            deleteParamsWithMatchingValueOnly: true,
                            customURLModifier: deletePageOffsetParam,
                        });
                        navigate(newUrl);
                    }}
                    defaultOpen={defaultOpenAdditionalFilters}
                />
            )}

            <FilterCategory
                items={categoryFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label={categoryFilterLabel}
                onCheckedChange={(category) => {
                    const newUrl = updateSearchParam({
                        key: categoryFilterParamNamespace,
                        value: category,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                    navigate(newUrl);
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />

            <FilterCategory
                items={featureFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label={featureFilterLabel}
                onCheckedChange={(feature) => {
                    const newUrl = updateSearchParam({
                        key: categoryFilterParamNamespace,
                        value: feature,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                    navigate(newUrl);
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />

            <FilterCategory
                items={resolutionFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label={resolutionFilterLabel}
                onCheckedChange={(feature) => {
                    const newUrl = updateSearchParam({
                        key: categoryFilterParamNamespace,
                        value: feature,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                    navigate(newUrl);
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />

            <FilterCategory
                items={performanceFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label={performanceFilterLabel}
                onCheckedChange={(feature) => {
                    const newUrl = updateSearchParam({
                        key: categoryFilterParamNamespace,
                        value: feature,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                    navigate(newUrl);
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />

            <FilterCategory
                items={licenseFilterOptions}
                selectedItems={searchParams.getAll(licenseFilterParamNamespace)}
                label={licenseFilterLabel}
                onCheckedChange={(license) => {
                    const newUrl = updateSearchParam({
                        key: licenseFilterParamNamespace,
                        value: license,
                        deleteIfExists: true,
                        deleteParamsWithMatchingValueOnly: true,
                        customURLModifier: deletePageOffsetParam,
                    });
                    navigate(newUrl);
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />
        </aside>
    );
}

export default FilterSidebar;

interface FilterItem {
    value: string;
    label: string;
}

interface FilterCategoryProps {
    items: FilterItem[] | string[];
    selectedItems: string[];
    label: string;
    onCheckedChange: (checked: string) => void;
    listWrapperClassName?: string;
    className?: string;
    formatLabel?: boolean;
    footerItem?: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
}

const FilterCategory = ({
    items,
    selectedItems,
    label,
    onCheckedChange,
    className,
    listWrapperClassName,
    formatLabel = true,
    footerItem,
    collapsible = true,
    defaultOpen = true,
}: FilterCategoryProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(defaultOpen);
    if (!items.length) return null;

    function toggleVisibility(e?: React.MouseEvent) {
        e?.stopPropagation();
        setIsOpen((prev) => !prev);
    }

    return (
        <section className={cn("filterCategory grid grid-cols-1", className)}>
            <div
                className={cn("flex items-center justify-between gap-x-2 p-0.5", collapsible && "cursor-pointer")}
                onClick={toggleVisibility}
                onKeyDown={(e) => {
                    if (e.key === "Enter") toggleVisibility();
                }}
            >
                <h3 className="font-bold text-base">{label}</h3>
                {collapsible && (
                    <button type="button" onClick={toggleVisibility} className="text-extra-muted-foreground">
                        {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                    </button>
                )}
            </div>
            <div className={cn("w-full flex flex-col", !isOpen && collapsible && "hidden", listWrapperClassName)}>
                {items.map((item) => {
                    const itemValue = typeof item === "string" ? item : item.value;
                    let _itemLabel = typeof item === "string" ? item : item.label;

                    // @ts-ignore
                    const tagTranslation = t.search.tags[itemValue];
                    if (tagTranslation) {
                        _itemLabel = tagTranslation;
                    }

                    const itemLabel = formatLabel ? CapitalizeAndFormatString(_itemLabel) || "" : _itemLabel;

                    return (
                        <LabelledCheckbox
                            checked={selectedItems.includes(itemValue)}
                            onCheckedChange={() => onCheckedChange(itemValue)}
                            key={itemValue}
                            name={itemLabel}
                        >
                            <span className="flex items-center justify-center gap-1">
                                <TagIcon name={itemValue} />
                                {itemLabel}
                            </span>
                        </LabelledCheckbox>
                    );
                })}
            </div>
            {!isOpen && collapsible ? null : footerItem}
        </section>
    );
};
