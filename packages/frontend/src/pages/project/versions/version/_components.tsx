import { CancelButtonIcon } from "@/components/icons";
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
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VariantButtonLink } from "@/components/ui/link";
import { MultiSelectInput } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import GAME_VERSIONS from "@shared/config/game-versions";
import { loaders } from "@shared/config/project";
import { CapitalizeAndFormatString, createURLSafeSlug, parseFileSize } from "@shared/lib/utils";
import { getFileType } from "@shared/lib/utils/convertors";
import { DependencyType, DependsOn, type FileObjectType, VersionReleaseChannel } from "@shared/types";
import { FileIcon, PlusIcon, StarIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useState } from "react";
import type { Control, FieldValues, RefCallBack } from "react-hook-form";
import { toast } from "sonner";

interface VersionTitleInputProps {
    name: string;
    value: string;
    disabled: boolean;
    inputRef: RefCallBack;
    onChange: (value: string) => void;
}
export const VersionTitleInput = ({ name, value, disabled, inputRef, onChange }: VersionTitleInputProps) => {
    return (
        <Input
            placeholder="Enter the version title..."
            className="!h-12 !py-1 !px-4 text-xl font-semibold !text-muted-foreground"
            name={name}
            value={value}
            disabled={disabled}
            ref={inputRef}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

interface FeaturedBtnProps {
    isLoading: boolean;
    featured: boolean;
    setFeatured: (value: boolean) => void;
}
export const FeaturedBtn = ({ isLoading, featured, setFeatured }: FeaturedBtnProps) => {
    return (
        <Button variant="secondary" disabled={isLoading} type="button" onClick={() => setFeatured(!featured)}>
            <StarIcon className={cn("w-btn-icon h-btn-icon", featured === true && "fill-current")} />
            {featured === true ? "Unfeature version" : "Feature version"}
        </Button>
    );
};

interface UploadVersionPageTopCardProps {
    isLoading: boolean;
    versionPageUrl: string;
    versionTitle: string;
    children: React.ReactNode;
    backUrl: string;
    featuredBtn: React.ReactNode;
    submitBtnLabel?: string;
    submitBtnIcon: React.ReactNode;
}
export const UploadVersionPageTopCard = ({
    versionPageUrl,
    versionTitle,
    isLoading,
    backUrl,
    featuredBtn,
    children,
    submitBtnLabel,
    submitBtnIcon
}: UploadVersionPageTopCardProps) => {
    return (
        <Card className="w-full p-card-surround flex flex-col items-start justify-start gap-panel-cards">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={versionPageUrl}>Versions</BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{versionTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {children}

            <div className="w-full flex flex-wrap gap-x-panel-cards gap-y-2 items-center justify-start">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size="xs" /> : submitBtnIcon}
                    {submitBtnLabel || "Submit"}
                </Button>

                {featuredBtn}

                <VariantButtonLink variant="secondary" url={backUrl}>
                    <CancelButtonIcon className="w-btn-icon h-btn-icon" />
                    Cancel
                </VariantButtonLink>
            </div>
        </Card>
    );
};

interface MetadataInputCardProps {
    formControl: Control<FieldValues> | undefined;
}
export const MetadataInputCard = ({ formControl }: MetadataInputCardProps) => {
    return (
        <ContentCardTemplate className="w-full min-w-[19rem] px-card-surround flex flex-col gap-form-elements" title="Metadata">
            <FormField
                control={formControl}
                name="releaseChannel"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Release channel</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[VersionReleaseChannel.RELEASE, VersionReleaseChannel.BETA, VersionReleaseChannel.ALPHA].map((channel) => (
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
                control={formControl}
                name="versionNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Version number</FormLabel>
                        <Input
                            placeholder="#"
                            {...field}
                            onChange={(e) => {
                                field.onChange(createURLSafeSlug(e.target.value, "+").value);
                            }}
                        />
                    </FormItem>
                )}
            />

            <FormField
                control={formControl}
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
                control={formControl}
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
    );
};

interface AddDependenciesProps {
    dependencies?: {
        projectId: number;
        versionId?: number;
        dependencyType: DependencyType;
    }[];
}
export const AddDependencies = ({ dependencies }: AddDependenciesProps) => {
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

                    <Button onClick={handleAddingDependency} type="button">
                        <PlusIcon className="w-btn-icon-md h-btn-icon-md" />
                        Add dependency
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const SelectPrimaryFileInput = ({
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

export const SelectAdditionalProjectFiles = ({ formControl }: { formControl: Control<FieldValues> }) => {
    return (
        <FormField
            control={formControl}
            name="additionalFiles"
            render={({ field }) => (
                <FormItem className="w-full flex items-start justify-center">
                    <div className="w-full flex flex-col">
                        <span className="font-semibold">Upload additional files</span>
                        <span className="text-muted-foreground">Used for files such as sources or Javadocs.</span>

                        <AdditionalFiles inputId="additional-files-input" selectedFiles={field.value} onChange={field.onChange}>
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
                        </AdditionalFiles>
                    </div>
                </FormItem>
            )}
        />
    );
};

const AdditionalFiles = ({
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
                className="w-full flex items-center justify-center gap-2 px-4 py-5 rounded border-[0.1rem] border-shallow-background cursor-pointer bg-shallow-background/50 hover:bg-shallow-background/70"
            >
                <UploadIcon className="w-btn-icon h-btn-icon" />
                Select files
            </label>
            {children}
        </div>
    );
};
