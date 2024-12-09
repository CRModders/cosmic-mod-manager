import { useParams } from "react-router";
import type { DependencyData } from "@root/types";
import { cn, getProjectPagePathname, getProjectVersionPagePathname, imageUrl, projectFileUrl } from "@root/utils";
import { formatGameVersionsListString } from "@root/utils/version";
import { CapitalizeAndFormatString, doesMemberHaveAccess, parseFileSize } from "@shared/lib/utils";
import { ProjectPermission } from "@shared/types";
import type { ProjectDetailsData, ProjectVersionData, TeamMember } from "@shared/types/api";
import { ChevronRightIcon, CopyIcon, DownloadIcon, Edit3Icon, FileIcon, FlagIcon, LinkIcon, StarIcon } from "lucide-react";
import { lazy, Suspense, useContext } from "react";
import { DownloadAnimationContext } from "~/components/download-animation";
import { fallbackProjectIcon } from "~/components/icons";
import MarkdownRenderBox from "~/components/layout/md-editor/render-md";
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
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "~/components/ui/context-menu";
import CopyBtn, { copyTextToClipboard } from "~/components/ui/copy-btn";
import { FormattedDate } from "~/components/ui/date";
import Link, { useCustomNavigate, VariantButtonLink } from "~/components/ui/link";
import ReleaseChannelChip from "~/components/ui/release-channel-pill";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import NotFoundPage from "~/routes/$";
import { ProjectMember } from "../layout";

const DeleteVersionDialog = lazy(() => import("./delete-version"));

interface Props {
    projectData: ProjectDetailsData;
    allProjectVersions: ProjectVersionData[];
    projectDependencies: DependencyData;
    currUsersMembership: TeamMember | null;
}

export default function VersionPage({ projectData, allProjectVersions, projectDependencies, currUsersMembership }: Props) {
    const { projectSlug, versionSlug } = useParams();
    const customNavigate = useCustomNavigate();
    const { show: showDownloadAnimation } = useContext(DownloadAnimationContext);
    const projectType = projectData?.type[0] || "";
    let versionData = allProjectVersions?.find((version) => version.slug === versionSlug || version.id === versionSlug);
    if (versionSlug === "latest") versionData = allProjectVersions[0];

    if (!versionData || !projectSlug || !versionSlug)
        return (
            <NotFoundPage
                className="no_full_page py-16"
                title="Version not found"
                description="The version you are looking for doesn't exist"
                linkLabel="See versions list"
                linkHref={`${getProjectPagePathname(projectType, projectSlug || "")}/versions`}
            />
        );

    const projectPageUrl = getProjectPagePathname(projectType, projectSlug);

    return (
        <>
            <Card className="w-full flex flex-col items-start justify-start p-card-surround gap-4">
                <Breadcrumb>
                    <BreadcrumbList className="flex items-center">
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`${projectPageUrl}/versions`} className="text-base">
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

                <div className="w-full flex flex-wrap items-center justify-start gap-x-4">
                    <h1 className="text-2xl font-[700] text-foreground leading-tight">{versionData.title}</h1>
                    {versionData.featured ? (
                        <span className="flex items-center justify-center gap-1 text-extra-muted-foreground italic">
                            <StarIcon className="w-btn-icon h-btn-icon" />
                            Featured
                        </span>
                    ) : null}
                </div>

                <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <VariantButtonLink
                                    variant={"default"}
                                    url={versionData.primaryFile?.url ? projectFileUrl(versionData.primaryFile?.url) : ""}
                                    onClick={showDownloadAnimation}
                                >
                                    <DownloadIcon className="w-btn-icon h-btn-icon" />
                                    Download
                                </VariantButtonLink>
                            </TooltipTrigger>
                            <TooltipContent>
                                {versionData.primaryFile?.name} ({parseFileSize(versionData.primaryFile?.size || 0)})
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {!currUsersMembership?.userId ? (
                        <Button variant={"secondary"}>
                            <FlagIcon className="w-btn-icon h-btn-icon" />
                            Report
                        </Button>
                    ) : null}

                    {currUsersMembership?.id &&
                    currUsersMembership?.id &&
                    doesMemberHaveAccess(ProjectPermission.UPLOAD_VERSION, currUsersMembership.permissions, currUsersMembership.isOwner) ? (
                        <VariantButtonLink url="edit" prefetch="render">
                            <Edit3Icon className="w-btn-icon h-btn-icon" />
                            Edit
                        </VariantButtonLink>
                    ) : null}

                    {currUsersMembership?.id &&
                    doesMemberHaveAccess(ProjectPermission.DELETE_VERSION, currUsersMembership.permissions, currUsersMembership.isOwner) ? (
                        <Suspense>
                            <DeleteVersionDialog
                                projectData={projectData}
                                projectSlug={projectData?.slug || ""}
                                versionSlug={versionData.slug}
                                featured={versionData.featured}
                            />
                        </Suspense>
                    ) : null}
                </div>
            </Card>

            <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_min-content] gap-panel-cards items-start justify-start">
                <div className="overflow-auto flex flex-col gap-panel-cards items-start justify-start">
                    {versionData.changelog?.length ? (
                        <ContentCardTemplate title="Changelog">
                            <MarkdownRenderBox text={versionData.changelog} />
                        </ContentCardTemplate>
                    ) : null}

                    {versionData.dependencies.length ? (
                        <ContentCardTemplate title="Dependencies" className="gap-2">
                            {versionData.dependencies.map((dependency) => {
                                const dependencyProject = projectDependencies.projects.find(
                                    (project) => project.id === dependency.projectId,
                                );
                                const dependencyVersion = projectDependencies.versions.find(
                                    (version) => version.id === dependency.versionId,
                                );

                                if (!dependencyProject?.id) return null;
                                const dependencyProjectPageUrl = getProjectPagePathname(dependencyProject.type[0], dependencyProject.slug);
                                const dependencyVersionPageUrl = dependencyVersion?.id
                                    ? getProjectVersionPagePathname(
                                          dependencyProject.type[0],
                                          dependencyProject.slug,
                                          dependencyVersion.slug,
                                      )
                                    : null;

                                const redirectUrl = dependencyVersionPageUrl || dependencyProjectPageUrl;

                                return (
                                    <Link
                                        to={redirectUrl}
                                        key={`${dependencyProject.id}-${dependencyVersion?.id}`}
                                        className="bg_hover_stagger w-full flex items-center justify-start gap-3 text-muted-foreground hover:bg-background/75 cursor-pointer p-2 rounded-lg "
                                    >
                                        <ImgWrapper
                                            vtId={dependencyProject.id}
                                            src={imageUrl(dependencyProject.icon)}
                                            alt={dependencyProject.name}
                                            className="h-12 w-12"
                                            fallback={fallbackProjectIcon}
                                        />
                                        <div className="flex flex-col items-start justify-center">
                                            <span className="font-bold">{dependencyProject.name}</span>
                                            <span className="text-muted-foreground/85">
                                                {dependencyVersion?.id ? (
                                                    <>
                                                        Version {dependencyVersion.versionNumber} is {dependency.dependencyType}
                                                    </>
                                                ) : (
                                                    <>{CapitalizeAndFormatString(dependency.dependencyType)}</>
                                                )}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </ContentCardTemplate>
                    ) : null}

                    <ContentCardTemplate title="Files" className="gap-2">
                        {versionData.primaryFile?.id ? (
                            <FileDetailsItem
                                fileName={versionData.primaryFile.name}
                                fileSize={versionData.primaryFile.size}
                                isPrimary={true}
                                downloadLink={projectFileUrl(versionData.primaryFile.url)}
                                sha1_hash={versionData.primaryFile.sha1_hash}
                                sha512_hash={versionData.primaryFile.sha512_hash}
                                showDownloadAnimation={showDownloadAnimation}
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
                                          sha1_hash={file.sha1_hash}
                                          sha512_hash={file.sha512_hash}
                                          showDownloadAnimation={showDownloadAnimation}
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
                                content: versionData.loaders.length ? (
                                    <span className="leading-none">
                                        {versionData.loaders.map((loader) => CapitalizeAndFormatString(loader)).join(", ")}
                                    </span>
                                ) : null,
                            },
                            {
                                label: "Game versions",
                                content: <span className="leading-none"> {formatGameVersionsListString(versionData.gameVersions)} </span>,
                            },
                            {
                                label: "Downloads",
                                content: <span className="leading-none"> {versionData.downloads} </span>,
                            },
                            {
                                label: "Publication date",
                                content: (
                                    <span className="leading-none">
                                        <FormattedDate date={versionData.datePublished} />
                                    </span>
                                ),
                            },
                            {
                                label: "Publisher",
                                content: (
                                    <ProjectMember
                                        userName={versionData.author.userName}
                                        avatarImageUrl={versionData.author.avatar || ""}
                                        isOwner={false}
                                        roleName={versionData.author.role}
                                    />
                                ),
                            },
                            {
                                label: "Version ID",
                                content: <CopyBtn text={versionData.id} id="version-page-version-id" label={versionData.id} />,
                            },
                        ].map((item) => {
                            if (!item.content) return null;

                            return (
                                <div key={item.label} className="w-full flex flex-col items-start justify-start gap-1.5">
                                    <span className="font-bold leading-none">{item.label}</span>
                                    {item.content}
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </>
    );
}

interface FileDetailsItemProps {
    fileName: string;
    fileSize: number;
    isPrimary: boolean;
    downloadLink: string;
    sha1_hash: string | null;
    sha512_hash: string | null;
    showDownloadAnimation?: () => void;
}

const FileDetailsItem = ({
    fileName,
    fileSize,
    isPrimary,
    downloadLink,
    sha1_hash,
    sha512_hash,
    showDownloadAnimation,
}: FileDetailsItemProps) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    className={cn(
                        "w-full flex flex-wrap sm:flex-nowrap items-center justify-between rounded px-4 py-2.5 pr-3 gap-x-4 gap-y-2 cursor-context-menu",
                        isPrimary ? "bg-shallow-background" : "bg-shallow-background/70",
                    )}
                >
                    <div className="flex items-center justify-start gap-1.5">
                        <FileIcon
                            className={cn(
                                "flex-shrink-0 w-btn-icon h-btn-icon text-muted-foreground",
                                !isPrimary && "text-extra-muted-foreground",
                            )}
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
                        variant={isPrimary ? "secondary-dark" : "ghost"}
                        url={downloadLink}
                        className={cn(
                            !isPrimary && "no_neumorphic_shadow hover:bg-transparent dark:hover:bg-transparent hover:text-foreground",
                        )}
                        onClick={showDownloadAnimation}
                    >
                        <DownloadIcon className="w-btn-icon h-btn-icon" />
                        Download
                    </VariantButtonLink>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem className="flex gap-2" onClick={() => copyTextToClipboard(sha1_hash)}>
                    <CopyIcon className="w-btn-icon-sm h-btn-icon-sm text-extra-muted-foreground" />
                    Copy sha1 hash
                </ContextMenuItem>

                <ContextMenuItem className="flex gap-2" onClick={() => copyTextToClipboard(sha512_hash)}>
                    <CopyIcon className="w-btn-icon-sm h-btn-icon-sm text-extra-muted-foreground" />
                    Copy sha512 hash
                </ContextMenuItem>

                <ContextMenuItem className="flex gap-2" onClick={() => copyTextToClipboard(downloadLink)}>
                    <LinkIcon className="w-btn-icon-sm h-btn-icon-sm text-extra-muted-foreground" />
                    Copy file URL
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};
