import MarkdownEditor from "@/components/layout/md-editor/md-editor";
import { ContentCardTemplate } from "@/components/layout/panel";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { getProjectPagePathname, getProjectVersionPagePathname } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { SITE_NAME_SHORT } from "@shared/config/index";
import { parseFileSize } from "@shared/lib/utils";
import { updateVersionFormSchema } from "@shared/schemas/project/version";
import { checkFormValidity } from "@shared/schemas/utils";
import { VersionReleaseChannel } from "@shared/types";
import { FileIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import type { z } from "zod";
import {
    AddDependencies,
    FeaturedBtn,
    MetadataInputCard,
    SelectAdditionalProjectFiles,
    UploadVersionPageTopCard,
    VersionTitleInput,
} from "./_components";

const EditVersionPage = () => {
    const { projectData, allProjectVersions, projectDependencies, invalidateAllQueries } = useContext(projectContext);
    const { slug: projectSlug, versionSlug } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const versionData = allProjectVersions?.filter((version) => {
        if (version.slug === versionSlug || version.id === versionSlug) return version;
    })[0];

    const versionAdditionalFiles = [];
    if (versionData?.files) {
        for (const file of versionData.files) {
            if (file.isPrimary === true) continue;
            versionAdditionalFiles.push({
                id: file.id,
                name: file.name,
                size: file.size,
                type: file.type,
            });
        }
    }

    const form = useForm<z.infer<typeof updateVersionFormSchema>>({
        resolver: zodResolver(updateVersionFormSchema),
        defaultValues: {
            title: versionData?.title || "",
            changelog: versionData?.changelog || "" || "",
            releaseChannel: versionData?.releaseChannel || VersionReleaseChannel.RELEASE,
            featured: versionData?.featured || false,
            versionNumber: versionData?.versionNumber || "",
            loaders: versionData?.loaders || [],
            gameVersions: versionData?.gameVersions || [],
            additionalFiles: versionAdditionalFiles,
            dependencies:
                versionData?.dependencies.map((dep) => ({
                    projectId: dep.projectId,
                    versionId: dep.versionId || null,
                    dependencyType: dep.dependencyType,
                })) || [],
        },
    });
    form.watch();

    const handleSubmit = async (values: z.infer<typeof updateVersionFormSchema>) => {
        if (isLoading || !projectData) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("changelog", values.changelog || "");
            formData.append("releaseChannel", values.releaseChannel);
            formData.append("featured", values.featured.toString());
            formData.append("versionNumber", values.versionNumber);
            formData.append("loaders", JSON.stringify(values.loaders || []));
            formData.append("gameVersions", JSON.stringify(values.gameVersions));
            formData.append("dependencies", JSON.stringify(values.dependencies));
            for (const file of values.additionalFiles || []) {
                if (file instanceof File) {
                    formData.append("additionalFiles", file);
                } else {
                    formData.append("additionalFiles", JSON.stringify(file));
                }
            }

            const res = await useFetch(`/api/project/${projectSlug}/version/${versionSlug}`, {
                method: "PATCH",
                body: formData,
            });
            const result = await res.json();

            if (!res.ok || !result?.success) {
                return toast.error(result?.message || "Failed to update version");
            }

            await invalidateAllQueries();
            navigate(getProjectVersionPagePathname(projectData.type[0], projectData.slug, result?.data?.slug || versionData?.slug));
        } finally {
            setIsLoading(false);
        }
    };

    if (!projectData || !versionData?.id) return null;
    const versionsPageUrl = getProjectPagePathname(projectData.type[0], projectData.slug, "/versions");
    const currVersionPageUrl = getProjectPagePathname(projectData.type[0], projectData.slug, `/version/${versionData.slug}`);

    return (
        <>
            <Helmet>
                <title>
                    Edit {versionData.versionNumber} - {projectData?.name || ""} | {SITE_NAME_SHORT}
                </title>
                <meta name="description" content={`Edit ${versionData.title} of ${projectData?.name}`} />
            </Helmet>

            <Form {...form}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                    className="w-full flex flex-col gap-panel-cards items-start justify-start"
                >
                    <UploadVersionPageTopCard
                        isLoading={isLoading}
                        submitBtnLabel="Save changes"
                        submitBtnIcon={<SaveIcon className="w-btn-icon-md h-btn-icon-md" />}
                        versionPageUrl={versionsPageUrl}
                        versionTitle={form.getValues().title}
                        backUrl={currVersionPageUrl}
                        onSubmitBtnClick={async () => {
                            await checkFormValidity(async () => {
                                const formValues = await updateVersionFormSchema.parseAsync(form.getValues());
                                await handleSubmit(formValues);
                            });
                        }}
                        featuredBtn={
                            <FormField
                                control={form.control}
                                name="featured"
                                render={({ field }) => (
                                    <FeaturedBtn isLoading={isLoading} featured={field.value} setFeatured={field.onChange} />
                                )}
                            />
                        }
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <VersionTitleInput
                                        name={field.name}
                                        value={field.value}
                                        inputRef={field.ref}
                                        disabled={field.disabled === true}
                                        onChange={field.onChange}
                                    />
                                </FormItem>
                            )}
                        />
                    </UploadVersionPageTopCard>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_min-content] gap-panel-cards items-start justify-start">
                        <div className="overflow-auto flex flex-col gap-panel-cards">
                            <ContentCardTemplate title="Changelog">
                                <FormField
                                    control={form.control}
                                    name="changelog"
                                    render={({ field }) => (
                                        <FormItem>
                                            <MarkdownEditor editorValue={field.value || ""} setEditorValue={field.onChange} />
                                        </FormItem>
                                    )}
                                />
                            </ContentCardTemplate>

                            <ContentCardTemplate title="Dependencies">
                                <FormField
                                    control={form.control}
                                    name="dependencies"
                                    render={({ field }) => (
                                        <FormItem>
                                            <AddDependencies
                                                dependencies={field.value || []}
                                                setDependencies={field.onChange}
                                                currProjectId={projectData.id}
                                                dependenciesData={projectDependencies}
                                            />
                                        </FormItem>
                                    )}
                                />
                            </ContentCardTemplate>

                            <ContentCardTemplate title="Files" className="gap-form-elements">
                                {/* PRIMARY FILE */}
                                <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between bg-shallow-background rounded px-4 py-2 gap-x-4 gap-y-2">
                                    <div className="flex items-center justify-start gap-1.5">
                                        <FileIcon className="flex-shrink-0 w-btn-icon h-btn-icon text-muted-foreground" />

                                        <div className="flex items-center flex-wrap justify-start gap-x-2">
                                            <span>
                                                <strong className="font-semibold">{versionData?.primaryFile?.name}</strong>{" "}
                                                <span className="whitespace-nowrap ml-0.5">
                                                    ({parseFileSize(versionData?.primaryFile?.size || 0)})
                                                </span>{" "}
                                                <span className="text-muted-foreground italic ml-1">Primary</span>
                                            </span>
                                        </div>
                                    </div>

                                    <Button disabled type="button" variant="secondary-dark">
                                        <Trash2Icon className="w-btn-icon h-btn-icon" />
                                        Remove
                                    </Button>
                                </div>

                                <SelectAdditionalProjectFiles
                                    fieldName="existingAdditionalFiles"
                                    // @ts-ignore
                                    formControl={form.control}
                                />
                            </ContentCardTemplate>
                        </div>

                        <MetadataInputCard
                            projectType={projectData.type}
                            // @ts-ignore
                            formControl={form.control}
                        />
                    </div>
                </form>
            </Form>
        </>
    );
};

export const Component = EditVersionPage;
