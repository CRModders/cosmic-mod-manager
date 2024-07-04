import { ContentWrapperCard, PanelContent, PanelLayout, SidePanel } from "@/components/panel-layout";
import { Button } from "@/components/ui/button";
import { LabelledCheckBox } from "@/components/ui/checkbox";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { CapitalizeAndFormatString } from "@root/lib/utils";
import { type ProjectType, TagHeaderTypes } from "@root/types";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    getAllLoaderFilters,
    getAllTaggedFilters,
    getSelectedCategoryFilters,
    getSelectedLoaderFilters,
} from "./helpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOptions } from "@root/lib/sort";
import ICONS from "@/components/category-icons";

export default function SearchPage({ projectType }: { projectType: ProjectType }) {
    const [searchParams] = useSearchParams();
    const [selectedLoaderFilters, setSelectedLoaderFilters] = useState(new Set<string>([]));
    const [selectedCategoryFilters, setSelectedCategoryFilters] = useState(new Set<string>([]));
    const [openSourceOnly, setOpenSourceOnly] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedCategoryFilters(new Set(getSelectedCategoryFilters(searchParams.getAll("c"))));
        setSelectedLoaderFilters(new Set(getSelectedLoaderFilters(searchParams.getAll("l"))));
        setOpenSourceOnly(searchParams.get("oss") === "true");
    }, [searchParams]);

    return (
        <div className="w-full pb-32">
            <PanelLayout>
                <SidePanel className="px-6 py-5">
                    <div className="w-full flex flex-col items-start justify-start gap-4">
                        <Button
                            variant={"secondary"}
                            disabled={
                                window.location.href.replace(window.location.origin, "") === window.location.pathname
                            }
                            onClick={() => {
                                navigate(window.location.pathname);
                            }}
                        >
                            <CrossCircledIcon className="w-4 h-4" />
                            Clear filters
                        </Button>

                        {!getAllTaggedFilters(projectType, [TagHeaderTypes.CATEGORY])?.length ? null : (
                            <div className="w-full flex flex-col items-start justify-start">
                                <p className="text-foreground text-lg font-semibold">Categories</p>
                                {getAllTaggedFilters(projectType, [TagHeaderTypes.CATEGORY]).map((category) => {
                                    return (
                                        <LabelledCheckBox
                                            className="w-full"
                                            checkBoxId={`category-filter-checkbox-${category.name}`}
                                            key={category.name}
                                            checked={selectedCategoryFilters.has(category.name)}
                                            onCheckedChange={(e) => {
                                                const currUrl = new URL(window.location.href);
                                                if (!!e === true) {
                                                    currUrl.searchParams.append("c", category.name);
                                                } else {
                                                    currUrl.searchParams.delete("c", category.name);
                                                }

                                                navigate(currUrl.href.replace(window.location.origin, ""));
                                            }}
                                            label={
                                                <span className="flex items-center justify-center gap-1.5">
                                                    <CategoryIcon name={category.icon} />
                                                    {CapitalizeAndFormatString(category.name)?.replaceAll("-", " ") ||
                                                        ""}
                                                </span>
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {!getAllTaggedFilters(projectType, [TagHeaderTypes.FEATURE])?.length ? null : (
                            <div className="w-full flex flex-col items-start justify-start">
                                <p className="text-foreground text-lg font-semibold">Features</p>
                                {getAllTaggedFilters(projectType, [TagHeaderTypes.FEATURE]).map((category) => {
                                    return (
                                        <LabelledCheckBox
                                            className="w-full"
                                            checkBoxId={`category-filter-checkbox-${category.name}`}
                                            key={category.name}
                                            checked={selectedCategoryFilters.has(category.name)}
                                            onCheckedChange={(e) => {
                                                const currUrl = new URL(window.location.href);
                                                if (!!e === true) {
                                                    currUrl.searchParams.append("c", category.name);
                                                } else {
                                                    currUrl.searchParams.delete("c", category.name);
                                                }

                                                navigate(currUrl.href.replace(window.location.origin, ""));
                                            }}
                                            label={CapitalizeAndFormatString(category.name)?.replaceAll("-", " ") || ""}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {!getAllTaggedFilters(projectType, [TagHeaderTypes.PERFORMANCE_IMPACT])?.length ? null : (
                            <div className="w-full flex flex-col items-start justify-start">
                                <p className="text-foreground text-lg font-semibold">Performance impact</p>
                                {getAllTaggedFilters(projectType, [TagHeaderTypes.PERFORMANCE_IMPACT]).map(
                                    (category) => {
                                        return (
                                            <LabelledCheckBox
                                                className="w-full"
                                                checkBoxId={`category-filter-checkbox-${category.name}`}
                                                key={category.name}
                                                checked={selectedCategoryFilters.has(category.name)}
                                                onCheckedChange={(e) => {
                                                    const currUrl = new URL(window.location.href);
                                                    if (!!e === true) {
                                                        currUrl.searchParams.append("c", category.name);
                                                    } else {
                                                        currUrl.searchParams.delete("c", category.name);
                                                    }

                                                    navigate(currUrl.href.replace(window.location.origin, ""));
                                                }}
                                                label={
                                                    CapitalizeAndFormatString(category.name)?.replaceAll("-", " ") || ""
                                                }
                                            />
                                        );
                                    },
                                )}
                            </div>
                        )}

                        {!getAllTaggedFilters(projectType, [TagHeaderTypes.RESOLUTION])?.length ? null : (
                            <div className="w-full flex flex-col items-start justify-start">
                                <p className="text-foreground text-lg font-semibold">Resolutions</p>
                                {getAllTaggedFilters(projectType, [TagHeaderTypes.RESOLUTION]).map((category) => {
                                    return (
                                        <LabelledCheckBox
                                            className="w-full"
                                            checkBoxId={`category-filter-checkbox-${category.name}`}
                                            key={category.name}
                                            checked={selectedCategoryFilters.has(category.name)}
                                            onCheckedChange={(e) => {
                                                const currUrl = new URL(window.location.href);
                                                if (!!e === true) {
                                                    currUrl.searchParams.append("c", category.name);
                                                } else {
                                                    currUrl.searchParams.delete("c", category.name);
                                                }

                                                navigate(currUrl.href.replace(window.location.origin, ""));
                                            }}
                                            label={
                                                CapitalizeAndFormatString(category.name)
                                                    ?.replaceAll("-", " or lower")
                                                    .replaceAll("+", " or higher") || ""
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}

                        <div className="w-full flex flex-col items-start justify-start">
                            <p className="text-foreground text-lg font-semibold">Loaders</p>
                            {getAllLoaderFilters(projectType).map((loader) => {
                                return (
                                    <LabelledCheckBox
                                        className="w-full"
                                        checkBoxId={`loader-filter-checkbox-${loader.name}`}
                                        key={loader.name}
                                        checked={selectedLoaderFilters.has(loader.name)}
                                        onCheckedChange={(e) => {
                                            const currUrl = new URL(window.location.href);
                                            if (!!e === true) {
                                                currUrl.searchParams.append("l", loader.name);
                                            } else {
                                                currUrl.searchParams.delete("l", loader.name);
                                            }

                                            navigate(currUrl.href.replace(window.location.origin, ""));
                                        }}
                                        label={
                                            <span className="flex items-center justify-center gap-1.5">
                                                <CategoryIcon name={loader.icon} />
                                                {CapitalizeAndFormatString(loader.name)?.replaceAll("-", " ") || ""}
                                            </span>
                                        }
                                    />
                                );
                            })}
                        </div>

                        <div className="w-full flex flex-col items-start justify-start">
                            <p className="text-foreground text-lg font-semibold">Open source</p>

                            <LabelledCheckBox
                                className="w-full"
                                checkBoxId={"oss-only-filter-checkbox"}
                                checked={openSourceOnly}
                                onCheckedChange={(e) => {
                                    const currUrl = new URL(window.location.href);
                                    if (!!e === true) {
                                        currUrl.searchParams.append("oss", "true");
                                    } else {
                                        currUrl.searchParams.delete("oss");
                                    }

                                    navigate(currUrl.href.replace(window.location.origin, ""));
                                }}
                                label="Open source only"
                            />
                        </div>
                    </div>
                </SidePanel>
                <PanelContent>
                    <SearchPageContent
                        selectedLoaderFilters={selectedLoaderFilters}
                        selectedCategoryFilters={selectedCategoryFilters}
                        openSourceOnly={openSourceOnly}
                        projectType={projectType}
                    />
                </PanelContent>
            </PanelLayout>
        </div>
    );
}

const CategoryIcon = ({ name }: { name: string }) => {
    console.log(name);
    // @ts-ignore
    if (!ICONS[name]) return null;
    return (
        <i className="flex items-center justify-center">
            {
                // @ts-ignore
                ICONS[name]
            }
        </i>
    );
};

type SearchPageContentProps = {
    projectType: string;
    selectedLoaderFilters: Set<string>;
    selectedCategoryFilters: Set<string>;
    openSourceOnly: boolean;
};

const SearchPageContent = ({ projectType }: SearchPageContentProps) => {
    return (
        <div className="w-full flex items-start justify-start flex-col">
            <ContentWrapperCard>
                <div className="w-full flex items-center justify-start gap-4 flex-wrap md:flex-nowrap lg:flex-wrap xl:flex-nowrap">
                    <Input
                        placeholder={`Search ${CapitalizeAndFormatString(projectType)?.toLowerCase()}s...`}
                        className="border border-[#00000000] focus:border-border dark:focus:border-border"
                    />

                    <div className="flex flex-row items-center justify-center gap-2">
                        <Label className="whitespace-nowrap text-foreground-muted">Sort by</Label>
                        <Select defaultValue={SortOptions[0]}>
                            <SelectTrigger className="w-48 lg:w-64">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SortOptions.map((option) => {
                                    return (
                                        <SelectItem key={option} value={option}>
                                            {CapitalizeAndFormatString(option)}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </ContentWrapperCard>
        </div>
    );
};
