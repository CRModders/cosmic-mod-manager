import type { DependencyData } from "@root/types";
import { cn, imageUrl } from "@root/utils";
import clientFetch from "@root/utils/client-fetch";
import GAME_VERSIONS, { isExperimentalGameVersion } from "@shared/config/game-versions";
import { CapitalizeAndFormatString, createURLSafeSlug, getLoadersByProjectType, parseFileSize } from "@shared/lib/utils";
import { getFileType } from "@shared/lib/utils/convertors";
import type { VersionDependencies } from "@shared/schemas/project/version";
import { DependencyType, DependsOn, type FileObjectType, type ProjectType, VersionReleaseChannel } from "@shared/types";
import type { ProjectDetailsData, ProjectVersionData } from "@shared/types/api";
import { CircleAlertIcon, FileIcon, PlusIcon, StarIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useState } from "react";
import type { Control, FieldValues, RefCallBack } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { CancelButtonIcon } from "~/components/icons";
import { ContentCardTemplate } from "~/components/layout/panel";
import { ImgWrapper } from "~/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import { CommandSeparator } from "~/components/ui/command";
import { FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { VariantButtonLink } from "~/components/ui/link";
import { MultiSelect } from "~/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { LoadingSpinner } from "~/components/ui/spinner";
import { TooltipProvider, TooltipTemplate } from "~/components/ui/tooltip";

interface VersionTitleInputProps {
    name: string;
    value: string;
    disabled: boolean;
    inputRef: RefCallBack;
    onChange: (value: string) => void;
}
export function VersionTitleInput({ name, value, disabled, inputRef, onChange }: VersionTitleInputProps) {
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
}

interface FeaturedBtnProps {
    isLoading: boolean;
    featured: boolean;
    setFeatured: (value: boolean) => void;
}
export function FeaturedBtn({ isLoading, featured, setFeatured }: FeaturedBtnProps) {
    return (
        <Button variant="secondary" disabled={isLoading} type="button" onClick={() => setFeatured(!featured)}>
            <StarIcon className={cn("w-btn-icon h-btn-icon", featured === true && "fill-current")} />
            {featured === true ? "Unfeature version" : "Feature version"}
        </Button>
    );
}

interface UploadVersionPageTopCardProps {
    isLoading: boolean;
    versionPageUrl: string;
    versionTitle: string;
    children: React.ReactNode;
    backUrl: string;
    featuredBtn: React.ReactNode;
    submitBtnLabel?: string;
    submitBtnIcon: React.ReactNode;
    onSubmitBtnClick: () => Promise<void>;
}
export function UploadVersionPageTopCard({
    versionPageUrl,
    versionTitle,
    isLoading,
    backUrl,
    featuredBtn,
    children,
    submitBtnLabel,
    submitBtnIcon,
    onSubmitBtnClick,
}: UploadVersionPageTopCardProps) {
    return (
        <Card className="w-full p-card-surround flex flex-col items-start justify-start gap-3">
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
                <Button type="submit" disabled={isLoading} onClick={onSubmitBtnClick}>
                    {isLoading ? <LoadingSpinner size="xs" /> : submitBtnIcon}
                    {submitBtnLabel || "Submit"}
                </Button>

                {featuredBtn}

                <VariantButtonLink variant="secondary" url={backUrl} prefetch="render">
                    <CancelButtonIcon className="w-btn-icon h-btn-icon" />
                    Cancel
                </VariantButtonLink>
            </div>
        </Card>
    );
}

interface MetadataInputCardProps {
    projectType: ProjectType[];
    formControl: Control<FieldValues> | undefined;
}
export function MetadataInputCard({ projectType, formControl }: MetadataInputCardProps) {
    const [showAllVersions, setShowAllVersions] = useState(false);
    const availableLoaders = getLoadersByProjectType(projectType);

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

                                {field.value === VersionReleaseChannel.DEV ? (
                                    <TooltipProvider>
                                        <TooltipTemplate
                                            className="max-w-sm bg-shallow-background text-start text-foreground-bright"
                                            content={
                                                "NOTE:- Older dev releases will be automatically deleted after a new dev release is published."
                                            }
                                        >
                                            <CircleAlertIcon className="w-btn-icon h-btn-icon text-warning-foreground ml-auto cursor-help" />
                                        </TooltipTemplate>
                                    </TooltipProvider>
                                ) : null}
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    VersionReleaseChannel.RELEASE,
                                    VersionReleaseChannel.BETA,
                                    VersionReleaseChannel.ALPHA,
                                    VersionReleaseChannel.DEV,
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
                control={formControl}
                name="versionNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Version number</FormLabel>
                        <Input
                            placeholder="#"
                            {...field}
                            onChange={(e) => {
                                field.onChange(createURLSafeSlug(e.target.value).value);
                            }}
                        />
                    </FormItem>
                )}
            />

            {availableLoaders.length ? (
                <FormField
                    control={formControl}
                    name="loaders"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="supported-loaders-filter-input">Loaders</FormLabel>

                            <MultiSelect
                                options={availableLoaders.map((loader) => ({
                                    label: CapitalizeAndFormatString(loader.name) || "",
                                    value: loader.name,
                                }))}
                                onValueChange={field.onChange}
                                selectedValues={field.value || []}
                                placeholder="Select loaders"
                                searchBox={false}
                            />
                        </FormItem>
                    )}
                />
            ) : null}

            <FormField
                control={formControl}
                name="gameVersions"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="supported-game-versions-filter-input">Game versions</FormLabel>

                        <MultiSelect
                            options={GAME_VERSIONS.filter(
                                (version) => showAllVersions || !isExperimentalGameVersion(version.releaseType),
                            ).map((version) => ({ label: version.label, value: version.value }))}
                            allOptions={GAME_VERSIONS.map((version) => ({ label: version.label, value: version.value }))}
                            onValueChange={field.onChange}
                            selectedValues={field.value || []}
                            placeholder="Select versions"
                            fixedFooter={
                                <>
                                    <CommandSeparator />

                                    <LabelledCheckbox
                                        checked={showAllVersions}
                                        onCheckedChange={(checked) => setShowAllVersions(checked === true)}
                                        className="text-extra-muted-foreground pl-3.5 mt-1"
                                    >
                                        Show all versions
                                    </LabelledCheckbox>
                                </>
                            }
                        />
                    </FormItem>
                )}
            />
        </ContentCardTemplate>
    );
}

interface AddDependenciesProps {
    dependencies?: z.infer<typeof VersionDependencies>;
    setDependencies: (value: z.infer<typeof VersionDependencies>) => void;
    currProjectId: string;
    dependenciesData: DependencyData | null;
}
export function AddDependencies({ dependencies, setDependencies, currProjectId, dependenciesData }: AddDependenciesProps) {
    const [isfetchingData, setIsFetchingData] = useState(false);
    const [dependsOn, setDependsOn] = useState(DependsOn.PROJECT);
    const [projectSlug, setProjectSlug] = useState("");
    const [versionSlug, setVersionSlug] = useState("");
    const [dependencyType, setDependencyType] = useState(DependencyType.REQUIRED);

    // Data for the dependencies
    const [dependencyData, setDependencyData] = useState<DependencyData>(dependenciesData || { projects: [], versions: [] });

    function isDependencyValid(projectId: string) {
        return !dependencies?.some((dependency) => dependency.projectId === projectId);
    }

    function addNewDependency(projectId: string, versionId: string | null, type: DependencyType) {
        if (projectId === currProjectId) {
            toast.error("You cannot add the current project as a dependency");
            return;
        }
        setDependencies([...(dependencies || []), { projectId, versionId: versionId, dependencyType: type }]);
    }

    function removeDependency(projectId: string, versionId: string | null) {
        const filteredDependencies = (dependencies || []).filter((dependency) => {
            if (dependency.projectId !== projectId || dependency.versionId !== versionId) return dependency;
        });
        setDependencies(filteredDependencies);
    }

    async function fetchProject(slug: string) {
        const res = await clientFetch(`/api/project/${slug}`);
        const data = (await res.json()) as { success: boolean; message?: string; project: ProjectDetailsData | null };

        if (!res.ok || !data?.project) {
            toast.error(data?.message || "Failed to fetch project");
            return null;
        }

        return data.project;
    }

    async function fetchVersion(projectSlug: string, versionSlug: string): Promise<ProjectVersionData | null> {
        const res = await clientFetch(`/api/project/${projectSlug}/version/${versionSlug}`);
        const data = (await res.json()) as { success: boolean; message?: string; data: ProjectVersionData | null };

        if (!res.ok || !data?.data) {
            toast.error(data?.message || "Failed to fetch version");
            return null;
        }

        return data.data;
    }

    async function addProjectDependency() {
        if (isfetchingData) return;
        setIsFetchingData(true);
        try {
            const project = await fetchProject(projectSlug);
            if (!project) return;

            if (!isDependencyValid(project.id)) {
                return toast.error("You cannot add the same dependency twice");
            }

            addNewDependency(project.id, null, dependencyType);
            setDependencyData((prev) => ({
                ...prev,
                projects: [
                    ...prev.projects,
                    {
                        id: project.id,
                        name: project.name,
                        slug: project.slug,
                        type: project.type,
                        icon: project.icon || "",
                    },
                ],
            }));
            setProjectSlug("");
            setVersionSlug("");
        } finally {
            setIsFetchingData(false);
        }
    }

    async function addVersionDependency() {
        if (isfetchingData) return;
        setIsFetchingData(true);
        try {
            const [project, version] = await Promise.all([fetchProject(projectSlug), fetchVersion(projectSlug, versionSlug)]);
            if (!project || !version) return;

            if (!isDependencyValid(project.id)) {
                return toast.error("You cannot add the same dependency twice");
            }

            addNewDependency(project.id, version.id, dependencyType);
            setDependencyData((prev) => ({
                ...prev,
                projects: [
                    ...prev.projects,
                    {
                        id: project.id,
                        name: project.name,
                        slug: project.slug,
                        type: project.type,
                        icon: project.icon || "",
                    },
                ],
                versions: [
                    ...prev.versions,
                    {
                        id: version.id,
                        title: version.title,
                        versionNumber: version.versionNumber,
                        slug: version.slug,
                    },
                ],
            }));
            setProjectSlug("");
            setVersionSlug("");
        } finally {
            setIsFetchingData(false);
        }
    }

    async function addDependencyHandler() {
        if (!projectSlug) return;
        if (dependsOn === DependsOn.PROJECT) {
            await addProjectDependency();
        } else {
            await addVersionDependency();
        }
    }

    return (
        <div className="w-full flex flex-col gap-3 items-start justify-center">
            {dependencies?.length ? (
                <div className="w-full flex flex-col items-start justify-start gap-4 mb-2">
                    {dependencies?.map((dependency) => (
                        <DependencyItem
                            key={dependency.versionId || dependency.projectId}
                            dependencyData={dependencyData}
                            projectId={dependency.projectId}
                            versionId={dependency.versionId || null}
                            dependencyType={dependency.dependencyType}
                            removeDependency={removeDependency}
                        />
                    ))}
                </div>
            ) : null}

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

                    <Input placeholder={"Enter the project ID/slug"} value={projectSlug} onChange={(e) => setProjectSlug(e.target.value)} />

                    {dependsOn === DependsOn.VERSION ? (
                        <Input
                            placeholder={"Enter the version ID/slug"}
                            value={versionSlug}
                            onChange={(e) => setVersionSlug(e.target.value)}
                        />
                    ) : null}

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

                    <Button onClick={addDependencyHandler} type="button" disabled={isfetchingData}>
                        {isfetchingData ? <LoadingSpinner size="xs" /> : <PlusIcon className="w-btn-icon-md h-btn-icon-md" />}
                        Add dependency
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface DependencyItemProps {
    dependencyData: DependencyData;
    projectId: string;
    versionId: string | null;
    dependencyType: DependencyType;
    removeDependency: (projectId: string, versionId: string | null) => void;
}

function DependencyItem({ dependencyData, versionId, projectId, dependencyType, removeDependency }: DependencyItemProps) {
    const dependencyProject = dependencyData.projects.find((project) => project.id === projectId);
    const dependencyVersion = dependencyData.versions.find((version) => version.id === versionId);

    if (!dependencyProject?.id) return null;

    return (
        <div className="w-full flex items-center justify-between gap-x-4 gap-y-1 text-muted-foreground">
            <div className="flex items-center justify-start gap-2">
                <ImgWrapper src={imageUrl(dependencyProject.icon)} alt={dependencyProject.name} className="h-12 w-12 rounded" />
                <div className="flex flex-col items-start justify-start">
                    <span className="font-bold text-foreground">{dependencyProject.name}</span>
                    <span>
                        {dependencyVersion ? (
                            <>
                                Version {dependencyVersion.versionNumber} is {dependencyType}
                            </>
                        ) : (
                            CapitalizeAndFormatString(dependencyType)
                        )}
                    </span>
                </div>
            </div>

            <Button variant="secondary" type="button" onClick={() => removeDependency(projectId, versionId)}>
                <Trash2Icon className="w-btn-icon h-btn-icon" />
                Remove
            </Button>
        </div>
    );
}

export function SelectPrimaryFileInput({
    children,
    selectedFile,
    inputId,
}: { children: React.ReactNode; selectedFile?: File | FileObjectType; inputId: string }) {
    return (
        <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between bg-shallow-background rounded px-4 py-2 gap-x-4 gap-y-2">
            <div className="flex items-center justify-start gap-1.5">
                {children}
                <FileIcon className="flex-shrink-0 w-btn-icon h-btn-icon text-muted-foreground" />
                {selectedFile ? (
                    <span className="flex items-center flex-wrap justify-start gap-x-2">
                        <strong className="font-semibold">{selectedFile.name}</strong>{" "}
                        <span className="whitespace-nowrap ml-0.5">({parseFileSize(selectedFile.size)})</span>{" "}
                        <span className="text-muted-foreground italic ml-1">Primary</span>
                    </span>
                ) : (
                    <span className="text-muted-foreground italic">No file choosen</span>
                )}
            </div>

            <label htmlFor={inputId} className={cn(buttonVariants({ variant: "secondary-dark" }), "cursor-pointer")}>
                {selectedFile ? "Replace file" : "Choose file"}
            </label>
        </div>
    );
}

export function SelectAdditionalProjectFiles({ formControl }: { formControl: Control<FieldValues> }) {
    return (
        <FormField
            control={formControl}
            name="additionalFiles"
            render={({ field }) => (
                <FormItem className="w-full flex flex-col items-start justify-center gap-0">
                    <span className="font-semibold">Upload additional files</span>
                    <span className="text-sm text-muted-foreground mb-1">Used for files such as sources or Javadocs.</span>

                    <AdditionalFiles inputId="additional-files-input" selectedFiles={field.value} onChange={field.onChange}>
                        <input
                            type="file"
                            hidden
                            name={field.name}
                            multiple
                            id="additional-files-input"
                            className="hidden"
                            onChange={async (e) => {
                                e.preventDefault();

                                const newFiles: File[] = [];
                                mainLoop: for (let i = 0; i < (e.target.files?.length || 0); i++) {
                                    const file = e.target.files?.[i];
                                    if (!file?.name) continue;

                                    const fileType = await getFileType(file);
                                    if (!fileType) {
                                        toast.error(`Invalid file "${file.name}" with type "${fileType}"`);
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
                </FormItem>
            )}
        />
    );
}

function AdditionalFiles({
    children,
    selectedFiles,
    inputId,
    onChange,
}: { children: React.ReactNode; selectedFiles?: (File | FileObjectType)[]; inputId: string; onChange: (...event: unknown[]) => void }) {
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
                                <span className="flex items-center flex-wrap justify-start gap-x-2">
                                    <strong className="font-semibold text-wrap">{file.name}</strong>{" "}
                                    <span className="whitespace-nowrap ml-0.5">({parseFileSize(file.size)})</span>
                                </span>
                            </div>

                            <Button variant={"secondary-dark"} onClick={() => deleteFileFromList(index)}>
                                <Trash2Icon className="w-btn-icon h-btn-icon" />
                                Remove
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
}
