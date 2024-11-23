import SearchListItem from "@/components/layout/search-list-item";
import type { ProjectListItem } from "@shared/types/api";

interface Props {
    projectType: string | undefined;
    projectsList: ProjectListItem[] | null;
}

const OrgProjectsList = ({ projectType, projectsList }: Props) => {
    if (!projectsList) return null;

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
                        featuredGallery={project.featured_gallery}
                        color={project.color}
                    />
                );
            })}
        </>
    );
};

export default OrgProjectsList;
