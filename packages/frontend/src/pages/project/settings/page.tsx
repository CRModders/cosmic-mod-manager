import { fallbackProjectIcon } from "@/components/icons";
import { ContentCardTemplate } from "@/components/layout/panel";
import { ImgWrapper } from "@/components/ui/avatar";
import { Button, CancelButton, buttonVariants } from "@/components/ui/button";
import { ChipButton } from "@/components/ui/chip";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, imageUrl } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import useFetch from "@/src/hooks/fetch";
import { invalidateUserProjectsQuery } from "@/src/pages/dashboard/projects/_loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { projectTypes } from "@shared/config/project";
import { Capitalize, CapitalizeAndFormatString, createURLSafeSlug } from "@shared/lib/utils";
import { getProjectTypesFromNames, getProjectVisibilityFromString } from "@shared/lib/utils/convertors";
import { generalProjectSettingsFormSchema } from "@shared/schemas/project/settings/general";
import { handleFormError } from "@shared/schemas/utils";
import { ProjectPublishingStatus, ProjectSupport, type ProjectType, ProjectVisibility } from "@shared/types";
import type { ProjectDetailsData } from "@shared/types/api";
import { CheckIcon, ChevronDownIcon, SaveIcon, Trash2Icon, TriangleAlertIcon, UploadIcon, XIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { z } from "zod";

const getInitialValues = (projectData?: ProjectDetailsData | null) => {
    return {
        icon: projectData?.icon || "",
        name: projectData?.name || "",
        slug: projectData?.slug || "",
        visibility: getProjectVisibilityFromString(projectData?.visibility || ""),
        type: (projectData?.type || []) as ProjectType[],
        clientSide: projectData?.clientSide,
        serverSide: projectData?.serverSide,
        summary: projectData?.summary,
    };
};
const GeneralSettingsPage = () => {
    const { projectData, fetchProjectData } = useContext(projectContext);
    const [isLoading, setIsLoading] = useState(false);

    let initialValues = getInitialValues(projectData);

    const form = useForm<z.infer<typeof generalProjectSettingsFormSchema>>({
        resolver: zodResolver(generalProjectSettingsFormSchema),
        defaultValues: initialValues,
    });
    form.watch();

    const resetForm = (icon: string) => {
        if (!projectData) return;

        form.setValue("icon", icon);
        form.setValue("name", projectData.name);
        form.setValue("slug", projectData.slug);
        form.setValue("visibility", projectData.visibility);
        form.setValue("type", getProjectTypesFromNames(projectData.type));
        form.setValue("clientSide", projectData.clientSide);
        form.setValue("serverSide", projectData.serverSide);
        form.setValue("summary", projectData.summary);
    };

    const saveSettings = async (values: z.infer<typeof generalProjectSettingsFormSchema>) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("icon", values.icon || "");
            formData.append("name", values.name);
            formData.append("slug", values.slug);
            formData.append("visibility", values.visibility);
            formData.append("type", JSON.stringify(values.type));
            formData.append("clientSide", values.clientSide);
            formData.append("serverSide", values.serverSide);
            formData.append("summary", values.summary);

            const response = await useFetch(`/api/project/${projectData?.slug}`, {
                method: "PATCH",
                body: formData,
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            await fetchProjectData(result?.slug || projectData?.slug);
            toast.success(result?.message || "Success");
        } finally {
            setIsLoading(false);
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        initialValues = getInitialValues(projectData);
        resetForm(projectData?.icon || "");
    }, [projectData]);

    if (!projectData) return;

    return (
        <div className="w-full flex flex-col gap-panel-cards items-start justify-start">
            <ContentCardTemplate title="Project information">
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                        className="w-full flex flex-col items-start justify-start gap-form-elements"
                    >
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">
                                        Icon
                                        <FormMessage />
                                    </FormLabel>
                                    <div className="flex flex-wrap items-center justify-start gap-4">
                                        <input
                                            hidden
                                            className="hidden"
                                            id="project-icon-input"
                                            accept={".jpg, .jpeg, .png, .webp, .gif"}
                                            type="file"
                                            value={""}
                                            name={field.name}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                try {
                                                    await generalProjectSettingsFormSchema.parseAsync({
                                                        ...form.getValues(),
                                                        icon: file,
                                                    });
                                                    field.onChange(file);
                                                } catch (error) {
                                                    // @ts-ignore
                                                    toast.error(error?.issues?.[0]?.message || "Error with the file");
                                                    console.error(error);
                                                }
                                            }}
                                        />

                                        <ImgWrapper
                                            alt={projectData.name}
                                            src={(() => {
                                                const image = form.getValues()?.icon;
                                                if (image instanceof File) {
                                                    return URL.createObjectURL(image);
                                                }
                                                if (!image) {
                                                    return "";
                                                }
                                                return imageUrl(projectData.icon || "");
                                            })()}
                                            className="rounded"
                                            fallback={fallbackProjectIcon}
                                        />

                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <label
                                                htmlFor="project-icon-input"
                                                className={cn(buttonVariants({ variant: "secondary", size: "default" }), "cursor-pointer")}
                                            >
                                                <UploadIcon className="w-btn-icon h-btn-icon" />
                                                Upload icon
                                            </label>
                                            {form.getValues().icon ? (
                                                <Button
                                                    variant={"secondary"}
                                                    type="button"
                                                    onClick={() => {
                                                        form.setValue("icon", undefined);
                                                    }}
                                                >
                                                    <Trash2Icon className="w-btn-icon h-btn-icon" />
                                                    Remove icon
                                                </Button>
                                            ) : null}
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground font-bold" htmlFor="project-name-input">
                                        Name
                                        <FormMessage />
                                    </FormLabel>
                                    <Input {...field} className="md:w-[32ch]" id="project-name-input" autoComplete="off" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground font-bold" htmlFor="project-slug-input">
                                        URL
                                        <FormMessage />
                                    </FormLabel>
                                    <div className="w-full flex flex-col items-start justify-center gap-0.5">
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(createURLSafeSlug(e.target.value).value);
                                            }}
                                            className="md:w-[32ch]"
                                            id="project-slug-input"
                                            autoComplete="off"
                                        />
                                        <span className="text-sm lg:text-base text-muted-foreground px-1">
                                            {window.location.origin}/{form.getValues().type?.[0] || "project"}/
                                            <em className="not-italic text-foreground font-[500]">{form.getValues().slug}</em>
                                        </span>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="summary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground font-bold" htmlFor="project-summary-input">
                                        Summary
                                        <FormMessage />
                                    </FormLabel>
                                    <Textarea
                                        {...field}
                                        className="resize-none md:w-[48ch] min-h-32"
                                        spellCheck="false"
                                        id="project-summary-input"
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="w-full flex flex-wrap flex-row items-end justify-between">
                                    <div className="flex flex-col items-start justify-center gap-y-1.5">
                                        <FormLabel className="text-foreground font-bold">
                                            Project type
                                            <FormMessage />
                                        </FormLabel>
                                        <span className="text-muted-foreground">Select the appropriate type for your project</span>
                                    </div>

                                    <div className="flex gap-1 flex-col min-w-[15rem] max-w-full">
                                        {field.value?.length > 0 && (
                                            <div className="w-full items-center justify-start flex gap-x-1.5 gap-y-1 flex-wrap">
                                                {field.value?.map((loader: string) => {
                                                    return (
                                                        <ChipButton
                                                            variant="secondary"
                                                            key={loader}
                                                            onClick={() => {
                                                                field.onChange(field.value?.filter((l: string) => l !== loader));
                                                            }}
                                                        >
                                                            <XIcon className="w-btn-icon-sm h-btn-icon-sm" />
                                                            {CapitalizeAndFormatString(loader)}
                                                        </ChipButton>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <MultiSelect
                                            selectedOptions={field.value || []}
                                            options={projectTypes.map((type) => ({
                                                label: CapitalizeAndFormatString(type) || "",
                                                value: type,
                                            }))}
                                            onChange={(values) => {
                                                field.onChange(getProjectTypesFromNames(values));
                                            }}
                                            classNames={{
                                                popupContent: "min-w-[15rem]",
                                                listItem: "font-medium",
                                            }}
                                            searchBar={false}
                                        >
                                            <Button variant="secondary" className="justify-between text-extra-muted-foreground">
                                                Choose...
                                                <ChevronDownIcon className="w-btn-icon-md h-btn-icon-md" />
                                            </Button>
                                        </MultiSelect>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="clientSide"
                            render={({ field }) => (
                                <FormItem className="w-full flex flex-wrap flex-row items-end justify-between">
                                    <div className="flex flex-col items-start justify-center gap-y-1.5">
                                        <FormLabel className="text-foreground font-bold">
                                            Client-side
                                            <FormMessage />
                                        </FormLabel>
                                        <span className="text-muted-foreground">
                                            Select based on if the {projectData.type[0]} has functionality on the client side.
                                        </span>
                                    </div>

                                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-[15rem] max-w-full" aria-label="Client-side">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={ProjectSupport.REQUIRED}>{Capitalize(ProjectSupport.REQUIRED)}</SelectItem>
                                            <SelectItem value={ProjectSupport.OPTIONAL}>{Capitalize(ProjectSupport.OPTIONAL)}</SelectItem>
                                            <SelectItem value={ProjectSupport.UNSUPPORTED}>
                                                {Capitalize(ProjectSupport.UNSUPPORTED)}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="serverSide"
                            render={({ field }) => (
                                <FormItem className="w-full flex flex-wrap flex-row items-end justify-between">
                                    <div className="flex flex-col items-start justify-center gap-y-1.5">
                                        <FormLabel className="text-foreground font-bold">
                                            Server-side
                                            <FormMessage />
                                        </FormLabel>
                                        <span className="text-muted-foreground">
                                            Select based on if the {projectData.type[0]} has functionality on the logical server.
                                        </span>
                                    </div>

                                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-[15rem] max-w-full" aria-label="Server-side">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={ProjectSupport.REQUIRED}>{Capitalize(ProjectSupport.REQUIRED)}</SelectItem>
                                            <SelectItem value={ProjectSupport.OPTIONAL}>{Capitalize(ProjectSupport.OPTIONAL)}</SelectItem>
                                            <SelectItem value={ProjectSupport.UNSUPPORTED}>
                                                {Capitalize(ProjectSupport.UNSUPPORTED)}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="visibility"
                            render={({ field }) => (
                                <FormItem className="w-full flex flex-wrap flex-row items-center justify-between gap-x-6">
                                    <div className="flex flex-col items-start justify-center gap-y-1.5">
                                        <FormLabel className="text-foreground font-bold">
                                            Visibility
                                            <FormMessage />
                                        </FormLabel>
                                        <div className="max-w-[68ch] flex flex-col items-start justify-start text-muted-foreground gap-1.5">
                                            <p className="leading-tight">
                                                Listed and archived projects are visible in search. Unlisted projects are published, but not
                                                visible in search or on user profiles. Private projects are only accessible by members of
                                                the project.
                                            </p>

                                            {projectData.status !== ProjectPublishingStatus.PUBLISHED ? (
                                                <span>If approved by the moderators:</span>
                                            ) : null}

                                            <div className="flex flex-col items-start justify-center">
                                                <span className="flex items-center justify-center gap-1.5">
                                                    {field.value === ProjectVisibility.LISTED ||
                                                    field.value === ProjectVisibility.ARCHIVED ? (
                                                        <CheckIcon className="w-btn-icon h-btn-icon text-success-foreground" />
                                                    ) : (
                                                        <XIcon className="w-btn-icon h-btn-icon text-danger-foreground" />
                                                    )}
                                                    Visible in search
                                                </span>
                                                <span className="flex items-center justify-center gap-1.5">
                                                    {field.value === ProjectVisibility.LISTED ||
                                                    field.value === ProjectVisibility.ARCHIVED ? (
                                                        <CheckIcon className="w-btn-icon h-btn-icon text-success-foreground" />
                                                    ) : (
                                                        <XIcon className="w-btn-icon h-btn-icon text-danger-foreground" />
                                                    )}
                                                    Visible on profile
                                                </span>
                                                <span className="flex items-center justify-center gap-1.5">
                                                    {field.value === ProjectVisibility.PRIVATE ? (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span>
                                                                        <TriangleAlertIcon className="w-btn-icon h-btn-icon text-orange-600 dark:text-orange-400" />
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Only members will be able to view the project
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ) : (
                                                        <CheckIcon className="w-btn-icon h-btn-icon text-success-foreground" />
                                                    )}
                                                    Visible via URL
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-[15rem] max-w-full" aria-label="Visibility">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={ProjectVisibility.LISTED}>{Capitalize(ProjectVisibility.LISTED)}</SelectItem>
                                            <SelectItem value={ProjectVisibility.ARCHIVED}>
                                                {Capitalize(ProjectVisibility.ARCHIVED)}
                                            </SelectItem>
                                            <SelectItem value={ProjectVisibility.UNLISTED}>
                                                {Capitalize(ProjectVisibility.UNLISTED)}
                                            </SelectItem>
                                            <SelectItem value={ProjectVisibility.PRIVATE}>
                                                {Capitalize(ProjectVisibility.PRIVATE)}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="w-full flex items-center justify-end mt-2">
                            <Button
                                type="submit"
                                disabled={JSON.stringify(initialValues) === JSON.stringify(form.getValues()) || isLoading}
                                onClick={async () => {
                                    await handleFormError(async () => {
                                        const parsedValues = await generalProjectSettingsFormSchema.parseAsync(form.getValues());
                                        saveSettings(parsedValues);
                                    });
                                }}
                            >
                                {isLoading ? <LoadingSpinner size="xs" /> : <SaveIcon className="w-btn-icon h-btn-icon" />}
                                Save changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </ContentCardTemplate>

            <DeleteProjectDialog name={projectData.name} slug={projectData.slug} />
        </div>
    );
};

export const Component = GeneralSettingsPage;

const DeleteProjectDialog = ({ name, slug }: { name: string; slug: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [submittable, setSubmittable] = useState(false);
    const navigate = useNavigate();

    const deleteProject = async () => {
        if (!submittable || isLoading) return;
        setIsLoading(true);
        try {
            const res = await useFetch(`/api/project/${slug}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || "Error");
            }

            toast.success(data?.message || "Success");
            invalidateUserProjectsQuery();
            navigate("/dashboard/projects");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ContentCardTemplate title="Delete project" className="w-full flex flex-col gap-4">
            <p className="text-muted-foreground">
                Removes your project from CRMM's servers and search. Clicking on this will delete your project, so be extra careful!
            </p>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive">
                        <Trash2Icon className="w-btn-icon h-btn-icon" />
                        Delete project
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
                        <VisuallyHidden>
                            <DialogDescription>Delete your project</DialogDescription>
                        </VisuallyHidden>
                    </DialogHeader>
                    <DialogBody className="text-muted-foreground flex flex-col gap-4">
                        <p className="leading-snug">
                            If you proceed, all versions and any attached data will be removed from our servers. This may break other
                            projects, so be careful.
                        </p>

                        <div className="w-full flex flex-col gap-1">
                            <span className="font-bold flex items-center justify-start gap-1.5">
                                To verify, type<em className="font-normal">{name}</em>below:
                            </span>

                            <Input
                                placeholder="Type here..."
                                className="w-full sm:w-[32ch]"
                                onChange={(e) => {
                                    if (e.target.value === name) {
                                        setSubmittable(true);
                                    } else if (submittable === true) {
                                        setSubmittable(false);
                                    }
                                }}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <CancelButton />
                            </DialogClose>
                            <Button disabled={!submittable || isLoading} variant="destructive" onClick={deleteProject}>
                                {isLoading ? <LoadingSpinner size="xs" /> : <Trash2Icon className="w-btn-icon h-btn-icon" />}
                                Delete project
                            </Button>
                        </DialogFooter>
                    </DialogBody>
                </DialogContent>
            </Dialog>
        </ContentCardTemplate>
    );
};
