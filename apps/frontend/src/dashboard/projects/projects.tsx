import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { PlusIcon } from "@radix-ui/react-icons";
import type { ProjectStatuses, ProjectType, ProjectVisibility } from "@root/types";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { ContentWrapperCard } from "../../settings/panel";
import CreateProjectForm from "./create-project-form";
import ProjectListTable from "./projects-list";

export type ProjectData = {
	id: string;
	name: string;
	org_id?: string;
	url_slug: string;
	type: ProjectType;
	status: ProjectStatuses;
	visibility: ProjectVisibility;
};

const Projects = () => {
	const [loading, setLoading] = useState(false);
	const [projectsList, setProjectsList] = useState<ProjectData[] | null>(null);

	const fetchProjects = async () => {
		setLoading(true);

		const res = await useFetch("/api/project/get-all-projects");
		const result = await res.json();
		setLoading(false);

		const projects: ProjectData[] = [];
		for (const project of result?.projects || []) {
			const projectType = `${project.type}`.toLowerCase();
			const projectStatus = `${project.status}`.toLowerCase();
			projects.push({
				...project,
				type: `${projectType[0].toUpperCase()}${projectType.slice(1)}`,
				status: `${projectStatus[0].toUpperCase()}${projectStatus.slice(1)}`,
			} as ProjectData);
		}

		setProjectsList(projects);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchProjects();
	}, []);

	return (
		<div className="w-full flex flex-col items-center justify-center gap-4">
			<Helmet>
				<title>Projects | CRMM</title>
				<meta name="description" content="Your projects on crmm." />
			</Helmet>

			<ContentWrapperCard>
				<div className="w-full flex items-center justify-between">
					<h1 className="w-full flex items-center justify-start font-semibold text-2xl text-foreground-muted">
						Projects
					</h1>

					<CreateProjectForm fetchProjects={fetchProjects}>
						<Button className="flex items-center justify-center gap-2 bg-accent-bg hover:bg-accent-bg/80 dark:text-foreground">
							<PlusIcon className="w-5 h-5" />
							<span className="font-semibold text-base">Create a project</span>
						</Button>
					</CreateProjectForm>
				</div>
				<div className="w-full flex relative">
					{projectsList === null || loading === true ? (
						<div className="w-full flex items-center justify-center my-4">
							<Spinner />
						</div>
					) : projectsList?.length > 0 ? (
						<ProjectListTable projectsList={projectsList} />
					) : (
						<div className="w-full">
							<p className="text-foreground-muted">
								You don't have any projects. Click the button above to create one.
							</p>
						</div>
					)}
				</div>
			</ContentWrapperCard>
		</div>
	);
};

export default Projects;
