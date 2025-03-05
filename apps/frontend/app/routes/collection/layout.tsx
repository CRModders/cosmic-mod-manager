import CollectionPageLayout from "~/pages/collection/layout";
import type { ProjectListItem, Collection, CollectionOwner } from "@app/utils/types/api";
import type { Route } from "./+types/layout";
import { resJson, serverFetch } from "~/utils/server-fetch";
import { useLoaderData } from "react-router";
import NotFoundPage from "~/pages/not-found";
import { SITE_NAME_SHORT } from "@app/utils/constants";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { CollectionPagePath } from "~/utils/urls";

export default function _() {
    const data = useLoaderData<typeof loader>();

    if (!data.collection?.id || !data.owner) return <NotFoundPage />;
    return <CollectionPageLayout collection={data.collection} projects={data.projects} owner={data.owner} />;
}

interface CollectionLoaderData {
    collection: Collection | null;
    projects: ProjectListItem[];
    owner: CollectionOwner | null;
}

export async function loader(props: Route.LoaderArgs): Promise<CollectionLoaderData> {
    const collectionId = props.params?.collectionId;

    const NoData = {
        collection: null,
        projects: [],
        owner: null,
    };
    if (!collectionId) return NoData;

    const [collectionRes, collectionProjects, collectionOwner] = await Promise.all([
        serverFetch(props.request, `/api/collections/${collectionId}`),
        serverFetch(props.request, `/api/collections/${collectionId}/projects`),
        serverFetch(props.request, `/api/collections/${collectionId}/owner`),
    ]);
    if (!collectionRes.ok || !collectionProjects.ok) return NoData;

    const [collection, projects, owner] = await Promise.all([
        resJson<Collection>(collectionRes),
        resJson<ProjectListItem[]>(collectionProjects),
        resJson<CollectionOwner>(collectionOwner),
    ]);

    return {
        collection: collection,
        projects: projects || [],
        owner: owner,
    };
}

export function meta(props: Route.MetaArgs) {
    const collection = props.data.collection;

    if (!collection?.id) {
        return MetaTags({
            title: "Collection Not Found",
            description: "The collection you are looking for could not be found.",
            image: Config.SITE_ICON,
            url: Config.FRONTEND_URL,
            suffixTitle: true,
        });
    }

    return MetaTags({
        title: `${collection.name} - Collection`,
        description: `${collection.description} - View the collection ${collection.name} on ${SITE_NAME_SHORT}`,
        image: collection.icon || Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}${CollectionPagePath(collection.id)}`,
    });
}
