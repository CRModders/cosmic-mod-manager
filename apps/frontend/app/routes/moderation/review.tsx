import type { ModerationProjectItem } from "@app/utils/types/api/moderation";
import { useLoaderData } from "react-router";
import ReviewProjects from "~/pages/moderation/review";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/review";

export default function () {
    const projects = useLoaderData<typeof loader>();

    return <ReviewProjects projects={projects || []} />;
}

export async function loader({ request }: Route.LoaderArgs) {
    const res = await serverFetch(request, "/api/moderation/projects");
    const queuedProjects = resJson<ModerationProjectItem[]>(res);

    return queuedProjects;
}
