import MarkdownEditor from "@/components/layout/md-editor/md-editor";
import { ContentCardTemplate } from "@/components/layout/panel";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { getProjectPagePathname, getProjectVersionPagePathname } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { SITE_NAME_SHORT } from "@shared/config";
import { getFileType } from "@shared/lib/utils/convertors";
import { isVersionPrimaryFileValid } from "@shared/lib/validation";
import { newVersionFormSchema } from "@shared/schemas/project";
import { VersionReleaseChannel } from "@shared/types";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { z } from "zod";
import { fullWidthLayoutStyles } from "../../layout";
import {
    AddDependencies,
    FeaturedBtn,
    MetadataInputCard,
    SelectAdditionalProjectFiles,
    SelectPrimaryFileInput,
    UploadVersionPageTopCard,
    VersionTitleInput,
} from "./_components";

const UploadVersionPage = () => {
    const { projectData, fetchAllProjectVersions, fetchFeaturedProjectVersions } = useContext(projectContext);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof newVersionFormSchema>>({
        resolver: zodResolver(newVersionFormSchema),
        defaultValues: {
            title: "",
            changelog: "",
            releaseChannel: VersionReleaseChannel.RELEASE,
            versionNumber: "",
            featured: false,
        },
    });
    form.watch();

    if (!projectData) return null;
    const versionsPageUrl = `${getProjectPagePathname(projectData.type[0], projectData.slug)}/versions`;

    const handleSubmit = async (data: z.infer<typeof newVersionFormSchema>) => {
        if (!(data.primaryFile instanceof File)) {
            toast.error("Primary file is required");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("changelog", data.changelog || "");
            formData.append("featured", `${data.featured === true}`);
            formData.append("releaseChannel", data.releaseChannel);
            formData.append("versionNumber", data.versionNumber);
            formData.append("loaders", JSON.stringify(data.loaders));
            formData.append("gameVersions", JSON.stringify(data.gameVersions));
            formData.append("dependencies", JSON.stringify(data.dependencies || []));
            formData.append("primaryFile", data.primaryFile instanceof File ? data.primaryFile : "");
            for (const additionalFile of data.additionalFiles || []) {
                formData.append("additionalFiles", additionalFile instanceof File ? additionalFile : JSON.stringify(additionalFile));
            }

            const response = await useFetch(`/api/project/${projectData.slug}/version/new`, {
                method: "POST",
                body: formData,
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                toast.error(result?.message);
                return;
            }

            if (data.featured !== true) {
                await fetchAllProjectVersions();
            } else {
                await Promise.all([fetchAllProjectVersions(), fetchFeaturedProjectVersions()]);
            }
            navigate(getProjectVersionPagePathname(projectData.type[0], projectData.slug, result?.slug));
            return;
        } catch (error) {
            setIsLoading(false);
        }
    };

    const validateThenSubmit = async () => {
        try {
            const formValues = newVersionFormSchema.parse(form.getValues());
            await handleSubmit(formValues);
        } catch (error) {
            // @ts-ignore
            const name = error?.issues?.[0]?.path?.[0];
            // @ts-ignore
            const errMsg = error?.issues?.[0]?.message;
            const message =
                name && errMsg ? (
                    <div className="w-full flex flex-col items-start justify-start text-danger-foreground">
                        <span>
                            Error in <em className="not-italic font-medium">{name}</em>
                        </span>
                        <span className="text-sm text-muted-foreground">{errMsg}</span>
                    </div>
                ) : (
                    `Form error: ${error}`
                );

            toast.error(name ? message : "Error", { description: errMsg });
            return;
        }
    };

    return (
        <>
            <Helmet>
                <title>
                    Create version - {projectData?.name || ""} | {SITE_NAME_SHORT}
                </title>
                <meta name="description" content="Upload a new version" />
            </Helmet>

            <Form {...form}>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await validateThenSubmit();
                    }}
                    className="w-full flex flex-col gap-panel-cards items-start justify-start"
                    style={fullWidthLayoutStyles}
                >
                    <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_min-content] gap-panel-cards items-start justify-start">
                        <div className="w-full flex flex-col gap-panel-cards">
                            <UploadVersionPageTopCard
                                isLoading={isLoading}
                                versionPageUrl={versionsPageUrl}
                                versionTitle={form.getValues().title}
                                backUrl={versionsPageUrl}
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
                                            <AddDependencies />
                                        </FormItem>
                                    )}
                                />
                            </ContentCardTemplate>

                            <ContentCardTemplate title="Files" className="gap-form-elements">
                                <FormField
                                    control={form.control}
                                    name="primaryFile"
                                    render={({ field }) => (
                                        <FormItem>
                                            <SelectPrimaryFileInput inputId="primary-file-input" selectedFile={field.value}>
                                                <input
                                                    id="primary-file-input"
                                                    type="file"
                                                    className="hidden"
                                                    hidden={true}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        if (!isVersionPrimaryFileValid(getFileType(file.type), projectData.type)) {
                                                            return toast.error(
                                                                `Invalid primary file "${file.name}" with type "${file.type}"`,
                                                            );
                                                        }
                                                        field.onChange(file);
                                                    }}
                                                    name={field.name}
                                                />
                                            </SelectPrimaryFileInput>
                                        </FormItem>
                                    )}
                                />

                                {/* @ts-ignore */}
                                <SelectAdditionalProjectFiles formControl={form.control} />
                            </ContentCardTemplate>
                        </div>

                        {/* @ts-ignore */}
                        <MetadataInputCard formControl={form.control} />
                    </div>
                </form>
            </Form>
        </>
    );
};

export default UploadVersionPage;
