import FileDetails from "@/components/file-details";
import { ChevronRightIcon, SaveIcon, HashIcon } from "@/components/icons";
import MarkdownEditor from "@/components/markdown-editor";
import { ContentWrapperCard } from "@/components/panel-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input, InputWithInlineLabel } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelectInput } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { constructVersionPageUrl } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { useIsUseAProjectMember } from "@/src/hooks/project-member";
import { Projectcontext } from "@/src/providers/project-context";
import { Cross1Icon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { GameVersions, Loaders, ReleaseChannelsList } from "@root/config/project";
import {
    CapitalizeAndFormatString,
    createURLSafeSlug,
    getProjectPagePathname,
    getVersionPagePathname,
} from "@root/lib/utils";
import type { ProjectVersionData } from "@root/types";
import { ReleaseChannels } from "@root/types";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useParams } from "react-router-dom";

const getVersionData = async (projectUrlSlug: string, versionUrlSlug: string) => {
    try {
        const response = await useFetch(`/api/project/${projectUrlSlug}/version/${versionUrlSlug}`);
        return (await response.json())?.data || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const EditVersionPage = ({ projectType }: { projectType: string }) => {
    const { projectUrlSlug, versionUrlSlug } = useParams();
    const [pageInitialized, setPageInitialized] = useState(false);

    const { projectData, fetchFeaturedProjectVersions, fetchAllProjectVersions, fetchProjectData } =
        useContext(Projectcontext);
    const [loading, setLoading] = useState(false);
    const isAProjectMember = useIsUseAProjectMember();
    const navigate = useNavigate();

    const versionData = useQuery<ProjectVersionData>({
        queryKey: [`version-${versionUrlSlug}-data`],
        queryFn: () => getVersionData(projectUrlSlug || "", versionUrlSlug || ""),
    });

    // Formdata
    const [versionName, setVersionName] = useState("");
    const [changelog, setChangelog] = useState("");
    const [versionNumber, setVersionNumber] = useState("");
    const [releaseChannel, setReleaseChannel] = useState<ReleaseChannels>(ReleaseChannels.RELEASE);
    const [loaders, setLoaders] = useState<string[]>([]);
    const [supportedGameVersions, setSupportedGameVersions] = useState<string[]>([]);

    const toggleVersionFeaturing = async () => {
        if (loading) return;
        setLoading(true);

        const response = await useFetch(`/api/project/${projectUrlSlug}/version/${versionUrlSlug}/set-featured`, {
            method: "POST",
            body: JSON.stringify({
                is_featured: !(versionData.data?.versions[0].is_featured === true),
            }),
        });
        setLoading(false);
        const result = await response.json();

        if (!response.ok) {
            return toast({ title: result?.message, variant: "destructive" });
        }

        toast({ title: result?.message });
        await Promise.all([fetchAllProjectVersions(), fetchFeaturedProjectVersions(), versionData.refetch()]);
    };

    const updateProjectVersion = async () => {
        if (loading) return;

        if (!versionName) return toast({ title: "Version title is required", variant: "destructive" });
        if (!versionNumber) return toast({ title: "Version number is required", variant: "destructive" });
        if (!supportedGameVersions?.length)
            return toast({ title: "Supported game versions is required", variant: "destructive" });

        if (createURLSafeSlug(versionNumber).value !== versionNumber) {
            return toast({
                title: "Version number must be a URL safe string",
                variant: "destructive",
            });
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("versionName", versionName);
        formData.append("changelog", changelog);
        formData.append("versionNumber", versionNumber);
        formData.append("releaseChannel", releaseChannel);
        formData.append("loaders", JSON.stringify(loaders));
        formData.append("supportedGameVersions", JSON.stringify(supportedGameVersions));

        const response = await useFetch(`/api/project/${projectUrlSlug}/version/${versionUrlSlug}/update`, {
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

        await Promise.all([fetchAllProjectVersions(), fetchFeaturedProjectVersions(), fetchProjectData()]);
        toast({
            title: result?.message,
        });
        navigate(getVersionPagePathname(projectType, projectData?.url_slug, result?.data?.url_slug));
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (isAProjectMember === false) {
            return navigate(getVersionPagePathname(projectType, projectUrlSlug, versionUrlSlug), { replace: true });
        }
    }, [isAProjectMember]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (versionData.data?.versions[0].url_slug) {
            const constructedUrl = constructVersionPageUrl(versionData.data.versions[0].url_slug);
            if (window.location.href.replace(window.location.origin, "") !== constructedUrl) {
                navigate(constructedUrl);
            }
        }

        if (versionData.data?.id && pageInitialized === false) {
            const versionDetails = versionData?.data.versions[0];
            setVersionName(versionDetails.version_title);
            setChangelog(versionDetails.changelog);
            setVersionNumber(versionDetails.version_number);
            setReleaseChannel(versionDetails.release_channel as ReleaseChannels);
            setLoaders(versionDetails.supported_loaders);
            setSupportedGameVersions(versionDetails.supported_game_versions);

            setPageInitialized(true);
        }
    }, [versionData]);

    useEffect(() => {
        setLoading(versionData.isLoading);
    }, [versionData.isLoading]);

    if (isAProjectMember === false) {
        return null;
    }

    return (
        <>
            <Helmet>
                <title>{`Edit ${projectData?.name} ${versionData.data?.versions[0].version_number} | CRMM`}</title>
                <meta name="description" content={projectData?.summary} />
            </Helmet>
            <div className="w-full flex flex-col gap-card-gap items-start justify-center relative">
                <ContentWrapperCard>
                    <div className="w-full">
                        <Breadcrumb>
                            <BreadcrumbList className="flex items-center">
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={`${getProjectPagePathname(projectType, projectUrlSlug)}/versions`}
                                        className="text-base"
                                    >
                                        Versions
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="flex items-center justify-center">
                                    <ChevronRightIcon size="1rem" className=" text-foreground" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-base">{versionName}</BreadcrumbPage>
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

                        <div className="flex flex-wrap gap-x-3 gap-y-2 items-center justify-start">
                            <Button className="gap-2" onClick={updateProjectVersion} disabled={loading}>
                                <SaveIcon className="w-4 h-4" />
                                Save
                            </Button>

                            <Button
                                disabled={loading}
                                className="gap-2"
                                variant={"secondary"}
                                onClick={toggleVersionFeaturing}
                            >
                                {versionData.data?.versions[0].is_featured === true ? (
                                    <StarFilledIcon className="w-4 h-4" />
                                ) : (
                                    <StarIcon className="w-4 h-4" />
                                )}

                                {versionData.data?.versions[0].is_featured === true
                                    ? "Unfeature version"
                                    : "Feature version"}
                            </Button>

                            <Link
                                to={getVersionPagePathname(projectType, projectUrlSlug, versionUrlSlug)}
                                className="rounded-lg"
                            >
                                <Button className="gap-2" variant={"secondary"} disabled={loading} tabIndex={-1}>
                                    <Cross1Icon />
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
                                <Label className="font-semibold text-lg">Changelog</Label>
                                <MarkdownEditor
                                    editorValue={changelog}
                                    setEditorValue={setChangelog}
                                    placeholder="Version changelog..."
                                />
                            </div>
                        </ContentWrapperCard>

                        <ContentWrapperCard className="w-full h-fit">
                            <div className="w-full flex flex-col items-start justify-center gap-1">
                                <p className="font-semibold text-xl">Files</p>
                            </div>

                            {versionData.data?.versions[0].files[0].id &&
                                versionData.data?.versions[0].files.map((file) => {
                                    return (
                                        <FileDetails
                                            key={file.id}
                                            file_name={file.file_name}
                                            file_size={file.file_size}
                                            is_primary={file.is_primary}
                                        >
                                            {file.is_primary !== true && (
                                                <Label tabIndex={0}>
                                                    <p className="py-2.5 px-6 font-[500] text-foreground text-base cursor-pointer bg-background hover:bg-background/75 rounded-lg">
                                                        Replace file
                                                    </p>
                                                </Label>
                                            )}
                                        </FileDetails>
                                    );
                                })}

                            {/* // TODO: ADD Additional file uploads */}
                        </ContentWrapperCard>

                        {/* // TODO: Add dependency thing */}
                        {/* <ContentWrapperCard>2</ContentWrapperCard> */}
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
                                value={releaseChannel}
                                onValueChange={(value) => {
                                    setReleaseChannel(value as ReleaseChannels);
                                }}
                            >
                                <SelectTrigger className="w-full min-w-[24ch]" id="version-release-channel-selector">
                                    <SelectValue />
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
                                initialSelected={loaders?.map((val) => val)}
                                setSelectedValues={setLoaders}
                            />
                        </div>
                        <div className="w-full flex flex-col">
                            <Label className="font-semibold text-foreground text-lg">Game versions</Label>
                            <MultiSelectInput
                                options={(() => {
                                    const list = [];
                                    for (const version of GameVersions) {
                                        if (version.releaseType === ReleaseChannels.RELEASE) list.push(version.version);
                                    }
                                    return list;
                                })()}
                                inputPlaceholder="Choose versions.."
                                input_id={"supported-game-version-filter-input"}
                                initialSelected={supportedGameVersions?.map((val) => val)}
                                setSelectedValues={setSupportedGameVersions}
                            />
                        </div>
                    </ContentWrapperCard>
                </div>
                {loading ? <AbsolutePositionedSpinner /> : null}
            </div>
        </>
    );
};

export default EditVersionPage;
