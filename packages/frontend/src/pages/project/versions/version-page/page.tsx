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
import ReleaseChannelIndicator from "@/components/ui/release-channel-pill";
import { formatVersionsListString } from "@/lib/semver";
import { cn, formatDate, getProjectPagePathname, getVersionFileDownloadLink } from "@/lib/utils";
import { Projectcontext } from "@/src/contexts/curr-project";
import NotFoundPage from "@/src/pages/not-found";
import { CapitalizeAndFormatString, parseFileSize } from "@shared/lib/utils";
import { ProjectPermissions } from "@shared/types";
import { ChevronRightIcon, DownloadIcon, EditIcon, FileIcon, FlagIcon, Trash2Icon } from "lucide-react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { ProjectMember } from "../../layout";

const VersionPage = ({ projectType }: { projectType: string }) => {
    const { slug: projectSlug, versionSlug } = useParams();
    const { currUsersMembership, allProjectVersions } = useContext(Projectcontext);
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
            <Card className="w-full flex flex-col items-start justify-start p-card-surround gap-3">
                <Breadcrumb>
                    <BreadcrumbList className="flex items-center">
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`${getProjectPagePathname(projectType, projectSlug)}/versions`} className="text-base">
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

                <h1 className="text-2xl font-[700] text-foreground-bright">{versionData.title}</h1>

                <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <VariantButtonLink
                        variant={"default"}
                        url={getVersionFileDownloadLink(projectSlug, versionSlug, versionData.primaryFile?.name || "")}
                    >
                        <DownloadIcon className="w-btn-icon h-btn-icon" />
                        Download
                    </VariantButtonLink>

                    <Button variant={"secondary"}>
                        <FlagIcon className="w-btn-icon h-btn-icon" />
                        Report
                    </Button>

                    {currUsersMembership?.id && currUsersMembership.permissions.includes(ProjectPermissions.UPLOAD_VERSION) ? (
                        <>
                            <VariantButtonLink url="edit">
                                <EditIcon className="w-btn-icon h-btn-icon" />
                                Edit
                            </VariantButtonLink>

                            {currUsersMembership.permissions.includes(ProjectPermissions.DELETE_VERSION) ? (
                                <Button variant={"secondary-destructive"}>
                                    <Trash2Icon className="w-btn-icon h-form-submit-btn" />
                                    Delete
                                </Button>
                            ) : null}
                        </>
                    ) : null}
                </div>
            </Card>

            <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_min-content] gap-panel-cards items-start justify-start">
                <div className="w-full flex flex-col gap-panel-cards items-start justify-start">
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
                                downloadLink={getVersionFileDownloadLink(projectSlug, versionSlug, versionData.primaryFile.name)}
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
                                          downloadLink={getVersionFileDownloadLink(projectSlug, versionSlug, file.name)}
                                      />
                                  );
                              })
                            : null}
                    </ContentCardTemplate>
                </div>

                <ContentCardTemplate
                    title="Metadata"
                    titleClassName="text-foreground-bright"
                    cardClassname="w-full min-w-[19rem]"
                    className="gap-4 text-muted-foreground"
                >
                    {[
                        {
                            label: "Release channel",
                            content: <ReleaseChannelIndicator releaseChannel={versionData.releaseChannel} className="mt-0.5" />,
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
                        <div key={item.label} className="w-full flex flex-col items-start justify-start gap-1">
                            <span className="font-bold leading-none">{item.label}</span>
                            {item.content}
                        </div>
                    ))}
                </ContentCardTemplate>
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
                "w-full flex flex-wrap sm:flex-nowrap items-center justify-between rounded px-4 py-2 gap-x-4 gap-y-2",
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
