import { TagIcon } from "@/components/tag-icons";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { LabelledCheckbox } from "@/components/ui/checkbox";
import { Form, FormField } from "@/components/ui/form";
import { FormErrorMessage } from "@/components/ui/form-message";
import { LoadingSpinner } from "@/components/ui/spinner";
import { projectContext } from "@/src/contexts/curr-project";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_FEATURED_PROJECT_TAGS } from "@shared/config/forms";
import { CapitalizeAndFormatString, getValidProjectCategories } from "@shared/lib/utils";
import { updateProjectTagsFormSchema } from "@shared/schemas/project/settings/categories";
import { checkFormValidity } from "@shared/schemas/utils";
import { SaveIcon, StarIcon } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

const TagsSettingsPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { projectData, fetchProjectData } = useContext(projectContext);

    const form = useForm<z.infer<typeof updateProjectTagsFormSchema>>({
        resolver: zodResolver(updateProjectTagsFormSchema),
        defaultValues: {
            categories: projectData?.categories || [],
            featuredCategories: projectData?.featuredCategories || [],
        },
    });
    form.watch();

    const updateTags = async (values: z.infer<typeof updateProjectTagsFormSchema>) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await useFetch(`/api/project/${projectData?.slug}/tags`, {
                method: "PATCH",
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                toast.error(data?.message || "Error");
                return;
            }

            await fetchProjectData();
            toast.success(data?.message || "Tags updated");
            return;
        } finally {
            setIsLoading(false);
        }
    };

    if (!projectData) return null;
    const allAvailableCategories = getValidProjectCategories(projectData.type);
    const isSubmitBtnDisabled =
        JSON.stringify(form.getValues().categories.toSorted()) === JSON.stringify(projectData.categories.toSorted()) &&
        JSON.stringify(form.getValues().featuredCategories.toSorted()) === JSON.stringify(projectData.featuredCategories.toSorted());

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                className="w-full"
            >
                <Card className="w-full flex flex-col p-card-surround gap-4">
                    <div className="w-full flex flex-col items-start justify-start gap-1">
                        <CardTitle>Tags</CardTitle>
                        <span className="text-muted-foreground">
                            Accurate tagging is important to help people find your mod. Make sure to select all tags that apply.
                        </span>
                    </div>

                    {allAvailableCategories?.length ? (
                        <>
                            <div className="w-full flex flex-col items-start justify-start">
                                <span className="text-lg font-bold">Categories</span>
                                <span className="text-muted-foreground">
                                    Select all categories that reflect the themes or function of your{" "}
                                    {CapitalizeAndFormatString(projectData.type[0])?.toLowerCase()}.
                                </span>
                                <FormField
                                    control={form.control}
                                    name="categories"
                                    render={({ field }) => (
                                        <div className="autofit-grid w-full grid mt-2">
                                            {allAvailableCategories.map((category) => {
                                                return (
                                                    <LabelledCheckbox
                                                        key={category.name}
                                                        checkBoxId={`tag-${category.name}`}
                                                        checked={field.value.includes(category.name)}
                                                        onCheckedChange={(e) => {
                                                            if (e === true) {
                                                                field.onChange([...field.value, category.name]);
                                                            } else {
                                                                field.onChange(field.value.filter((tag) => tag !== category.name));

                                                                // Also remove the category from featured tags if it was featured
                                                                const selectedFeaturedTagsList = form.getValues().featuredCategories;
                                                                if (selectedFeaturedTagsList.includes(category.name)) {
                                                                    form.setValue(
                                                                        "featuredCategories",
                                                                        selectedFeaturedTagsList.filter((tag) => tag !== category.name),
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <span className="flex items-center justify-start gap-1">
                                                            <TagIcon name={category.name} />
                                                            {CapitalizeAndFormatString(category.name)}
                                                        </span>
                                                    </LabelledCheckbox>
                                                );
                                            })}
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="w-full flex flex-col items-start justify-start">
                                <span className="flex items-center justify-center gap-2 text-lg font-bold">
                                    <StarIcon className="w-btn-icon h-btn-icon text-muted-foreground" />
                                    Featured Categories
                                </span>
                                <span className="text-muted-foreground">
                                    You can feature up to {MAX_FEATURED_PROJECT_TAGS} of your most relevant tags.
                                </span>
                                <FormField
                                    control={form.control}
                                    name="featuredCategories"
                                    render={({ field }) => (
                                        <div className="autofit-grid w-full grid mt-2">
                                            {form.getValues().categories.map((tag) => {
                                                return (
                                                    <LabelledCheckbox
                                                        key={tag}
                                                        checkBoxId={`featured-tag-${tag}`}
                                                        className="w-fit"
                                                        checked={field.value.includes(tag)}
                                                        disabled={
                                                            field.value.length >= MAX_FEATURED_PROJECT_TAGS && !field.value.includes(tag)
                                                        }
                                                        onCheckedChange={(e) => {
                                                            if (e === true) {
                                                                if (field.value.length >= MAX_FEATURED_PROJECT_TAGS) return;
                                                                field.onChange([...field.value, tag]);
                                                            } else {
                                                                field.onChange(field.value.filter((selectedTag) => tag !== selectedTag));
                                                            }
                                                        }}
                                                    >
                                                        <span className="flex items-center justify-start gap-1">
                                                            <TagIcon name={tag} />
                                                            {CapitalizeAndFormatString(tag)}
                                                        </span>
                                                    </LabelledCheckbox>
                                                );
                                            })}
                                        </div>
                                    )}
                                />

                                {!form.getValues().categories?.length ? (
                                    <span className="text-muted-foreground">
                                        Select at least one category in order to feature a category.
                                    </span>
                                ) : null}
                            </div>

                            <div className="w-full flex items-center justify-end">
                                <Button
                                    type="submit"
                                    disabled={isLoading || isSubmitBtnDisabled}
                                    onClick={async () => {
                                        await checkFormValidity(async () => {
                                            const formValues = await updateProjectTagsFormSchema.parseAsync(form.getValues());
                                            await updateTags(formValues);
                                        });
                                    }}
                                >
                                    {isLoading ? <LoadingSpinner size="xs" /> : <SaveIcon className="w-btn-icon h-btn-icon" />}
                                    Save Changes
                                </Button>
                            </div>
                        </>
                    ) : (
                        <FormErrorMessage text="Please upload a version first in order to select tags!" className="w-fit" />
                    )}
                </Card>
            </form>
        </Form>
    );
};

export default TagsSettingsPage;
