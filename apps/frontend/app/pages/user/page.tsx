import { CollectionVisibility, type ProjectType } from "@app/utils/types";
import type { Collection, ProjectListItem } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { useParams } from "react-router";
import { CollectionListItemCard } from "~/components/item-card";
import SearchListItem from "~/components/search-list-item";
import { CollectionPagePath } from "~/utils/urls";
import { EarthIcon, LockIcon } from "lucide-react";
import { useTranslation } from "~/locales/provider";
import { useSession } from "~/hooks/session";
import type { UserProfileData } from "@app/utils/types/api/user";
import { FollowsCollectionItem } from "../dashboard/collections/page";
import useCollections from "../collection/provider";

interface Props {
    projectsList: ProjectListItem[];
    collections: Collection[];
    userData: UserProfileData;
}

export default function UserProjectsList(props: Props) {
    const { t } = useTranslation();
    const session = useSession();
    const collectionCtx = useCollections();
    const params = useParams();
    const showType = params.type;

    if (showType === "collections" || showType === "collection") {
        return (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-panel-cards">
                {props.userData.id === session?.id ? (
                    <FollowsCollectionItem
                        className="bg-card-background hover:bg-card-background/85"
                        followingProjects={collectionCtx.followingProjects.length}
                    />
                ) : null}

                {(props.collections || []).map((collection) => {
                    return (
                        <CollectionListItemCard
                            vtId={collection.id}
                            key={collection.id}
                            title={collection.name}
                            url={CollectionPagePath(collection.id)}
                            icon={imageUrl(collection.icon)}
                            description={collection.description || ""}
                            projects={collection.projects.length}
                            className="bg-card-background hover:bg-card-background/85"
                            visibility={
                                <div className="inline-flex items-center justify-center gap-1">
                                    {collection.visibility === CollectionVisibility.PRIVATE ? (
                                        <LockIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    ) : (
                                        <EarthIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    )}
                                    {t.projectSettings[collection.visibility === CollectionVisibility.PRIVATE ? "private" : "public"]}
                                </div>
                            }
                        />
                    );
                })}
            </div>
        );
    }

    const formattedProjectType = showType?.slice(0, -1);
    const filteredProjects = formattedProjectType
        ? props.projectsList?.filter((project) => project.type.includes(formattedProjectType))
        : props.projectsList;

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
                        projectType={project.type[0] as ProjectType}
                        projectSlug={project.slug}
                        icon={project.icon}
                        summary={project.summary}
                        loaders={project.loaders}
                        featuredCategories={project.featuredCategories}
                        clientSide={project.clientSide}
                        serverSide={project.serverSide}
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
