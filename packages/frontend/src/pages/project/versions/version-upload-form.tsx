import { CancelButtonIcon } from "@/components/icons";
import MarkdownEditor from "@/components/layout/md-editor/md-editor";
import { ContentCardTemplate } from "@/components/layout/panel";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VariantButtonLink } from "@/components/ui/link";
import { MultiSelectInput } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/spinner";
import { cn, getProjectPagePathname } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import GAME_VERSIONS from "@shared/config/game-versions";
import { loaders } from "@shared/config/project";
import { CapitalizeAndFormatString, parseFileSize } from "@shared/lib/utils";
import { getFileType } from "@shared/lib/utils/convertors";
import { isVersionPrimaryFileValid } from "@shared/lib/validation";
import { newVersionFormSchema } from "@shared/schemas/project";
import { DependencyType, DependsOn, type FileObjectType, VersionReleaseChannel } from "@shared/types";
import type { ProjectDetailsData } from "@shared/types/api";
import { FileIcon, PlusIcon, StarIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface Props {
    projectData: ProjectDetailsData;
    gobackToUrl?: string;
    fileSelectionEnabled?: {
        primaryFile?: boolean;
        additionalFiles?: boolean;
    };
    handleSubmit: (data: z.infer<typeof newVersionFormSchema>) => Promise<void>;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
}

const UploadNewVersionForm = ({
    projectData,
    gobackToUrl,
    fileSelectionEnabled = { primaryFile: true, additionalFiles: true },
    handleSubmit,
    isLoading,
}: Props) => {
    if (!projectData) return null;
    const versionsPageUrl = `${getProjectPagePathname(projectData.type[0], projectData.slug)}/versions`;

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

    return (
        <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="w-full">
                <div className="w-full flex flex-col gap-panel-cards items-start justify-start">
                    <Card className="w-full p-card-surround flex flex-col items-start justify-start gap-panel-cards">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={versionsPageUrl}>Versions</BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{form.getValues().title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <Input
                                        placeholder="Enter the version title..."
                                        className="!h-12 !py-1 !px-4 text-xl font-semibold !text-muted-foreground"
                                        {...field}
                                    />
                                </FormItem>
                            )}
                        />

                        <div className="w-full flex gap-x-panel-cards gap-y-2 items-center justify-start">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                onClick={async () => {
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

                                        toast.error(name ? message : "", { description: errMsg });
                                        return;
                                    }
                                }}
                            >
                                {isLoading ? <LoadingSpinner size="xs" /> : <PlusIcon className="w-btn-icon-md h-btn-icon-md" />}
                                Create
                            </Button>

                            <FormField
                                control={form.control}
                                name="featured"
                                render={({ field }) => (
                                    <Button variant="secondary" disabled={isLoading} type="button" onClick={() => field.onChange(!field.value)}>
                                        <StarIcon className={cn("w-btn-icon h-btn-icon", field.value === true && "fill-current")} />
                                        {field.value === true ? "Unfeature version" : "Feature version"}
                                    </Button>
                                )}
                            />

                            <VariantButtonLink variant="secondary" url={gobackToUrl || versionsPageUrl}>
                                <CancelButtonIcon className="w-btn-icon h-btn-icon" />
                                Cancel
                            </VariantButtonLink>
                        </div>
                    </Card>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_min-content] gap-panel-cards items-start justify-start">
                        <div className="w-full flex flex-col gap-panel-cards">
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
                                            {JSON.stringify(field.value)}
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

                                <FormField
                                    control={form.control}
                                    name="additionalFiles"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex items-start justify-center">
                                            <div className="w-full flex flex-col">
                                                <span className="font-semibold">Upload additional files</span>
                                                <span className="text-muted-foreground">Used for files such as sources or Javadocs.</span>

                                                <SelectAdditionalFiles
                                                    inputId="additional-files-input"
                                                    selectedFiles={field.value}
                                                    onChange={field.onChange}
                                                >
                                                    <input
                                                        type="file"
                                                        hidden
                                                        name={field.name}
                                                        multiple
                                                        id="additional-files-input"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            e.preventDefault();
                                                            const newFiles: File[] = [];
                                                            mainLoop: for (let i = 0; i < (e.target.files?.length || 0); i++) {
                                                                const file = e.target.files?.[i];
                                                                if (!file?.name) continue;
                                                                if (!getFileType(file.type)) {
                                                                    toast.error(`Invalid file "${file.name}" with type "${file.type}"`);
                                                                    continue;
                                                                }

                                                                for (const existingFile of field.value || []) {
                                                                    if (existingFile.name.toLowerCase() === file.name.toLowerCase()) {
                                                                        toast.error(`Cannot add duplicate file. Adding "${file.name}"`);
                                                                        continue mainLoop;
                                                                    }
                                                                }

                                                                newFiles.push(file);
                                                            }
                                                            field.onChange([...(field.value || []), ...newFiles]);
                                                        }}
                                                    />
                                                </SelectAdditionalFiles>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </ContentCardTemplate>
                        </div>

                        <ContentCardTemplate className="w-full min-w-[19rem] px-5 flex flex-col gap-form-elements" title="Metadata">
                            <FormField
                                control={form.control}
                                name="releaseChannel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Release channel</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[
                                                    VersionReleaseChannel.RELEASE,
                                                    VersionReleaseChannel.BETA,
                                                    VersionReleaseChannel.ALPHA,
                                                ].map((channel) => (
                                                    <SelectItem key={channel} value={channel}>
                                                        {CapitalizeAndFormatString(channel)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="versionNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Version number</FormLabel>
                                        <Input placeholder="#" {...field} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="loaders"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="supported-loaders-filter-input">Loaders</FormLabel>
                                        <MultiSelectInput
                                            inputName={field.name}
                                            options={loaders.map((loader) => loader.name)}
                                            inputPlaceholder="Choose loaders.."
                                            inputId={"supported-loaders-filter-input"}
                                            initialSelectedItems={field.value || []}
                                            setSelectedValues={field.onChange}
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gameVersions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="supported-game-versions-filter-input">Game versions</FormLabel>
                                        <MultiSelectInput
                                            inputName={field.name}
                                            options={GAME_VERSIONS.map((version) => version.version)}
                                            inputPlaceholder="Choose versions.."
                                            inputId={"supported-game-versions-filter-input"}
                                            initialSelectedItems={field.value || []}
                                            setSelectedValues={field.onChange}
                                        />
                                    </FormItem>
                                )}
                            />
                        </ContentCardTemplate>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default UploadNewVersionForm;

interface AddDependenciesProps {
    dependencies?: {
        projectId: number;
        versionId?: number;
        dependencyType: DependencyType;
    }[];
}

const AddDependencies = ({ dependencies }: AddDependenciesProps) => {
    const [dependsOn, setDependsOn] = useState(DependsOn.PROJECT);
    const [slug, setSlug] = useState("");
    const [dependencyType, setDependencyType] = useState(DependencyType.REQUIRED);

    const checkIfValidProjectDependency = async () => { };

    const checkIfValidVersionDependency = async () => {
        return false;
    };

    const handleAddingDependency = async () => { };

    return (
        <div className="w-full flex flex-col gap-3 items-start justify-center">
            <div className="w-full flex flex-col gap-1">
                <span className="font-semibold text-muted-foreground">Add dependency</span>
                <div className="w-full flex flex-col items-start justify-center gap-2">
                    <Select
                        defaultValue={DependsOn.PROJECT}
                        value={dependsOn}
                        onValueChange={(value: string) => setDependsOn(value === DependsOn.PROJECT ? DependsOn.PROJECT : DependsOn.VERSION)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={DependsOn.PROJECT}>{CapitalizeAndFormatString(DependsOn.PROJECT)}</SelectItem>
                            <SelectItem value={DependsOn.VERSION}>{CapitalizeAndFormatString(DependsOn.VERSION)}</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder={`Enter the ${dependsOn === DependsOn.PROJECT ? "project ID/slug" : "version ID"}`}
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                    />

                    <Select
                        defaultValue={DependencyType.REQUIRED}
                        value={dependencyType}
                        onValueChange={(value: string) => setDependencyType(value as DependencyType)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={DependencyType.REQUIRED}>{CapitalizeAndFormatString(DependencyType.REQUIRED)}</SelectItem>
                            <SelectItem value={DependencyType.OPTIONAL}>{CapitalizeAndFormatString(DependencyType.OPTIONAL)}</SelectItem>
                            <SelectItem value={DependencyType.INCOMPATIBLE}>
                                {CapitalizeAndFormatString(DependencyType.INCOMPATIBLE)}
                            </SelectItem>
                            <SelectItem value={DependencyType.EMBEDDED}>{CapitalizeAndFormatString(DependencyType.EMBEDDED)}</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={handleAddingDependency}>
                        <PlusIcon className="w-btn-icon-md h-btn-icon-md" />
                        Add dependency
                    </Button>
                </div>
            </div>
        </div>
    );
};

const SelectPrimaryFileInput = ({
    children,
    selectedFile,
    inputId,
}: { children: React.ReactNode; selectedFile?: File | FileObjectType; inputId: string }) => {
    return (
        <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between bg-shallow-background rounded px-4 py-2 gap-x-4 gap-y-2">
            <div className="flex items-center justify-start gap-1.5">
                {children}
                <FileIcon className="flex-shrink-0 w-btn-icon h-btn-icon text-muted-foreground" />
                {selectedFile ? (
                    <div className="flex items-center flex-wrap justify-start gap-x-2">
                        <span>
                            <strong className="font-semibold">{selectedFile.name}</strong>{" "}
                            <span className="whitespace-nowrap ml-0.5">({parseFileSize(selectedFile.size)})</span>{" "}
                            <span className="text-muted-foreground italic ml-1">Primary</span>
                        </span>
                    </div>
                ) : (
                    <span className="text-muted-foreground italic">No file choosen</span>
                )}
            </div>

            <label
                htmlFor={inputId}
                className={cn(buttonVariants({ variant: "secondary" }), "cursor-pointer bg-card-background hover:bg-card-background/80")}
            >
                {selectedFile ? "Replace file" : "Choose file"}
            </label>
        </div>
    );
};

const SelectAdditionalFiles = ({
    children,
    selectedFiles,
    inputId,
    onChange,
}: { children: React.ReactNode; selectedFiles?: (File | FileObjectType)[]; inputId: string; onChange: (...event: unknown[]) => void }) => {
    const deleteFileFromList = (index: number) => {
        if (!selectedFiles?.length) return;
        onChange([...selectedFiles.slice(0, index), ...selectedFiles.slice(index + 1)]);
    };

    return (
        <div className="w-full flex flex-col items-start justify-center gap-3">
            {(selectedFiles?.length || 0) > 0 ? (
                <div className="w-full flex flex-col gap-2 my-2 items-start justify-center">
                    {selectedFiles?.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between bg-shallow-background/75 rounded px-4 py-2 gap-x-4 gap-y-2"
                        >
                            <div className="flex items-center justify-start gap-1.5">
                                {children}
                                <FileIcon className="flex-shrink-0 w-btn-icon h-btn-icon text-muted-foreground" />
                                <div className="flex items-center flex-wrap justify-start gap-x-2">
                                    <span>
                                        <strong className="font-semibold text-wrap">{file.name}</strong>{" "}
                                        <span className="whitespace-nowrap ml-0.5">({parseFileSize(file.size)})</span>
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant={"secondary"}
                                className="bg-card-background hover:bg-card-background/75"
                                onClick={() => deleteFileFromList(index)}
                            >
                                <Trash2Icon className="w-btn-icon h-btn-icon" />
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>
            ) : null}

            <label
                htmlFor={inputId}
                className="w-full flex items-center justify-center gap-2 px-4 py-5 border-[0.17rem] border-dashed rounded border-shallower-background cursor-pointer bg-shallow-background/25 hover:bg-shallow-background/35"
            >
                <UploadIcon className="w-btn-icon h-btn-icon" />
                Select files
            </label>
            {children}
        </div>
    );
};
