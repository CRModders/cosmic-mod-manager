import { PanelContent, PanelLayout, SidePanel } from "@/components/panel-layout";
import { Button } from "@/components/ui/button";
import { LabelledCheckBox } from "@/components/ui/checkbox";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { CapitalizeAndFormatString } from "@root/lib/utils";
import { type ProjectType, TagHeaderTypes } from "@root/types";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllLoaderFilters, getAllTaggedFilters, getSelectedCategoryFilters, getSelectedLoaderFilters } from "./helpers";

export default function SearchPage({ projectType }: { projectType: ProjectType }) {
    const [searchParams] = useSearchParams();
    const [selectedCategoryFilters, setSelectedCategoryFilters] = useState(new Set<string>([]));
    const [selectedLoaderFilters, setSelectedLoaderFilters] = useState(new Set<string>([]));
    const [openSourceOnly, setOpenSourceOnly] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedCategoryFilters(new Set(getSelectedCategoryFilters(searchParams.getAll("c"))));
        setSelectedLoaderFilters(new Set(getSelectedLoaderFilters(searchParams.getAll("l"))));
        setOpenSourceOnly(searchParams.get("oss") === "true");
    }, [searchParams])

    return (
        <div className="w-full pb-32">
            <PanelLayout>
                <SidePanel>
                    <div className="w-full flex flex-col items-start justify-start gap-4">
                        <Button variant={"secondary"}
                            disabled={window.location.href.replace(window.location.origin, "") === window.location.pathname}
                            onClick={() => {
                                navigate(window.location.pathname)
                            }}
                        >
                            <CrossCircledIcon className="w-4 h-4" />
                            Clear filters
                        </Button >

                        {
                            !getAllTaggedFilters(projectType, [TagHeaderTypes.CATEGORY])?.length ? null :

                                <div className="w-full flex flex-col items-start justify-start">
                                    <p className="text-foreground text-lg font-semibold">Categories</p>
                                    {
                                        getAllTaggedFilters(projectType, [TagHeaderTypes.CATEGORY]).map((category) => {
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
                                            )
                                        })
                                    }
                                </div>
                        }

                        {
                            !getAllTaggedFilters(projectType, [TagHeaderTypes.FEATURE])?.length ? null :
                                <div className="w-full flex flex-col items-start justify-start">
                                    <p className="text-foreground text-lg font-semibold">Features</p>
                                    {
                                        getAllTaggedFilters(projectType, [TagHeaderTypes.FEATURE]).map((category) => {
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
                                            )
                                        })
                                    }
                                </div>
                        }

                        {
                            !getAllTaggedFilters(projectType, [TagHeaderTypes.PERFORMANCE_IMPACT])?.length ? null :
                                <div className="w-full flex flex-col items-start justify-start">
                                    <p className="text-foreground text-lg font-semibold">Performance impact</p>
                                    {
                                        getAllTaggedFilters(projectType, [TagHeaderTypes.PERFORMANCE_IMPACT]).map((category) => {
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
                                            )
                                        })
                                    }
                                </div>
                        }

                        {
                            !getAllTaggedFilters(projectType, [TagHeaderTypes.RESOLUTION])?.length ? null :
                                <div className="w-full flex flex-col items-start justify-start">
                                    <p className="text-foreground text-lg font-semibold">Resolutions</p>
                                    {
                                        getAllTaggedFilters(projectType, [TagHeaderTypes.RESOLUTION]).map((category) => {
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
                                            )
                                        })
                                    }
                                </div>
                        }

                        <div className="w-full flex flex-col items-start justify-start">
                            <p className="text-foreground text-lg font-semibold">Loaders</p>
                            {
                                getAllLoaderFilters(projectType).map((loader) => {
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
                                            label={CapitalizeAndFormatString(loader.name)?.replaceAll("-", " ") || ""}
                                        />
                                    )
                                })
                            }
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
                <PanelContent>{projectType} - SEARCH RESULTS</PanelContent>
            </PanelLayout>
        </div>
    )
}
