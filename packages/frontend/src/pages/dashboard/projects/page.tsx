import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useFetch from "@/src/hooks/fetch";
import type { ProjectsListData } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import CreateNewProjectDialog from "./new-project";

import { CubeIcon } from "@/components/icons";
import AvatarImg from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CopyBtn from "@/components/ui/copy-btn";
import { FullWidthSpinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormatProjectTypes, getProjectPagePathname, imageUrl } from "@/lib/utils";
import { SITE_NAME_SHORT } from "@shared/config";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { SettingsIcon } from "lucide-react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

const getAllUserProjects = async () => {
    try {
        const response = await useFetch("/api/project");
        const result = await response.json();
        return (result?.projects as ProjectsListData[]) || null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const ProjectsPage = () => {
    const projectsList = useQuery({ queryKey: ["all-user-projects"], queryFn: () => getAllUserProjects() });
    const navigate = useNavigate();

    const refetchProjectsList = async () => {
        await projectsList.refetch();
    };

    return (
        <>
            <Helmet>
                <title>Projects | {SITE_NAME_SHORT}</title>
                <meta name="description" content="Settings" />
            </Helmet>

            <Card className="w-full overflow-hidden">
                <CardHeader className="w-full flex flex-row flex-wrap items-start justify-between gap-x-6 gap-y-2">
                    <CardTitle>Projects</CardTitle>
                    <CreateNewProjectDialog refetchProjectsList={refetchProjectsList} />
                </CardHeader>
                <CardContent className="p-0">
                    {projectsList.data?.length === 0 ? (
                        <div className="w-full flex items-center justify-start p-6">
                            <p>You don't have any projects. Click the button above to create one.</p>
                        </div>
                    ) : (projectsList.data?.length || 0) > 0 ? (
                        <div className="w-full mt-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="overflow-hidden w-[10%]">
                                            <span className="pl-4">Icon</span>
                                        </TableHead>
                                        <TableHead className="overflow-hidden w-[30%]">Name</TableHead>
                                        <TableHead className="overflow-hidden w-[24%]">
                                            <div className="flex">
                                                <span className="text-base opacity-0 select-none">.</span>
                                                <span>ID</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="overflow-hidden w-[17%]">Type</TableHead>
                                        <TableHead className="overflow-hidden w-[13%]">Status</TableHead>
                                        <TableHead className="overflow-hidden w-[6%]">
                                            <span className="mr-4" />
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(projectsList.data || []).map((project) => {
                                        return (
                                            <TableRow
                                                key={project.id}
                                                className="cursor-pointer border-none text-base"
                                                onClick={(e) => {
                                                    //@ts-expect-error
                                                    if (!e.target.closest(".noClickRedirect")) {
                                                        navigate(getProjectPagePathname(project.type[0], project.slug));
                                                    }
                                                }}
                                            >
                                                <TableCell>
                                                    <Link
                                                        tabIndex={-1}
                                                        to={getProjectPagePathname(project.type[0], project.slug)}
                                                        className="noClickRedirect ml-4 flex"
                                                    >
                                                        <AvatarImg
                                                            url={imageUrl(project.icon)}
                                                            alt={project.name}
                                                            fallback={<CubeIcon className="w-3/4 h-3/4 text-muted-foreground" />}
                                                            imgClassName="rounded"
                                                            wrapperClassName="h-12 rounded"
                                                        />
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        to={getProjectPagePathname(project.type[0], project.slug)}
                                                        className="noClickRedirect"
                                                    >
                                                        <Button variant={"link"} className="p-0 font-[500]" tabIndex={-1}>
                                                            {project.name}
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="cursor-default">
                                                    <div className="noClickRedirect w-fit flex items-center justify-start gap-2 rounded">
                                                        <CopyBtn
                                                            id={`${project.slug}-${project.id}`}
                                                            text={project.id}
                                                            label={project.id}
                                                            maxLabelChars={12}
                                                            className="px-2 py-1 hover:bg-card-background"
                                                            iconClassName="w-4 h-4"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>{FormatProjectTypes(project.type)}</TableCell>
                                                <TableCell>{CapitalizeAndFormatString(project.status)}</TableCell>
                                                <TableCell className="cursor-default">
                                                    <div className="flex items-center justify-center pr-4">
                                                        <Link
                                                            to={`${getProjectPagePathname(project.type[0], project.slug)}/settings`}
                                                            className="noClickRedirect rounded flex items-center justify-center h-full w-fit"
                                                        >
                                                            <SettingsIcon className="w-8 h-8 hover:bg-card-background rounded p-2" />
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : projectsList?.isLoading ? (
                        <FullWidthSpinner />
                    ) : null}
                </CardContent>
            </Card>
        </>
    );
};

export default ProjectsPage;
