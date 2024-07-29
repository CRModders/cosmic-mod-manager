import CopyBtn from "@/components/copy-btn";
import { ChevronRightIcon, DownloadIcon, EditIcon, FlagIcon, TrashIcon } from "@/components/icons";
import MarkdownRenderBox from "@/components/md-render-box";
import { ContentWrapperCard } from "@/components/panel-layout";
import ReleaseChannelIndicator from "@/components/release-channel-pill";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { FormatVersionsList } from "@/lib/semver";
import { constructVersionPageUrl } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { useIsUseAProjectMember } from "@/src/hooks/project-member";
import NotFoundPage from "@/src/not-found";
import { Projectcontext } from "@/src/providers/project-context";
import { DialogTitle } from "@radix-ui/react-dialog";
import { StarIcon } from "@radix-ui/react-icons";
import { CapitalizeAndFormatString, formatDate, getProjectPagePathname, getVersionPagePathname } from "@root/lib/utils";
import type { ProjectVersionData } from "@root/types";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProjectMember } from "../layout";
import FileDetails from "@/components/file-details";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const getVersionData = async (projectUrlSlug: string, versionUrlSlug: string) => {
    try {
        const response = await useFetch(`/api/project/${projectUrlSlug}/version/${versionUrlSlug}`);
        return (await response.json())?.data || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default function ProjectVersionPage({ projectType }: { projectType: string }) {
    const { projectUrlSlug, versionUrlSlug } = useParams();
    const { projectData, fetchFeaturedProjectVersions, fetchAllProjectVersions } = useContext(Projectcontext);
    const isAProjectMember = useIsUseAProjectMember();
    const [deleteVersionDialogOpen, setDeleteVersionDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const versionData = useQuery<ProjectVersionData>({
        queryKey: [`version-${versionUrlSlug}-data`],
        queryFn: () => getVersionData(projectUrlSlug || "", versionUrlSlug || ""),
    });

    const deleteVersion = async () => {
        setLoading(true);

        const response = await useFetch(`/api/project/${projectUrlSlug}/version/${versionUrlSlug}/delete`);
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

        navigate(`${getProjectPagePathname(projectType, projectUrlSlug)}/versions`);

        if (versionData.data?.versions[0].is_featured === true) {
            await Promise.all([fetchAllProjectVersions(), fetchFeaturedProjectVersions()]);
        } else {
            await fetchAllProjectVersions();
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (versionData.data?.versions[0].url_slug) {
            const constructedUrl = constructVersionPageUrl(versionData.data.versions[0].url_slug);
            if (window.location.href.replace(window.location.origin, "") !== constructedUrl) {
                navigate(constructedUrl);
            }
        }
    }, [versionData]);

    useEffect(() => {
        setLoading(versionData.isLoading);
    }, [versionData.isLoading]);

    if (loading === true) {
        return (
            <div className="w-full flex items-center justify-center py-4">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (versionData.data === null) {
        return <NotFoundPage />;
    }

    return (
        <div className="w-full flex flex-col gap-card-gap relative" id="version-details">
            <Helmet>
                <title>{`${projectData?.name} ${versionData.data?.versions[0].version_number} | CRMM`}</title>
                <meta name="description" content={projectData?.summary} />
            </Helmet>

            {!versionData.data ? null : (
                <>
                    <ContentWrapperCard className="items-start gap-4">
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
                                        <BreadcrumbPage className="text-base">
                                            {versionData.data?.versions[0].version_title}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="w-full flex gap-4 items-center justify-start py-2">
                            <h1 className=" text-foreground font-semibold text-3xl">
                                {versionData.data?.versions[0].version_title}
                            </h1>
                            {versionData.data?.versions[0].is_featured && (
                                <>
                                    <div className="flex items-center justify-center gap-1 text-foreground-muted">
                                        <StarIcon className="w-4 h-4" />
                                        <span>Featured</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-x-3 gap-y-2">
                            <a
                                href={`${serverUrl}/api/file/${encodeURIComponent(versionData.data?.versions[0].files[0].file_url || "")}`}
                                aria-label={`Download ${versionData.data?.versions[0].files[0].file_name}`}
                            >
                                <Button className="gap-2" tabIndex={-1}>
                                    <DownloadIcon size="1.15rem" />
                                    Download
                                </Button>
                            </a>

                            <Button variant={"secondary"} className="gap-2">
                                <FlagIcon size="1rem" />
                                Report
                            </Button>

                            {isAProjectMember === true && (
                                <>
                                    <Link
                                        to={`${getVersionPagePathname(projectType, projectUrlSlug, versionData.data?.versions[0].url_slug)}/edit`}
                                    >
                                        <Button variant={"secondary"} className="gap-2" tabIndex={-1}>
                                            <EditIcon className="w-4 h-4" />
                                            Edit
                                        </Button>
                                    </Link>

                                    <Dialog open={deleteVersionDialogOpen} onOpenChange={setDeleteVersionDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant={"secondary"} className="gap-2 text-danger-text">
                                                <TrashIcon size="1rem" />
                                                <p>Delete</p>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="font-semibold text-foreground-muted text-lg">
                                                    Delete version{" "}
                                                    <span className="italic font-normal">
                                                        {versionData.data?.versions[0].version_title}
                                                    </span>
                                                </DialogTitle>
                                            </DialogHeader>
                                            <p className="text-foreground-muted">
                                                Are you sure you want to delete version{" "}
                                                <span className=" font-semibold">
                                                    {versionData.data?.versions[0].version_title}
                                                </span>{" "}
                                                of project <span className=" font-semibold">{projectData?.name}</span> ?
                                            </p>
                                            <DialogFooter className="flex flex-row items-center justify-end">
                                                <DialogClose asChild>
                                                    <Button variant={"secondary"}>Cancel</Button>
                                                </DialogClose>
                                                <Button
                                                    className="gap-2"
                                                    variant={"destructive"}
                                                    onClick={deleteVersion}
                                                >
                                                    <TrashIcon size="1.25rem" />
                                                    Delete
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </>
                            )}
                        </div>
                    </ContentWrapperCard>

                    <div className="w-full gap-card-gap grid grid-cols-1 xl:grid-cols-[1fr_min-content]">
                        <div className="w-full flex flex-col gap-card-gap">
                            {versionData.data?.versions[0]?.changelog?.length ? (
                                <ContentWrapperCard className="w-full items-start flex-wrap">
                                    <h1 className="text-foreground font-semibold text-xl">Changelog</h1>
                                    <MarkdownRenderBox text={versionData.data?.versions[0]?.changelog} />
                                </ContentWrapperCard>
                            ) : null}

                            <ContentWrapperCard className="items-start">
                                <h1 className="text-foreground font-semibold text-xl">Files</h1>
                                <div className="w-full flex flex-col gap-4">
                                    {versionData.data?.versions[0]?.files?.map((file) => {
                                        return (
                                            <FileDetails
                                                key={file.id}
                                                file_name={file.file_name}
                                                file_size={file.file_size}
                                                is_primary={file.is_primary}
                                            >
                                                <a
                                                    href={`${serverUrl}/api/file/${encodeURIComponent(versionData.data?.versions[0].files[0].file_url)}`}
                                                    aria-label={`Download ${versionData.data?.versions[0].files[0].file_name}`}
                                                >
                                                    <Button
                                                        className="bg-background hover:bg-background/75"
                                                        tabIndex={-1}
                                                        variant={"secondary"}
                                                    >
                                                        <DownloadIcon size="1.1rem" />
                                                        Download
                                                    </Button>
                                                </a>
                                            </FileDetails>

                                            // <div
                                            //     key={versionFile.id}
                                            //     className={cn(
                                            //         "w-full flex flex-wrap sm:flex-nowrap items-center justify-between px-6 py-3 gap-x-4 gap-y-2 rounded-lg border-2 border-border",
                                            //         versionFile.is_primary === true && "bg-bg-hover",
                                            //     )}
                                            // >
                                            //     <div className="flex items-center gap-x-2 flex-wrap">
                                            //         <div className="flex items-center justify-center gap-2">
                                            //             <FileIcon className="w-5 h-5 text-foreground-muted" />
                                            //             <p className="w-fit font-semibold text-foreground-muted mr-1">
                                            //                 {versionFile.file_name}
                                            //             </p>
                                            //         </div>
                                            //         <span className="text-sm text-foreground-muted">
                                            //             {parseFileSize(versionFile.file_size)}
                                            //         </span>
                                            //         {versionFile.is_primary ? (
                                            //             <span className="text-sm text-foreground-muted italic">
                                            //                 Primary
                                            //             </span>
                                            //         ) : null}
                                            //     </div>

                                            //     <a
                                            //         href={`${serverUrl}/api/file/${encodeURIComponent(versionData.data?.versions[0].files[0].file_url)}`}
                                            //         aria-label={`Download ${versionData.data?.versions[0].files[0].file_name}`}
                                            //     >
                                            //         <Button
                                            //             className="bg-background"
                                            //             tabIndex={-1}
                                            //             variant={"secondary"}
                                            //         >
                                            //             <DownloadIcon size="1.15rem" />
                                            //             Download
                                            //         </Button>
                                            //     </a>
                                            // </div>
                                        );
                                    })}
                                </div>
                            </ContentWrapperCard>
                        </div>

                        <ContentWrapperCard className="h-fit min-w-[20rem]">
                            <h1 className="text-foreground font-semibold text-xl">Metadata</h1>

                            <div className="w-full flex flex-col gap-4">
                                {[
                                    {
                                        label: "Release channel",
                                        element: (
                                            <ReleaseChannelIndicator
                                                release_channel={versionData.data?.versions[0].release_channel || ""}
                                            />
                                        ),
                                    },
                                    {
                                        label: "Version number",
                                        element: (
                                            <p className="text-foreground-muted leading-none text-base">
                                                {versionData.data?.versions[0].version_number}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Loaders",
                                        element: (
                                            <p className="text-foreground-muted leading-none text-base">
                                                {versionData.data?.versions[0].supported_loaders
                                                    .map((loader) => CapitalizeAndFormatString(loader))
                                                    .join(", ")}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Game versions",
                                        element: (
                                            <p className="text-foreground-muted leading-tight text-pretty text-base">
                                                {FormatVersionsList(
                                                    versionData.data.versions[0].supported_game_versions,
                                                )}
                                            </p>
                                        ),
                                    },
                                    // TODO: ADD THIS BACK WHEN IMPLEMENTED
                                    // {
                                    // 	label: "Downloads",
                                    // 	element: <p className="text-foreground-muted leading-none text-base px-1">{"// Not implemented yet"}</p>,
                                    // },
                                    {
                                        label: "Publication date",
                                        element: (
                                            <p className="text-foreground-muted leading-none text-base">
                                                {formatDate(
                                                    new Date(versionData.data?.versions[0].published_on),
                                                    "${month} ${day}, ${year} at ${hours}:${minutes} ${amPm}",
                                                )}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Publisher",
                                        element: (
                                            <ProjectMember
                                                username={versionData.data?.versions[0].publisher.user.user_name}
                                                role={versionData.data?.versions[0].publisher.role_title}
                                                role_title={versionData.data?.versions[0].publisher.role_title}
                                                avatar_image={versionData.data?.versions[0].publisher.user.avatar_image}
                                            />
                                        ),
                                    },
                                    {
                                        label: "Version ID",
                                        element: (
                                            <div className="w-full flex items-center justify-start">
                                                <CopyBtn
                                                    text={versionData.data?.versions[0].id}
                                                    label={`${versionData.data?.versions[0].id.slice(0)}`}
                                                    className="px-1"
                                                    labelClassName="text-foreground-muted"
                                                />
                                            </div>
                                        ),
                                    },
                                ].map((item) => {
                                    return (
                                        <div key={item.label} className="w-full flex flex-col">
                                            <p className="text-lg font-semibold dark:text-foreground-muted">
                                                {item.label}
                                            </p>
                                            {item.element}
                                        </div>
                                    );
                                })}
                            </div>
                        </ContentWrapperCard>
                    </div>
                </>
            )}

            {loading || !versionData.data ? (
                <div className="w-full flex items-center justify-center py-4">
                    <LoadingSpinner size="lg" />
                </div>
            ) : null}
        </div>
    );
}
