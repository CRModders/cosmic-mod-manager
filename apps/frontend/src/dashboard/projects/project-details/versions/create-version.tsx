import { ChevronRightIcon, CrossIcon, HashIcon, PlusIcon } from "@/components/icons";
import MarkdownEditor from "@/components/markdown-editor";
import { ContentWrapperCard } from "@/components/panel-layout";
import RedrectTo from "@/components/redirect-to";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { LabelledCheckBox } from "@/components/ui/checkbox";
import { Input, InputWithInlineLabel } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelectInput } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import { useIsUseAProjectMember } from "@/src/hooks/project-member";
import { Projectcontext } from "@/src/providers/project-context";
import { FileIcon } from "@radix-ui/react-icons";
import { maxFileSize } from "@root/config";
import { GameVersions, Loaders, ReleaseChannelsList } from "@root/config/project";
import {
    CapitalizeAndFormatString,
    createURLSafeSlug,
    getProjectPagePathname,
    getVersionPagePathname,
    parseFileSize,
} from "@root/lib/utils";
import { ReleaseChannels } from "@root/types";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const getAllVisibleGameVersions = (showAllVersions: boolean) => {
    const list = [];
    for (const version of GameVersions) {
        if (showAllVersions || version.releaseType === ReleaseChannels.RELEASE) list.push(version.version);
    }
    return list;
};

const CreateVersionPage = ({ projectType }: { projectType: string }) => {
    const { projectUrlSlug } = useParams();
    const { projectData, fetchAllProjectVersions } = useContext(Projectcontext);
    const [loading, setLoading] = useState(false);
    const isAProjectMember = useIsUseAProjectMember();
    const [showAllVersions, setShowAllVersions] = useState(true);
    const [visibleGameVersions, setvisibleGameVersions] = useState(getAllVisibleGameVersions(showAllVersions));
    const navigate = useNavigate();

    // Formdata
    const [versionName, setVersionName] = useState("");
    const [changelog, setChangelog] = useState("");
    const [versionNumber, setVersionNumber] = useState("");
    const [releaseChannel, setReleaseChannel] = useState<ReleaseChannels>(ReleaseChannels.RELEASE);
    const [loaders, setLoaders] = useState<string[]>([]);
    const [supportedGameVersions, setSupportedGameVersions] = useState<string[]>([]);
    const [versionFile, setversionFile] = useState<File | null>(null);
    const createProjectVersion = async () => {
        if (!versionName) return toast({ title: "Version title is required", variant: "destructive" });
        if (!versionNumber) return toast({ title: "Version number is required", variant: "destructive" });
        if (!supportedGameVersions?.length)
            return toast({ title: "Supported game versions is required", variant: "destructive" });
        if (!versionFile) return toast({ title: "Primary version file is required", variant: "destructive" });

        if (versionFile.size > maxFileSize) {
            return toast({
                title: `File too large: "${versionFile.name}" (${parseFileSize(
                    versionFile.size,
                )}) | MaxAllowedSize: ${parseFileSize(maxFileSize)}`,
                variant: "destructive",
            });
        }

        if (createURLSafeSlug(versionNumber, "+").value !== versionNumber) {
            return toast({
                title: "Version number must be a URL safe string",
                variant: "destructive",
            });
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("primary-file", versionFile);
        formData.append("versionName", versionName);
        formData.append("changelog", changelog);
        formData.append("versionNumber", versionNumber);
        formData.append("releaseChannel", releaseChannel);
        formData.append("loaders", JSON.stringify(loaders));
        formData.append("supportedGameVersions", JSON.stringify(supportedGameVersions));

        const response = await useFetch(`/api/project/${projectData?.url_slug}/version/create`, {
            method: "POST",
            body: formData,
        });
        setLoading(false);
        const result = await response.json();

        if (!response.ok) {
            return toast({
                title: result?.message,
                variant: "destructive",
            });
        }

        toast({
            title: result?.message,
        });

        navigate(getVersionPagePathname(projectType, projectData?.url_slug, result?.newVersionUrlSlug));
        await fetchAllProjectVersions();
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (isAProjectMember === false) {
            return navigate(getProjectPagePathname(projectType, projectUrlSlug), { replace: true });
        }
    }, [isAProjectMember]);

    useEffect(() => {
        setvisibleGameVersions(getAllVisibleGameVersions(showAllVersions));
    }, [showAllVersions]);

    if (isAProjectMember === false) {
        return <RedrectTo destinationUrl={getProjectPagePathname(projectType, projectUrlSlug)} />;
    }

    if (isAProjectMember === undefined) {
        return null;
    }

    return (
        <>
            <div className="w-full flex flex-col gap-card-gap items-start justify-center">
                <ContentWrapperCard>
                    <div className="w-full px-1">
                        <Breadcrumb>
                            <BreadcrumbList className="flex items-center">
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={`${getProjectPagePathname(projectType, projectUrlSlug)}/versions`}
                                        className=" text-base"
                                    >
                                        Versions
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="flex items-center justify-center">
                                    <ChevronRightIcon size="1rem" className=" text-foreground" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{versionName}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <Input
                            type="text"
                            className="w-full text-xl py-2 px-4 h-12"
                            placeholder="Enter the version title..."
                            value={versionName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setVersionName(e.target.value || "");
                            }}
                        />

                        <div className="flex gap-4 items-center justify-start">
                            <Button disabled={loading} className="gap-2" onClick={createProjectVersion}>
                                <PlusIcon className="w-5 h-5" />
                                Create
                            </Button>
                            <Link
                                to={`${getProjectPagePathname(projectType, projectUrlSlug)}/versions`}
                                className=" rounded-lg"
                            >
                                <Button className="gap-2" variant={"secondary"} disabled={loading} tabIndex={-1}>
                                    <CrossIcon className="w-4 h-4" />
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </ContentWrapperCard>

                <div className="w-full gap-card-gap grid grid-cols-1 xl:grid-cols-[1fr_min-content]">
                    <div className="w-full flex flex-col gap-card-gap">
                        <ContentWrapperCard>
                            <div className="w-full flex flex-col items-start justify-center gap-1">
                                <Label htmlFor="version-changelog-textarea" className="font-semibold text-lg">
                                    Changelog
                                </Label>
                                <MarkdownEditor
                                    placeholder="Version changelog..."
                                    editorValue={changelog}
                                    setEditorValue={setChangelog}
                                />
                            </div>
                        </ContentWrapperCard>

                        {/* // TODO: Add dependency thing */}
                        {/* <ContentWrapperCard>2</ContentWrapperCard> */}

                        <ContentWrapperCard className="w-full">
                            <div className="w-full flex flex-col items-start justify-center gap-1">
                                <p className="font-semibold text-xl">Files</p>
                            </div>

                            <div className="w-full flex items-center justify-between py-3 px-6 flex-wrap gap-4 rounded-lg bg-bg-hover">
                                <div className="flex gap-x-2 gap-y-1 items-center">
                                    <FileIcon className="w-5 h-5 text-foreground-muted" />
                                    {versionFile ? (
                                        <>
                                            <p className="text-lg font-semibold text-foreground-muted">
                                                {versionFile.name}
                                            </p>
                                            <p className="text-base text-foreground-muted">
                                                {parseFileSize(versionFile.size)}
                                            </p>
                                        </>
                                    ) : (
                                        <p>No file choosen</p>
                                    )}
                                </div>

                                <Label htmlFor="version-main-file-input" tabIndex={0}>
                                    <p className="py-2.5 px-6 font-[500] text-foreground text-base cursor-pointer bg-background hover:bg-background/75 rounded-lg">
                                        Choose file
                                    </p>
                                </Label>
                                <Input
                                    type="file"
                                    id="version-main-file-input"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setversionFile(file);
                                        }
                                    }}
                                />
                            </div>

                            {/* // TODO: ADD Additional file uploads */}
                            {/* <div>

                    </div> */}
                        </ContentWrapperCard>
                    </div>

                    <ContentWrapperCard className="h-fit min-w-[20rem]">
                        <div className="w-full flex flex-col items-start justify-center gap-1">
                            <p className="font-semibold text-xl">Metadata</p>
                        </div>

                        <div className="w-full flex flex-col">
                            <Label
                                htmlFor="version-release-channel-selector"
                                className="font-semibold text-foreground text-lg"
                            >
                                Release channel
                            </Label>
                            <Select
                                defaultValue={releaseChannel}
                                onValueChange={(value) => {
                                    setReleaseChannel(value as ReleaseChannels);
                                }}
                            >
                                <SelectTrigger className="w-full min-w-[24ch]" id="version-release-channel-selector">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ReleaseChannelsList.map((channel) => {
                                        return (
                                            <SelectItem key={channel} value={channel}>
                                                {CapitalizeAndFormatString(channel)}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full flex flex-col">
                            <Label htmlFor="version-number-input" className="font-semibold text-foreground text-lg">
                                Version number
                            </Label>

                            <InputWithInlineLabel
                                label={<HashIcon size="1.1rem" />}
                                id="version-number-input"
                                className="pl-2"
                                value={versionNumber}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setVersionNumber(e.target.value);
                                }}
                            />
                        </div>

                        <div className="w-full flex flex-col">
                            <Label className="font-semibold text-foreground text-lg">Loaders</Label>
                            <MultiSelectInput
                                options={Loaders.map((loader) => loader.name)}
                                inputPlaceholder="Choose loaders.."
                                input_id={"supported-loaders-filter-input"}
                                setSelectedValues={setLoaders}
                            />
                        </div>
                        <div className="w-full flex flex-col">
                            <Label className="font-semibold text-foreground text-lg">Game versions</Label>
                            <MultiSelectInput
                                options={visibleGameVersions}
                                inputPlaceholder="Choose versions.."
                                input_id={"supported-game-version-filter-input"}
                                setSelectedValues={setSupportedGameVersions}
                            />
                            <LabelledCheckBox
                                checked={showAllVersions}
                                onCheckedChange={(value) => {
                                    setShowAllVersions(value === true);
                                }}
                                checkBoxId="show-all-versions-checkbox"
                                label="Show all versions"
                                className="mt-2"
                            />
                        </div>
                    </ContentWrapperCard>
                </div>
            </div>
            {loading ? <AbsolutePositionedSpinner /> : null}
        </>
    );
};

export default CreateVersionPage;
