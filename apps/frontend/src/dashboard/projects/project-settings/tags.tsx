import { SaveIcon } from "@/components/icons";
import { ContentWrapperCard } from "@/components/panel-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { Projectcontext } from "@/src/providers/project-context";
import { maxFeaturedProjectTags } from "@root/config";
import type { CategoryType } from "@root/config/project";
import { CapitalizeAndFormatString, GetProjectTagsFromNames, GetValidProjectCategories } from "@root/lib/utils";
import { useContext, useEffect, useState } from "react";

const TagsSettingsPage = () => {
    const [loading, setLoading] = useState(false);
    const [saveBtnDisabled, setSaveBtnDisabled] = useState(false);
    const { projectData, fetchProjectData } = useContext(Projectcontext);
    const [selectedTags, setSelectedTags] = useState(new Set<CategoryType>());
    const [featuredTags, setFeaturedTags] = useState(new Set<CategoryType>());

    const handleTagsSelection = (category: CategoryType, checked: boolean) => {
        if (checked === true) {
            setSelectedTags((prev) => {
                const newSet = new Set(prev);
                newSet.add(category);
                return newSet;
            });
        } else {
            setSelectedTags((prev) => {
                const newSet = new Set(prev);
                newSet.delete(category);
                return newSet;
            });
        }
    };

    const handleFeaturedTagsSelection = (category: CategoryType, checked: boolean) => {
        if (checked === true) {
            if (Array.from(featuredTags).length === maxFeaturedProjectTags) return;
            setFeaturedTags((prev) => {
                const newSet = new Set(prev);
                newSet.add(category);
                return newSet;
            });
        } else {
            setFeaturedTags((prev) => {
                const newSet = new Set(prev);
                newSet.delete(category);
                return newSet;
            });
        }
    };

    const updateProjectTags = async () => {
        if (loading || saveBtnDisabled) return;
        setLoading(true);

        const res = await useFetch(`/api/project/${projectData?.url_slug}/update-tags`, {
            method: "POST",
            body: JSON.stringify({
                tags: Array.from(selectedTags).map((tag) => tag.name),
                featuredTags: Array.from(featuredTags).map((tag) => tag.name),
            }),
        });
        setLoading(false);
        const result = await res.json();

        if (!res.ok) {
            return toast({
                title: result?.message || "Something went wrong",
            });
        }

        await fetchProjectData();
    };

    useEffect(() => {
        for (const tag of featuredTags) {
            if (!selectedTags.has(tag)) {
                setFeaturedTags((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(tag);
                    return newSet;
                });
            }
        }
    }, [selectedTags, featuredTags]);

    useEffect(() => {
        if (projectData?.id) {
            setSelectedTags(GetProjectTagsFromNames(projectData?.tags || [], projectData.type));
            setFeaturedTags(GetProjectTagsFromNames(projectData?.featured_tags || [], projectData.type));
        }
    }, [projectData]);

    useEffect(() => {
        if (projectData?.tags.length !== selectedTags.size || projectData.featured_tags.length !== featuredTags.size)
            return setSaveBtnDisabled(false);
        for (const selectedTag of selectedTags) {
            if (!projectData.tags.includes(selectedTag.name)) return setSaveBtnDisabled(false);
        }
        for (const featuredTag of featuredTags) {
            if (!projectData.featured_tags.includes(featuredTag.name)) return setSaveBtnDisabled(false);
        }

        return setSaveBtnDisabled(true);
    }, [projectData, selectedTags, featuredTags]);

    return (
        <ContentWrapperCard className="relative">
            {!projectData ? null : (
                <>
                    <div className="w-full flex flex-col items-start justify-start gap-1">
                        <h2 className="text-2xl font-semibold">Tags</h2>
                        <p className=" text-foreground-muted">
                            Accurate tagging is important to help people find your mod. Make sure to select all tags that apply.
                        </p>
                    </div>

                    <div className="w-full flex flex-col items-start justify-start">
                        <h2 className="text-lg font-semibold">Categories</h2>
                        <p className=" text-foreground-muted">
                            Select all categories that reflect the themes or function of your project.
                        </p>

                        <div className="w-full grid grid-cols-1 [@media_(min-width:520px)_and_(max-width:639px)]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 mt-2 gap-x-2.5">
                            {GetValidProjectCategories(projectData.type).map((category) => {
                                return (
                                    <Label
                                        key={category.name}
                                        htmlFor={`${category.name}-${category.project_types}-checkbox`}
                                        className="flex gap-2 py-1 items-center justify-start transition-opacity hover:opacity-90 cursor-pointer"
                                    >
                                        <Checkbox
                                            id={`${category.name}-${category.project_types}-checkbox`}
                                            checked={selectedTags.has(category)}
                                            onCheckedChange={(e) => handleTagsSelection(category, !!e)}
                                        />
                                        <span className="text-foreground-muted">
                                            {CapitalizeAndFormatString(category.name)?.replaceAll("-", " ")}
                                        </span>
                                    </Label>
                                );
                            })}
                        </div>
                        {!GetValidProjectCategories(projectData.type).length && (
                            <p className="w-full flex items-start justify-start">Upload a version first in order to select tags.</p>
                        )}
                    </div>

                    <div className="w-full flex flex-col items-start justify-start mt-2">
                        <h2 className="text-lg font-semibold">Featured tags</h2>
                        <p className=" text-foreground-muted">You can feature up to 3 of your most relevant tags.</p>

                        {!selectedTags?.size ? (
                            <p className="text-sm text-foreground-muted mt-2">
                                Select at least one category in order to feature a category.
                            </p>
                        ) : (
                            <div className="w-full grid grid-cols-1 [@media_(min-width:520px)_and_(max-width:639px)]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 mt-2 gap-2.5">
                                {Array.from(selectedTags).map((category) => {
                                    return (
                                        <Label
                                            key={category.name}
                                            htmlFor={`${category.name}-${category.project_types}-featured-tag-checkbox`}
                                            className={cn(
                                                "flex gap-2 items-center justify-start transition-opacity hover:opacity-90 cursor-pointer",
                                                !featuredTags.has(category) &&
                                                Array.from(featuredTags).length >= maxFeaturedProjectTags &&
                                                "cursor-not-allowed opacity-50 hover:opacity-50",
                                            )}
                                        >
                                            <Checkbox
                                                id={`${category.name}-${category.project_types}-featured-tag-checkbox`}
                                                checked={featuredTags.has(category)}
                                                onCheckedChange={(e) => handleFeaturedTagsSelection(category, !!e)}
                                                disabled={
                                                    !featuredTags.has(category) && Array.from(featuredTags).length >= maxFeaturedProjectTags
                                                }
                                            />
                                            <span className="text-foreground-muted">
                                                {CapitalizeAndFormatString(category.name)?.replaceAll("-", " ")}
                                            </span>
                                        </Label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="w-full flex items-center justify-end mt-2">
                        <Button onClick={updateProjectTags} disabled={saveBtnDisabled}>
                            <SaveIcon className="w-4 h-4" />
                            Save changes
                        </Button>
                    </div>
                </>
            )}

            {loading ? <AbsolutePositionedSpinner /> : null}
        </ContentWrapperCard>
    );
};

export default TagsSettingsPage;
