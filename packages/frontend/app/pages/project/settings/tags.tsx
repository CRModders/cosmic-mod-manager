import { zodResolver } from "@hookform/resolvers/zod";
import clientFetch from "@root/utils/client-fetch";
import { MAX_FEATURED_PROJECT_TAGS } from "@shared/config/forms";
import { CapitalizeAndFormatString, getValidProjectCategories } from "@shared/lib/utils";
import { updateProjectTagsFormSchema } from "@shared/schemas/project/settings/categories";
import { handleFormError } from "@shared/schemas/utils";
import { SaveIcon, StarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";
import RefreshPage from "~/components/refresh-page";
import { TagIcon } from "~/components/tag-icons";
import { Button } from "~/components/ui/button";
import { Card, CardTitle } from "~/components/ui/card";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import { Form, FormField } from "~/components/ui/form";
import { FormErrorMessage } from "~/components/ui/form-message";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import "./../styles.css";

export default function TagsSettingsPage() {
    const { t } = useTranslation();
    const projectData = useProjectData().projectData;

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<z.infer<typeof updateProjectTagsFormSchema>>({
        resolver: zodResolver(updateProjectTagsFormSchema),
        defaultValues: {
            categories: projectData?.categories || [],
            featuredCategories: projectData?.featuredCategories || [],
        },
    });
    form.watch();

    async function updateTags(values: z.infer<typeof updateProjectTagsFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/project/${projectData?.slug}/tags`, {
                method: "PATCH",
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                toast.error(data?.message || t.common.error);
                return;
            }

            RefreshPage(navigate, location);
            toast.success(data?.message || t.common.success);
            return;
        } finally {
            setIsLoading(false);
        }
    }

    if (!projectData) return null;
    const allAvailableCategories = getValidProjectCategories(projectData.type);
    const isSubmitBtnDisabled =
        JSON.stringify(form.getValues().categories.sort()) === JSON.stringify(projectData.categories.sort()) &&
        JSON.stringify(form.getValues().featuredCategories.sort()) === JSON.stringify(projectData.featuredCategories.sort());

    const projectType = t.navbar[projectData.type[0]];

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
                        <CardTitle>{t.projectSettings.tags}</CardTitle>
                        <span className="text-muted-foreground">{t.projectSettings.tagsDesc}</span>
                    </div>

                    {allAvailableCategories?.length ? (
                        <>
                            <div className="w-full flex flex-col items-start justify-start">
                                <span className="text-lg font-bold">{t.search.categories}</span>
                                <span className="text-muted-foreground">{t.projectSettings.tagsDesc2(projectType.toLowerCase())}</span>
                                <FormField
                                    control={form.control}
                                    name="categories"
                                    render={({ field }) => (
                                        <div className="autofit-grid w-full grid mt-2">
                                            {allAvailableCategories.map((category) => {
                                                // @ts-ignore
                                                const categoryName = t.search.tags[category.name] || category.name;

                                                return (
                                                    <LabelledCheckbox
                                                        title={`${CapitalizeAndFormatString(categoryName)} (${CapitalizeAndFormatString(category.header)})`}
                                                        key={categoryName}
                                                        name={categoryName}
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
                                                            {CapitalizeAndFormatString(categoryName)}
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
                                    {t.projectSettings.featuredCategories}
                                </span>
                                <span className="text-muted-foreground">
                                    {t.projectSettings.featuredCategoriesDesc(MAX_FEATURED_PROJECT_TAGS)}
                                </span>
                                <FormField
                                    control={form.control}
                                    name="featuredCategories"
                                    render={({ field }) => (
                                        <div className="autofit-grid w-full grid mt-2">
                                            {form.getValues().categories.map((tag) => {
                                                // @ts-ignore
                                                const tagName = t.search.tags[tag] || tag;

                                                return (
                                                    <LabelledCheckbox
                                                        key={tagName}
                                                        name={tagName}
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
                                                            {CapitalizeAndFormatString(tagName)}
                                                        </span>
                                                    </LabelledCheckbox>
                                                );
                                            })}
                                        </div>
                                    )}
                                />

                                {!form.getValues().categories?.length ? (
                                    <span className="text-muted-foreground">{t.projectSettings.selectAtLeastOneCategory}</span>
                                ) : null}
                            </div>

                            <div className="w-full flex items-center justify-end">
                                <Button
                                    type="submit"
                                    disabled={isLoading || isSubmitBtnDisabled}
                                    onClick={async () => {
                                        await handleFormError(async () => {
                                            const formValues = await updateProjectTagsFormSchema.parseAsync(form.getValues());
                                            await updateTags(formValues);
                                        });
                                    }}
                                >
                                    {isLoading ? <LoadingSpinner size="xs" /> : <SaveIcon className="w-btn-icon h-btn-icon" />}
                                    {t.form.saveChanges}
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
}
