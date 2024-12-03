import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { getProjectPagePathname, getProjectVersionPagePathname } from "@root/utils";
import clientFetch from "@root/utils/client-fetch";
import { disableInteractions, enableInteractions } from "@root/utils/dom";
import { getFileType } from "@shared/lib/utils/convertors";
import { allowedPrimaryFileTypes, isVersionPrimaryFileValid } from "@shared/lib/validation";
import { newVersionFormSchema } from "@shared/schemas/project/version";
import { handleFormError } from "@shared/schemas/utils";
import { VersionReleaseChannel } from "@shared/types";
import type { ProjectDetailsData } from "@shared/types/api";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import MarkdownEditor from "~/components/layout/md-editor/md-editor";
import { ContentCardTemplate } from "~/components/layout/panel";
import RefreshPage from "~/components/refresh-page";
import { Form, FormField, FormItem } from "~/components/ui/form";
import {
    AddDependencies,
    FeaturedBtn,
    MetadataInputCard,
    SelectAdditionalProjectFiles,
    SelectPrimaryFileInput,
    UploadVersionPageTopCard,
    VersionTitleInput,
} from "./_components";

interface Props {
    projectData: ProjectDetailsData;
}

export default function UploadVersionPage({ projectData }: Props) {
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

    const projectPageUrl = getProjectPagePathname(projectData.type[0], projectData.slug);
    const versionsPageUrl = `${projectPageUrl}/versions`;

    const handleSubmit = async (data: z.infer<typeof newVersionFormSchema>) => {
        if (!(data.primaryFile instanceof File)) {
            toast.error("Primary file is required");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);
        disableInteractions();

        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("changelog", data.changelog || "");
            formData.append("featured", `${data.featured === true}`);
            formData.append("releaseChannel", data.releaseChannel);
            formData.append("versionNumber", data.versionNumber);
            formData.append("loaders", JSON.stringify(data.loaders || []));
            formData.append("gameVersions", JSON.stringify(data.gameVersions));
            formData.append("dependencies", JSON.stringify(data.dependencies || []));
            formData.append("primaryFile", data.primaryFile instanceof File ? data.primaryFile : "");
            for (const additionalFile of data.additionalFiles || []) {
                formData.append("additionalFiles", additionalFile);
            }

            const response = await clientFetch(`/api/project/${projectData.slug}/version`, {
                method: "POST",
                body: formData,
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                toast.error(result?.message);
                return;
            }

            RefreshPage(navigate, getProjectVersionPagePathname(projectData.type[0], projectData.slug, result?.slug));
            return;
        } finally {
            setIsLoading(false);
            enableInteractions();
        }
    };

    return (
        <>
            <Helmet>
                <title>Create version - {projectData?.name || ""}</title>
                <meta name="description" content="Upload a new version" />
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
                        submitBtnLabel="Create"
                        submitBtnIcon={<PlusIcon className="w-btn-icon-md h-btn-icon-md" />}
                        versionPageUrl={versionsPageUrl}
                        versionTitle={form.getValues().title}
                        backUrl={versionsPageUrl}
                        onSubmitBtnClick={async () => {
                            await handleFormError(async () => {
                                const formValues = await newVersionFormSchema.parseAsync(form.getValues());
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
                        <div className="overflow-auto max-w-full flex flex-col gap-panel-cards">
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
                                                dependencies={field.value}
                                                setDependencies={field.onChange}
                                                currProjectId={projectData.id}
                                                dependenciesData={{ versions: [], projects: [] }}
                                            />
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
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        const fileType = await getFileType(file);
                                                        if (!isVersionPrimaryFileValid(projectData.type, fileType)) {
                                                            const allowedFileTypes = allowedPrimaryFileTypes(projectData.type);
                                                            return toast.error(
                                                                `Invalid primary file "${file.name}" with type "${fileType}". Allowed types: .${Array.from(allowedFileTypes).join(" | .")}  `,
                                                            );
                                                        }

                                                        // Check if the file name is duplicated
                                                        const additionalFiles = form.getValues().additionalFiles || [];
                                                        if (additionalFiles.find((f) => f.name === file.name)) {
                                                            return toast.error(
                                                                `File "${file.name}" already exists in the additional files`,
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
                        <MetadataInputCard projectType={projectData.type} formControl={form.control} />
                    </div>
                </form>
            </Form>
        </>
    );
}
