import PaginatedNavigation from "@/components/pagination-nav";
import loaderIcons from "@/components/tag-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import { VariantButtonLink } from "@/components/ui/link";
import { ReleaseChannelBadge } from "@/components/ui/release-channel-pill";
import { FullWidthSpinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getGroupedVersionsList } from "@/lib/semver";
import { cn, getProjectPagePathname, getProjectVersionPagePathname, timeSince } from "@/lib/utils";
import { useSession } from "@/src/contexts/auth";
import { projectContext } from "@/src/contexts/curr-project";
import useTheme from "@/src/hooks/use-theme";
import { SITE_NAME_SHORT } from "@shared/config";
import { CapitalizeAndFormatString, isUserAProjectMember } from "@shared/lib/utils";
import { getLoaderFromString } from "@shared/lib/utils/convertors";
import { ProjectPermissions } from "@shared/types";
import type { ProjectDetailsData, ProjectVersionData } from "@shared/types/api";
import { CalendarIcon, DownloadIcon, InfoIcon, MoreVerticalIcon, UploadIcon } from "lucide-react";
import { useContext, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./../styles.css";

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
            {/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
            {projectMembership && projectMembership?.permissions?.includes(ProjectPermissions.UPLOAD_VERSION) ? (
                <UploadVersionLinkCard uploadPageUrl={`${getProjectPagePathname(projectData.type[0], projectData.slug)}/version/new`} />
            ) : null}

            <span className="text-extra-muted-foreground italic">TODO: ADD FILTERS</span>

            <ProjectVersionsListTable projectData={projectData} allProjectVersions={allProjectVersions} />
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

            {allProjectVersions?.length ? (
                <Card className="w-full overflow-hidden">
                    <Table>
                        <TableHeader className="hidden md:table-header-group">
                            <TableRow className="hover:bg-transparent dark:hover:bg-transparent h-16">
                                {/* MOBILE ONLY */}
                                <TableHead className="w-full grow md:hidden pl-table-side-pad-sm"> </TableHead>
                                {/* MOBILE ONLY */}
                                <TableHead className="md:hidden pr-table-side-pad-sm"> </TableHead>

                                {/* MID WIDTH AND ABOVE */}
                                <TableHead className="hidden md:table-cell w-10 pl-table-side-pad"> </TableHead>
                                {/* MID WIDTH AND ABOVE */}
                                <TableHead className="hidden md:table-cell">Name</TableHead>
                                {/* MID WIDTH AND ABOVE */}
                                <TableHead className="hidden md:table-cell">Compatibility</TableHead>

                                {/* MID WIDTH AND BELOW XL*/}
                                <TableHead className="hidden md:table-cell xl:hidden">Stats</TableHead>

                                {/* XL WIDTH AND ABOVE */}
                                <TableHead className="hidden md:hidden xl:table-cell">Published</TableHead>
                                {/* XL WIDTH AND ABOVE */}
                                <TableHead className="hidden md:hidden xl:table-cell">Downloads</TableHead>

                                {/* MID WIDTH AND ABOVE */}
                                <TableHead className="hidden md:table-cell pr-table-side-pad"> </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allProjectVersions.slice((activePage - 1) * perPageLimit, activePage * perPageLimit).map((version) => (
                                <TableRow
                                    key={version.id}
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        //@ts-expect-error
                                        if (!e.target.closest(".noClickRedirect")) {
                                            navigate(versionPagePathname(version.slug));
                                        }
                                    }}
                                >
                                    <TableCell className="md:hidden pl-table-side-pad-sm">
                                        {/* MOBILE ONLY */}
                                        <div className="w-full flex flex-col items-start justify-start gap-1.5">
                                            <div className="w-full flex items-center justify-start gap-2.5">
                                                <ReleaseChannelBadge releaseChannel={version.releaseChannel} />
                                                <VersionName
                                                    title={version.title}
                                                    number={version.versionNumber}
                                                    url={versionPagePathname(version.slug)}
                                                />
                                            </div>
                                            <div className="w-full flex flex-wrap items-center justify-start gap-1.5">
                                                <GameVersions gameVersions={version.gameVersions} />
                                                <ProjectLoaders versionLoaders={version.loaders} />
                                            </div>
                                            <div className="flex flex-wrap items-start justify-start gap-3">
                                                <DatePublished dateStr={version.datePublished} />
                                                <DownloadsCount downloads={version.downloads} />
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell pl-table-side-pad pr-2">
                                        {/* MID WIDTH AND ABOVE */}
                                        <ReleaseChannelBadge releaseChannel={version.releaseChannel} />
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell">
                                        {/* MID WIDTH AND ABOVE */}
                                        <VersionName
                                            title={version.title}
                                            number={version.versionNumber}
                                            url={versionPagePathname(version.slug)}
                                        />
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell">
                                        {/* MID WIDTH AND ABOVE */}
                                        <div className="w-full flex flex-wrap items-start justify-start gap-1.5">
                                            <GameVersions gameVersions={version.gameVersions} />
                                            <ProjectLoaders versionLoaders={version.loaders} />
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell xl:hidden">
                                        {/* MID WIDTH AND BELOW XL*/}
                                        <div className="min-w-max lex flex-wrap items-start justify-start gap-3">
                                            <DatePublished dateStr={version.datePublished} />
                                            <DownloadsCount downloads={version.downloads} />
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden md:hidden xl:table-cell">
                                        {/* XL WIDTH AND ABOVE */}
                                        <DatePublished dateStr={version.datePublished} iconVisible={false} />
                                    </TableCell>

                                    <TableCell className="hidden md:hidden xl:table-cell">
                                        {/* XL WIDTH AND ABOVE */}
                                        <DownloadsCount downloads={version.downloads} iconVisible={false} />
                                    </TableCell>

                                    <TableCell className="pr-table-side-pad-sm md:pr-table-side-pad">
                                        {/* ALWAYS THE SAME */}
                                        <div className="w-full flex gap-1 items-center justify-end">
                                            <a
                                                href={version.primaryFile?.url || ""}
                                                className={cn(
                                                    buttonVariants({ variant: "default", size: "icon" }),
                                                    "noClickRedirect shrink-0 !w-10 !h-10 rounded-full",
                                                )}
                                            >
                                                <DownloadIcon className="w-btn-icon h-btn-icon" />
                                            </a>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="noClickRedirect rounded-full shrink-0 !w-10 !h-10"
                                            >
                                                <MoreVerticalIcon className="w-btn-icon-md h-btn-icon-md" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            ) : null}

            {Pagination ? <div className="w-full flex items-center justify-center">{Pagination}</div> : null}
        </>
    );
};

const VersionName = ({ title, number, url }: { title: string; number: string; url: string }) => {
    return (
        <div className="flex flex-col items-start justify-center gap-1">
            <Link
                to={url}
                className="noClickRedirect leading-none font-bold text-foreground whitespace-pre-wrap max-w-[20ch] lg:max-w-[32ch] overflow-hidden"
            >
                {number}
            </Link>
            <span className="leading-none font-medium text-muted-foreground text-tiny">{title}</span>
        </div>
    );
};

const GameVersions = ({ gameVersions }: { gameVersions: string[] }) => {
    return (
        <>
            {getGroupedVersionsList(gameVersions).map((version) => (
                <Chip key={version} className="text-muted-foreground">
                    {version}
                </Chip>
            ))}
        </>
    );
};

const ProjectLoaders = ({ versionLoaders }: { versionLoaders: string[] }) => {
    const { theme } = useTheme();

    return (
        <>
            {versionLoaders.map((loader) => {
                const loaderData = getLoaderFromString(loader);
                if (!loaderData) return null;
                const accentForeground = loaderData?.metadata?.accent?.foreground;
                // @ts-ignore
                const loaderIcon: ReactNode = loaderIcons[loaderData.name];

                return (
                    <Chip
                        key={loaderData.name}
                        style={{
                            color: accentForeground
                                ? theme === "dark"
                                    ? accentForeground?.dark
                                    : accentForeground?.light
                                : "hsla(var(--muted-foreground))",
                        }}
                    >
                        {loaderIcon ? loaderIcon : null}
                        {CapitalizeAndFormatString(loaderData.name)}
                    </Chip>
                );
            })}
        </>
    );
};

const DatePublished = ({ dateStr, iconVisible = true }: { dateStr: string; iconVisible?: boolean }) => {
    const date = new Date(dateStr);

    if (!date) {
        return null;
    }

    return (
        <span className="flex gap-1.5 items-center justify-start text-muted-foreground font-medium whitespace-nowrap">
            {iconVisible === true ? <CalendarIcon className="w-3.5 h-3.5" /> : null}
            {timeSince(date)}
        </span>
    );
};

const DownloadsCount = ({ downloads, iconVisible = true }: { downloads: number; iconVisible?: boolean }) => {
    return (
        <span className="flex gap-1.5 items-center justify-start text-muted-foreground font-medium">
            {iconVisible === true ? <DownloadIcon className="w-3.5 h-3.5" /> : null}
            {downloads}
        </span>
    );
};
