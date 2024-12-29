import type { ProjectListItem } from "@app/utils/types/api";
import { useParams } from "react-router";
import SearchListItem from "~/components/search-list-item";

interface Props {
    projectsList: ProjectListItem[];
}

export default function UserProjectsList({ projectsList }: Props) {
    const params = useParams();
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
                        vtId={project.id}
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
                        visibility={project.visibility}
                    />
                );
            })}
        </>
    );
}
