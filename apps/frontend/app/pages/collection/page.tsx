import { useOutletContext, useParams } from "react-router";
import SearchListItem from "~/components/search-list-item";
import type { CollectionOutletData } from "./layout";
import { useTranslation } from "~/locales/provider";

export default function CollectionProjectsList() {
    const { t } = useTranslation();
    const ctx = useOutletContext<CollectionOutletData>();
    const params = useParams();
    const projectType = params.projectType;

    const formattedProjectType = projectType?.slice(0, -1);
    const filteredProjects = formattedProjectType
        ? ctx.projects?.filter((project) => project.type.includes(formattedProjectType))
        : ctx.projects;

    if (!filteredProjects.length) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <p className="text-lg text-muted-foreground italic text-center">{t.common.noResults}</p>
            </div>
        );
    }

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
