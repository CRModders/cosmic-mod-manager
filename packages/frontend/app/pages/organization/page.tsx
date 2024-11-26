import { useParams } from "@remix-run/react";
import type { ProjectListItem } from "@shared/types/api";
import SearchListItem from "~/components/layout/search-list-item";

interface Props {
    projectsList: ProjectListItem[];
}

function OrganizationPage({ projectsList }: Props) {
    const projectType = useParams().projectType;

    const formattedProjectType = projectType?.slice(0, -1);
    const filteredProjects = formattedProjectType
        ? projectsList?.filter((project) => project.type.includes(formattedProjectType))
        : projectsList;

    return (
        <ul className="w-full grid grid-cols-1 gap-panel-cards">
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
                        featuredGallery={project.featured_gallery}
                        color={project.color}
                    />
                );
            })}
        </ul>
    );
}

export default OrganizationPage;
