import SearchListItem from "@/components/layout/search-list-item";
import { userProfileContext } from "@/src/contexts/user-profile";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import "./styles.css";

const UserProfilePage = () => {
    const { projectType } = useParams();
    const { projectsList } = useContext(userProfileContext);

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
