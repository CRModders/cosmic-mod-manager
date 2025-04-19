import { useOutletContext, useParams } from "react-router";
import SearchListItem from "~/components/search-list-item";
import type { CollectionOutletData } from "./layout";
import { useTranslation } from "~/locales/provider";
import { Checkbox } from "@app/components/ui/checkbox";
import { useSession } from "~/hooks/session";
import type { ProjectType } from "@app/utils/types";

export default function CollectionProjectsList() {
    const { t } = useTranslation();
    const session = useSession();
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

    return filteredProjects.map((project) => {
        const projectItem = (
            <SearchListItem
                key={project.id}
                vtId={project.id}
                projectName={project.name}
                projectType={project.type[0] as ProjectType}
                projectSlug={project.slug}
                icon={project.icon}
                featuredGallery={project.featured_gallery}
                color={project.color}
                summary={project.summary}
                loaders={project.loaders}
                featuredCategories={project.featuredCategories}
                clientSide={project.clientSide}
                serverSide={project.serverSide}
                downloads={project.downloads}
                followers={project.followers}
                dateUpdated={new Date(project.dateUpdated)}
                datePublished={new Date(project.datePublished)}
                author={project?.author || ""}
                isOrgOwned={project.isOrgOwned}
                visibility={project.visibility}
            />
        );

        if (ctx.collection.userId !== session?.id) {
            return projectItem;
        }

        return (
            <div key={project.id} className="grid grid-cols-[1fr_min-content] gap-panel-cards items-center group/list-item">
                {projectItem}

                <Checkbox
                    title="Select item"
                    checked={ctx.markedProjects.includes(project.id)}
                    onCheckedChange={(e) => {
                        if (e === true) {
                            ctx.addMarkedProject(project.id);
                        } else {
                            ctx.removeMarkedProject(project.id);
                        }
                    }}
                />
            </div>
        );
    });
}
