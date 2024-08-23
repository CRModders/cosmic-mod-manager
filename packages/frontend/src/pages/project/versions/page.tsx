import PaginatedNavigation from "@/components/pagination-nav";
import { Card } from "@/components/ui/card";
import { VariantButtonLink } from "@/components/ui/link";
import ReleaseChannelChip from "@/components/ui/release-channel-pill";
import { FullWidthSpinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { formatVersionsListString } from "@/lib/semver";
import { formatDate, getProjectPagePathname, getProjectVersionPagePathname, projectFileUrl } from "@/lib/utils";
import { useSession } from "@/src/contexts/auth";
import { projectContext } from "@/src/contexts/curr-project";
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
import { SITE_NAME_SHORT } from "@shared/config";
import { CapitalizeAndFormatString, isUserAProjectMember, parseFileSize } from "@shared/lib/utils";
import { ProjectPermissions } from "@shared/types";
import type { ProjectDetailsData, ProjectVersionData } from "@shared/types/api";
import { DownloadIcon, InfoIcon, UploadIcon } from "lucide-react";
import { useContext, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ProjectVersionsPage = () => {
    const { projectData, allProjectVersions } = useContext(projectContext);
    const { session } = useSession();
    const projectMembership = useMemo(() => {
        return isUserAProjectMember(session?.id, projectData?.members);
    }, [session, projectData?.members]);

    if (projectData === undefined || allProjectVersions === undefined) {
        return <FullWidthSpinner />;
    }

    if (projectData === null || allProjectVersions === null) return null;

    return (
        <>
            <div className="grid gap-panel-cards [grid-area:_content]">
                {/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
                {projectMembership && projectMembership?.permissions?.includes(ProjectPermissions.UPLOAD_VERSION) ? (
                    <UploadVersionLinkCard uploadPageUrl={`${getProjectPagePathname(projectData.type[0], projectData.slug)}/version/new`} />
                ) : null}

                <ProjectVersionsListTable projectData={projectData} allProjectVersions={allProjectVersions} />
            </div>
            <div className="grid [grid-area:_sidebar]">
                <span className="text-extra-muted-foreground italic">TODO: ADD FILTERS</span>
            </div>
        </>
    );
};

export default ProjectVersionsPage;

const UploadVersionLinkCard = ({ uploadPageUrl }: { uploadPageUrl: string }) => {
    return (
        <Card className="p-card-surround w-full flex flex-row flex-wrap items-center justify-start gap-x-4 gap-y-2">
            <VariantButtonLink url={uploadPageUrl} variant={"default"}>
                <UploadIcon className="w-btn-icon h-btn-icon" />
                Upload a version
            </VariantButtonLink>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <InfoIcon className="h-btn-icon w-btn-icon" />
                Upload a new project version
            </div>
        </Card>
    );
};

const ProjectVersionsListTable = ({
    projectData,
    allProjectVersions,
}: { projectData: ProjectDetailsData; allProjectVersions: ProjectVersionData[] }) => {
    const pageSearchParamKey = "page";
    const [urlSearchParams] = useSearchParams();
    const perPageLimit = 20;
    const page = urlSearchParams.get(pageSearchParamKey) || "1";
    const pagesCount = Math.ceil((allProjectVersions?.length || 0) / perPageLimit);
    const activePage = Number.parseInt(page) <= pagesCount ? Number.parseInt(page) : 1;
    const navigate = useNavigate();

    const versionPagePathname = (versionSlug: string) => getProjectVersionPagePathname(projectData.type[0], projectData.slug, versionSlug);

    const Pagination =
        (allProjectVersions?.length || 0) > perPageLimit ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageSearchParamKey} />
        ) : null;

    return (
        <>
            <Helmet>
                <title>
                    {projectData?.name || ""} - Versions | {SITE_NAME_SHORT}
                </title>
            </Helmet>

            <div className="w-full flex flex-col gap-2 items-center justify-center" id="all-versions">
                {Pagination ? <div className="w-full flex items-center justify-center">{Pagination}</div> : null}
                {allProjectVersions?.length ? (
                    <Card className="w-full p-0 overflow-hidden">
                        <div className="w-full flex flex-col gap-2 items-center justify-center">
                            <Table className="font-[500]">
                                <TableHeader>
                                    <TableRow className="border-none">
                                        <TableHead className="overflow-hidden min-w-20 font-semibold text-foreground text-lg h-14" />
                                        <TableHead className="overflow-hidden min-w-48 w-[35%] font-semibold text-foreground text-lg h-14">
                                            Version
                                        </TableHead>
                                        <TableHead className="overflow-hidden min-w-36 w-[35%] font-semibold text-foreground text-lg h-14">
                                            Supports
                                        </TableHead>
                                        <TableHead className="overflow-hidden min-w-36 w-[25%] font-semibold text-foreground text-lg h-14">
                                            Stats
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-foreground dark:text-muted-foreground">
                                    <TooltipProvider>
                                        {allProjectVersions
                                            .slice((activePage - 1) * perPageLimit, activePage * perPageLimit)
                                            .map((version, i) => (
                                                <TableRow
                                                    className="border-none cursor-pointer"
                                                    key={`${version.id}-${i}`}
                                                    onClick={(e) => {
                                                        // @ts-expect-error
                                                        if (!e.target.closest(".noClickRedirect")) {
                                                            navigate(versionPagePathname(version?.slug));
                                                        }
                                                    }}
                                                >
                                                    <TableCell className="align-top text-foreground pr-2">
                                                        <div className="flex items-start justify-end mt-0.5">
                                                            {version.primaryFile ? (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div>
                                                                            <VariantButtonLink
                                                                                variant="default"
                                                                                size="icon"
                                                                                url={projectFileUrl(version.primaryFile.url)}
                                                                                className="noClickRedirect"
                                                                            >
                                                                                <DownloadIcon className="w-btn-icon h-btn-icon" />
                                                                            </VariantButtonLink>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        {version.primaryFile.name} (
                                                                        {parseFileSize(version.primaryFile.size)})
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            ) : null}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="align-top">
                                                        <div className="flex flex-col items-start justify-start gap-1">
                                                            <Link
                                                                to={versionPagePathname(version.slug)}
                                                                className="noClickRedirect leading-none"
                                                            >
                                                                <span className="font-semibold leading-none">{version.title}</span>
                                                            </Link>

                                                            <div className="flex flex-wrap gap-1 items-center justify-start">
                                                                <ReleaseChannelChip releaseChannel={version.releaseChannel} />
                                                                <span className="leading-tight">{version.versionNumber}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="align-top">
                                                        <div className="flex flex-col items-start justify-center gap-1">
                                                            <span className="leading-none">
                                                                {version.loaders
                                                                    .map((loader) => CapitalizeAndFormatString(loader))
                                                                    .join(", ")}
                                                            </span>
                                                            <span className="leading-tight">
                                                                {formatVersionsListString(version.gameVersions)}
                                                            </span>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="align-top">
                                                        <div className="flex flex-col items-start justify-start gap-1.5">
                                                            <span className="leading-none">
                                                                Published on{" "}
                                                                <em className="font-semibold not-italic">
                                                                    {formatDate(
                                                                        new Date(version.datePublished),
                                                                        "${month} ${day}, ${year}",
                                                                    )}
                                                                </em>
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TooltipProvider>
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                ) : null}
                {Pagination ? <div className="w-full flex items-center justify-center">{Pagination}</div> : null}
            </div>
        </>
    );
};
