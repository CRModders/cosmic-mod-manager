import { useOutletContext, useParams } from "@remix-run/react";
import SearchListItem from "~/components/layout/search-list-item";
import type { UserOutletData } from "./layout";

export default function UserProjectsList() {
    const params = useParams();
    const { projectsList } = useOutletContext<UserOutletData>();
    if (!projectsList) return null;

    const projectType = params.type;

    const formattedProjectType = projectType?.slice(0, -1);
    const filteredProjects = formattedProjectType
        ? projectsList?.filter((project) => project.type.includes(formattedProjectType))
        : projectsList;

    return (
        <>
            {filteredProjects.map((project) => {
                return (
                    <SearchListItem
                        key={project.id}
                        projectName={project.name}
                        projectType={project.type[0]}
                        projectSlug={project.slug}
                        icon={project.icon}
                        summary={project.summary}
                        loaders={project.loaders}
                        featuredCategories={project.featuredCategories}
                        downloads={project.downloads}
                        followers={project.followers}
                        dateUpdated={new Date(project.dateUpdated)}
                        datePublished={new Date(project.datePublished)}
                        color={project.color}
                        featuredGallery={null}
                    />
                );
            })}
        </>
    );
}
