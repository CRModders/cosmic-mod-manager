import SearchListItem from "@/components/layout/search-list-item";
import type { ProjectListItem } from "@shared/types/api";
import "./styles.css";

interface Props {
    projectType: string | undefined;
    projectsList: ProjectListItem[] | null;
}

const UserProfilePage = ({ projectType, projectsList }: Props) => {
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
                    />
                );
            })}
        </>
    );
};

export default UserProfilePage;
