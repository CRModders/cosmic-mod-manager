import { PlusIcon } from "@/components/icons";
import { ContentWrapperCard } from "@/components/panel-layout";
import { Button } from "@/components/ui/button";
import { CubeLoader } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import type { ProjectStatuses, ProjectVisibility } from "@root/types";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import CreateProjectForm from "./create-project-form";
import ProjectListTable from "./projects-list";

export type ProjectData = {
    id: string;
    name: string;
    org_id?: string;
    url_slug: string;
    type: string[];
    status: ProjectStatuses;
    visibility: ProjectVisibility;
};

const getProjectsList = async () => {
    try {
        const res = await useFetch("/api/project/get-all-projects");
        return (await res.json())?.projects;
    } catch (err) {
        console.error(err);
        return [];
    }
}

const Projects = () => {
    const projectsList = useQuery({ queryKey: ["dashboard-user-projects-list"], queryFn: () => getProjectsList() });

    const fetchProjects = async () => {
        await projectsList.refetch();
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-4">
            <Helmet>
                <title>Projects | CRMM</title>
                <meta name="description" content="Your projects on crmm." />
            </Helmet>

            <ContentWrapperCard className="p-0">
                <div className="w-full flex items-center justify-between p-4">
                    <h1 className="w-full flex items-center justify-start font-semibold text-2xl text-foreground-muted">
                        Projects
                    </h1>

                    <CreateProjectForm fetchProjects={fetchProjects}>
                        <Button className="gap-2">
                            <PlusIcon className="w-5 h-5" />
                            Create a project
                        </Button>
                    </CreateProjectForm>
                </div>
                <div className="w-full flex relative rounded-lg overflow-hidden">
                    {projectsList === null || projectsList.isLoading === true ? (
                        <div className="w-full flex items-center justify-center my-4">
                            <CubeLoader />
                        </div>
                    ) : projectsList.data?.length > 0 ? (
                        <ProjectListTable projectsList={projectsList.data} />
                    ) : (
                        <div className="w-full">
                            <p className="text-foreground-muted">
                                You don't have any projects. Click the button above to create one.
                            </p>
                        </div>
                    )}
                </div>
            </ContentWrapperCard >
        </div>
    );
};

export default Projects;
