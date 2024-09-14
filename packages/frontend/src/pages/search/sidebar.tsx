import { TagIcon } from "@/components/tag-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LabelledCheckbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import GAME_VERSIONS from "@shared/config/game-versions";
import {
    categoryFilterParamNamespace,
    environmentFilterParamNamespace,
    gameVersionFilterParamNamespace,
    licenseFilterParamNamespace,
    loaderFilterParamNamespace,
} from "@shared/config/search";
import { CapitalizeAndFormatString, getValidProjectCategories } from "@shared/lib/utils";
import { type ProjectType, TagHeaderTypes } from "@shared/types";
import { FilterXIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePageOffsetParam, updateSearchParam } from "./layout";
import { getAllLoaderFilters } from "./utils";

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
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    // Filters list
    // Project Loader filters
    const loaderFilters = getAllLoaderFilters(type);
    const loaderFilterOptions = loaderFilters.map((loader) => loader.name).filter((loader) => matchesSearch([loader], query));

    // Game version filters
    const gameVersionFilterOptions = GAME_VERSIONS.map(({ version }) => ({ value: version.value, label: version.label })).filter(
        (version) => matchesSearch([version.label, version.value], query),
    );

    // Environment filters
    const environmentFilterOptions = ["client", "server"].filter((env) => matchesSearch([env], query));

    // Category filters
    const categoryFilterOptions = getValidProjectCategories([type], TagHeaderTypes.CATEGORY)
        .map((c) => c.name)
        .filter((category) => matchesSearch([category], query));

    // Feature filters
    const featureFilterOptions = getValidProjectCategories([type], TagHeaderTypes.FEATURE)
        .map((f) => f.name)
        .filter((feature) => matchesSearch([feature], query));

    // Resolution filters
    const resolutionFilterOptions = getValidProjectCategories([type], TagHeaderTypes.RESOLUTION)
        .map((r) => r.name)
        .filter((resolution) => matchesSearch([resolution], query));

    // Performance impact filters
    const performanceFilterOptions = getValidProjectCategories([type], TagHeaderTypes.PERFORMANCE_IMPACT)
        .map((p) => p.name)
        .filter((performance) => matchesSearch([performance], query));

    // License filters
    const licenseFilterOptions = [{ value: "oss", label: "Open source only" }].filter((license) =>
        matchesSearch([license.label, license.value], query),
    );

    return (
        <Card
            className={cn("h-fit flex flex-col gap-3 p-card-surround", showFilters === false && "hidden lg:flex")}
            style={{ gridArea: "sidebar" }}
        >
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
                label="Loaders"
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
                label="Game versions"
                listWrapperClassName="max-h-[15rem] overflow-y-auto px-0.5"
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
            />

            <FilterCategory
                items={environmentFilterOptions}
                selectedItems={searchParams.getAll(environmentFilterParamNamespace)}
                label="Environment"
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

            <FilterCategory
                items={categoryFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label="Categories"
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
                label="Features"
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
                label="Resolutions"
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
                label="Performance impact"
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
                label="License"
                className="pb-0 border-none"
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
        </Card>
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
}

const FilterCategory = ({ items, selectedItems, label, onCheckedChange, className, listWrapperClassName }: FilterCategoryProps) => {
    if (!items.length) return null;

    return (
        <div className={cn("flex flex-col gap-0.5 pb-3 border-b border-shallow-background", className)}>
            <h3 className="font-bold text-base">{label}</h3>
            <div className={cn("w-full flex flex-col", listWrapperClassName)}>
                {items.map((item) => {
                    const itemValue = typeof item === "string" ? item : item.value;

                    return (
                        <LabelledCheckbox
                            checked={selectedItems.includes(itemValue)}
                            onCheckedChange={() => onCheckedChange(itemValue)}
                            key={itemValue}
                        >
                            <span className="flex items-center justify-center gap-1">
                                <TagIcon name={itemValue} />
                                {CapitalizeAndFormatString(typeof item === "string" ? item : item.label)}
                            </span>
                        </LabelledCheckbox>
                    );
                })}
            </div>
        </div>
    );
};
