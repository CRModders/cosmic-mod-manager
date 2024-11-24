import { TagIcon } from "@/components/tag-icons";
import { Button } from "@/components/ui/button";
import { LabelledCheckbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SkipNav } from "@/components/ui/skip-nav";
import { cn } from "@/lib/utils";
import GAME_VERSIONS, { isExperimentalGameVersion } from "@shared/config/game-versions";
import {
    categoryFilterParamNamespace,
    environmentFilterParamNamespace,
    gameVersionFilterParamNamespace,
    licenseFilterParamNamespace,
    loaderFilterParamNamespace,
} from "@shared/config/search";
import { CapitalizeAndFormatString, getALlLoaderFilters, getValidProjectCategories } from "@shared/lib/utils";
import { ProjectType, TagHeaderType } from "@shared/types";
import { FilterXIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { deletePageOffsetParam, updateSearchParam } from "./layout";

interface Props {
    type: ProjectType;
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

const loadersFilterLabel = "Loaders";
const gameVersionsFilterLabel = "Game versions";
const environmentFilterLabel = "Environment";
const categoryFilterLabel = "Categories";
const featureFilterLabel = "Features";
const resolutionFilterLabel = "Resolutions";
const performanceFilterLabel = "Performance impact";
const licenseFilterLabel = "License";

const filtersKeyList = [
    loaderFilterParamNamespace,
    gameVersionFilterParamNamespace,
    environmentFilterParamNamespace,
    categoryFilterParamNamespace,
    licenseFilterParamNamespace,
];

const clearFilters = () => {
    const currUrl = new URL(window.location.href);
    for (const key of filtersKeyList) {
        currUrl.searchParams.delete(key);
    }

    return currUrl.href.replace(window.location.origin, "");
};

const FilterSidebar = ({ type, showFilters, searchParams }: Props) => {
    const [showAllVersions, setShowAllVersions] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    // Filters list
    // Project Loader filters
    const loaderFilters = getALlLoaderFilters(type);
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
    const categoryFilterOptions = getValidProjectCategories([type], TagHeaderType.CATEGORY)
        .map((c) => c.name)
        .filter((category) => matchesSearch([category, categoryFilterLabel], query));

    // Feature filters
    const featureFilterOptions = getValidProjectCategories([type], TagHeaderType.FEATURE)
        .map((f) => f.name)
        .filter((feature) => matchesSearch([feature, featureFilterLabel], query));

    // Resolution filters
    const resolutionFilterOptions = getValidProjectCategories([type], TagHeaderType.RESOLUTION)
        .map((r) => r.name)
        .filter((resolution) => matchesSearch([resolution, resolutionFilterLabel], query));

    // Performance impact filters
    const performanceFilterOptions = getValidProjectCategories([type], TagHeaderType.PERFORMANCE_IMPACT)
        .map((p) => p.name)
        .filter((performance) => matchesSearch([performance, performanceFilterLabel], query));

    // License filters
    const licenseFilterOptions = [{ value: "oss", label: "Open source only" }].filter((license) =>
        matchesSearch([license.label, license.value, licenseFilterLabel], query),
    );

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
                    placeholder="Search filters..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                    }}
                />

                <Button
                    variant="secondary"
                    className="shrink-0 !w-10 !h-10"
                    title="Reset filters"
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
                        Show all versions
                    </LabelledCheckbox>
                }
            />

            {[ProjectType.MOD, ProjectType.MODPACK].includes(type) && (
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
            />
        </aside>
    );
};

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
}: FilterCategoryProps) => {
    if (!items.length) return null;

    return (
        <div className={cn("filterCategory flex flex-col gap-0.5", className)}>
            <h3 className="font-bold text-base">{label}</h3>
            <div className={cn("w-full flex flex-col", listWrapperClassName)}>
                {items.map((item) => {
                    const itemValue = typeof item === "string" ? item : item.value;
                    const _itemLabel = typeof item === "string" ? item : item.label;
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
            {footerItem}
        </div>
    );
};
