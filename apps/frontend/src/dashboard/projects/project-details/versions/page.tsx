import { DownloadIcon, UploadIcon } from "@/components/icons";
import PaginatedNavigation from "@/components/pagination";
import { ContentWrapperCard } from "@/components/panel-layout";
import ReleaseChannelIndicator from "@/components/release-channel-pill";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormatVersionsList } from "@/lib/semver";
import { useIsUseAProjectMember } from "@/src/hooks/project-member";
import { Projectcontext } from "@/src/providers/project-context";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { CapitalizeAndFormatString, createURLSafeSlug, formatDate } from "@root/lib/utils";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const VersionListPage = ({ projectType }: { projectType: string }) => {
    const isAProjectMember = useIsUseAProjectMember();
    const { projectData } = useContext(Projectcontext);
    const { projectUrlSlug } = useParams();

    return (
        <div className="w-full flex flex-col gap-4 items-start justify-center">
            {isAProjectMember !== false && (
                <ContentWrapperCard>
                    <div className="w-full flex flex-wrap gap-4 items-center justify-start">
                        <Link
                            to={`/${createURLSafeSlug(projectData?.type[0] || "").value}/${projectData?.url_slug}/version/create`}
                        >
                            <Button className="gap-2" tabIndex={-1}>
                                <UploadIcon className="w-4 h-4" />
                                Upload a version
                            </Button>
                        </Link>
                        <div className="text-foreground-muted flex gap-2 items-center justify-start">
                            <InfoCircledIcon className="w-4 h-4" /> <p>Click to choose a file or drag one onto this input</p>
                        </div>
                    </div>
                </ContentWrapperCard>
            )}

            <AllProjectVersionsList projectUrlSlug={projectUrlSlug || ""} projectType={projectType} />
        </div>
    );
};

export default VersionListPage;

const AllProjectVersionsList = ({ projectType, projectUrlSlug }: { projectType: string; projectUrlSlug: string }) => {
    const pageSearchParamKey = "page";
    const [urlSearchParams] = useSearchParams();
    const { allProjectVersions } = useContext(Projectcontext);
    const perPageLimit = 20;
    const pagesCount = Math.ceil((allProjectVersions?.versions.length || 0) / perPageLimit);
    const [activePage, setActivePage] = useState(1);
    const navigate = useNavigate();

    const Pagination =
        (allProjectVersions?.versions?.length || 0) > perPageLimit ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageSearchParamKey} />
        ) : null;

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const page = urlSearchParams.get(pageSearchParamKey);
        if (page) setActivePage(Number.parseInt(page) > pagesCount ? 1 : Number.parseInt(page));
        else setActivePage(1);
    }, [urlSearchParams]);

    return (
        <div className="w-full flex flex-col gap-2 items-center justify-center" id="all-versions">
            {Pagination ? <div className="w-full flex items-center justify-center">{Pagination}</div> : null}
            {allProjectVersions?.versions.length ? (
                <ContentWrapperCard className="p-0 pt-2 overflow-hidden">
                    <div className="w-full flex flex-col gap-2 items-center justify-center">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border/35 dark:border-border/35">
                                    <TableHead className="overflow-hidden w-20 font-semibold text-foreground text-lg h-16" />
                                    <TableHead className="overflow-hidden min-w-48 w-[35%] font-semibold text-foreground text-lg h-16">
                                        Version
                                    </TableHead>
                                    <TableHead className="overflow-hidden min-w-36 w-[35%] font-semibold text-foreground text-lg h-16">
                                        Supports
                                    </TableHead>
                                    <TableHead className="overflow-hidden min-w-36 w-[25%] font-semibold text-foreground text-lg h-16">
                                        Stats
                                    </TableHead>
                                </TableRow >
                            </TableHeader   >
                            <TableBody>
                                {allProjectVersions?.versions
                                    .slice((activePage - 1) * perPageLimit, activePage * perPageLimit)
                                    .map((version) => {
                                        return (
                                            <TableRow
                                                key={version.id}
                                                className="cursor-pointer hover:bg-bg-hover border-border/35"
                                                onClick={(e) => {
                                                    // @ts-expect-error
                                                    if (!e.target.closest(".noClickRedirect")) {
                                                        navigate(`/${projectType}/${projectUrlSlug}/version/${version.url_slug}`);
                                                    }
                                                }}
                                            >
                                                <TableCell className="align-top">
                                                    <div className="flex items-start ml-4 lg:ml-6 justify-start py-1.5">
                                                        <a
                                                            href={`${serverUrl}/api/file/${encodeURIComponent(version.files[0].file_url)}`}
                                                            className="noClickRedirect flex h-fit items-center justify-center"
                                                        >
                                                            <Button className="h-fit w-fit p-2 rounded-lg" size={"icon"} tabIndex={-1}>
                                                                <DownloadIcon size="1.1rem" />
                                                            </Button>
                                                        </a>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className="w-full flex flex-col items-start justify-start">
                                                        <Link
                                                            to={`/${projectType}/${projectUrlSlug}/version/${version.url_slug}`}
                                                            className="noClickRedirect"
                                                        >
                                                            <p className="leading-snug text-lg font-semibold text-foreground-muted">
                                                                {version.version_title}
                                                            </p>
                                                        </Link>
                                                        <div className="w-full flex items-start justify-start gap-x-2 gap-y-1">
                                                            <ReleaseChannelIndicator
                                                                release_channel={version.release_channel}
                                                                labelClassName="text-base"
                                                            />
                                                            <p className="text-foreground-muted">{version.version_number}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className="flex flex-col items-start justify-start">
                                                        <p>
                                                            {version.supported_loaders.map((loader) => CapitalizeAndFormatString(loader)).join(", ")}
                                                        </p>
                                                        <p>{FormatVersionsList(version.supported_game_versions)}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className="flex items-start justify-start mr-4">
                                                        <p className="text-foreground-muted">
                                                            Published on{" "}
                                                            <span className="font-semibold">
                                                                {formatDate(new Date(version.published_on), "${month} ${day}, ${year}")}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table  >
                    </div>
                </ContentWrapperCard >
            ) : null
            }
            {Pagination ? <div className="w-full flex items-center justify-center mt-2">{Pagination}</div> : null}
        </div >
    );
};
