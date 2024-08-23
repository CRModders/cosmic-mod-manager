import MarkdownRenderBox from "@/components/layout/md-editor/render-md";
import { ContentCardTemplate } from "@/components/layout/panel";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CopyBtn from "@/components/ui/copy-btn";
import { VariantButtonLink } from "@/components/ui/link";
import ReleaseChannelChip from "@/components/ui/release-channel-pill";
import { formatVersionsListString } from "@/lib/semver";
import { cn, formatDate, getProjectPagePathname, projectFileUrl } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import NotFoundPage from "@/src/pages/not-found";
import { SITE_NAME_SHORT } from "@shared/config";
import { CapitalizeAndFormatString, parseFileSize } from "@shared/lib/utils";
import { ProjectPermissions } from "@shared/types";
import { ChevronRightIcon, DownloadIcon, EditIcon, FileIcon, FlagIcon, StarIcon } from "lucide-react";
import { Suspense, lazy, useContext } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { ProjectMember, fullWidthLayoutStyles } from "../../layout";

const DeleteVersionDialog = lazy(() => import("./delete-version"));

const VersionPage = ({ projectType }: { projectType: string }) => {
    const { slug: projectSlug, versionSlug } = useParams();
    const { projectData, currUsersMembership, allProjectVersions } = useContext(projectContext);
    const versionData = allProjectVersions?.filter((version) => {
        if (version.slug === versionSlug) return version;
    })[0];

    if (allProjectVersions?.length && !versionData?.title) {
        return (
            <NotFoundPage
                className="no_full_page py-16"
                title="Version not found"
                description="The version you are looking for doesn't exist"
                linkLabel="Versions"
                linkHref={`${getProjectPagePathname(projectType, projectSlug || "")}/versions`}
            />
        );
    }

    if (!versionData?.title || !projectSlug || !versionSlug) return null;

    return (
        <>
            <Helmet>
                <title>
                    {versionData.title} - {projectData?.name || ""} | {SITE_NAME_SHORT}
                </title>
            </Helmet>

            <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_min-content] gap-panel-cards items-start justify-start"
                style={fullWidthLayoutStyles}
            >
                <div className="w-full flex flex-col gap-panel-cards items-start justify-start">
                    <Card className="w-full flex flex-col items-start justify-start p-card-surround gap-3">
                        <Breadcrumb>
                            <BreadcrumbList className="flex items-center">
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={`${getProjectPagePathname(projectType, projectSlug)}/versions`}
                                        className="text-base"
                                    >
                                        Versions
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="flex items-center justify-center">
                                    <ChevronRightIcon size="1rem" className=" text-foreground" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-base">{versionData?.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="w-full flex flex-wrap items-center justify-start gap-8">
                            <h1 className="text-2xl font-[700] text-muted-foreground">{versionData.title}</h1>
                            {
                                versionData.featured ? (
                                    <span className="flex items-center justify-center gap-1 text-extra-muted-foreground italic">
                                        <StarIcon className="w-btn-icon h-btn-icon" />
                                        Featured
                                    </span>
                                ) : null
                            }
                        </div>

                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                            <VariantButtonLink
                                variant={"default"}
                                url={versionData.primaryFile?.url ? projectFileUrl(versionData.primaryFile?.url) : ""}
                            >
                                <DownloadIcon className="w-btn-icon h-btn-icon" />
                                Download
                            </VariantButtonLink>

                            <Button variant={"secondary"}>
                                <FlagIcon className="w-btn-icon h-btn-icon" />
                                Report
                            </Button>

                            {currUsersMembership?.id && currUsersMembership.permissions.includes(ProjectPermissions.UPLOAD_VERSION) ? (
                                <VariantButtonLink url="edit">
                                    <EditIcon className="w-btn-icon h-btn-icon" />
                                    Edit
                                </VariantButtonLink>
                            ) : null}

                            {currUsersMembership?.id && currUsersMembership.permissions.includes(ProjectPermissions.DELETE_VERSION) ? (
                                <Suspense>
                                    <DeleteVersionDialog
                                        projectSlug={projectData?.slug || ""}
                                        versionSlug={versionData.slug}
                                        featured={versionData.featured}
                                    />
                                </Suspense>
                            ) : null}
                        </div>
                    </Card>

                    {versionData.changelog?.length ? (
                        <ContentCardTemplate title="Changelog">
                            <MarkdownRenderBox text={versionData.changelog} />
                        </ContentCardTemplate>
                    ) : null}

                    <ContentCardTemplate title="Files" className="gap-2">
                        {versionData.primaryFile?.id ? (
                            <FileDetailsItem
                                fileName={versionData.primaryFile.name}
                                fileSize={versionData.primaryFile.size}
                                isPrimary={true}
                                downloadLink={projectFileUrl(versionData.primaryFile.url)}
                            />
                        ) : null}

                        {versionData.files?.length
                            ? versionData.files.map((file) => {
                                if (file.isPrimary) return null;
                                return (
                                    <FileDetailsItem
                                        key={file.id}
                                        fileName={file.name}
                                        fileSize={file.size}
                                        isPrimary={false}
                                        downloadLink={projectFileUrl(file.url)}
                                    />
                                );
                            })
                            : null}
                    </ContentCardTemplate>
                </div>

                <Card className="p-card-surround grid grid-cols-1 w-full sm:min-w-[19rem] text-muted-foreground gap-3">
                    <h3 className="text-lg font-bold text-foreground">Metadata</h3>
                    <div className="grid grid-cols-1 gap-5">
                        {[
                            {
                                label: "Release channel",
                                content: <ReleaseChannelChip releaseChannel={versionData.releaseChannel} className="mt-0.5" />,
                            },
                            {
                                label: "Version number",
                                content: <span className="leading-none">{versionData.versionNumber}</span>,
                            },
                            {
                                label: "Loaders",
                                content: (
                                    <span className="leading-none">
                                        {versionData.loaders.map((loader) => CapitalizeAndFormatString(loader)).join(", ")}
                                    </span>
                                ),
                            },
                            {
                                label: "Game versions",
                                content: <span className="leading-none"> {formatVersionsListString(versionData.gameVersions)} </span>,
                            },
                            {
                                label: "Publication date",
                                content: <span className="leading-none"> {formatDate(new Date(versionData.datePublished))} </span>,
                            },
                            {
                                label: "Publisher",
                                content: (
                                    <ProjectMember
                                        userName={versionData.author.userName}
                                        avatarImageUrl={versionData.author.avatarUrl || ""}
                                        isOwner={false}
                                        role={versionData.author.role}
                                    />
                                ),
                            },
                            {
                                label: "Version ID",
                                content: <CopyBtn text={versionData.id} id="version-page-version-id" label={versionData.id} />,
                            },
                        ].map((item) => (
                            <div key={item.label} className="w-full flex flex-col items-start justify-start gap-1.5">
                                <span className="font-bold leading-none">{item.label}</span>
                                {item.content}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </>
    );
};

export default VersionPage;

interface FileDetailsItemProps {
    fileName: string;
    fileSize: number;
    isPrimary: boolean;
    downloadLink: string;
}

const FileDetailsItem = ({ fileName, fileSize, isPrimary, downloadLink }: FileDetailsItemProps) => {
    return (
        <div
            className={cn(
                "w-full flex flex-wrap sm:flex-nowrap items-center justify-between rounded px-4 py-2.5 pr-3 gap-x-4 gap-y-2",
                isPrimary ? "bg-shallow-background" : "bg-shallow-background/70",
            )}
        >
            <div className="flex items-center justify-start gap-1.5">
                <FileIcon
                    className={cn("flex-shrink-0 w-btn-icon h-btn-icon text-muted-foreground", !isPrimary && "text-extra-muted-foreground")}
                />

                <div className="flex items-center flex-wrap justify-start gap-x-2">
                    <span className={!isPrimary ? "text-muted-foreground" : ""}>
                        <strong className="font-semibold">{fileName}</strong>{" "}
                        <span className="whitespace-nowrap ml-0.5">({parseFileSize(fileSize)})</span>{" "}
                        {isPrimary ? <span className="text-muted-foreground italic ml-1">Primary</span> : null}
                    </span>
                </div>
            </div>

            <VariantButtonLink
                variant={isPrimary ? "default" : "secondary"}
                url={downloadLink}
                className={!isPrimary ? "bg-card-background hover:bg-card-background/70" : ""}
            >
                <DownloadIcon className="w-btn-icon h-btn-icon" />
                Download
            </VariantButtonLink>
        </div>
    );
};
