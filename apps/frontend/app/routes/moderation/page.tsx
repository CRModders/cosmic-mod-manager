import type { Statistics } from "@app/utils/types/api/stats";
import { useLoaderData } from "react-router";
import StatsPage from "~/pages/moderation/page";
import { serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/page";

export default function () {
    const stats = useLoaderData<Statistics>();

    if (!stats) {
        return (
            <div>
                <span>Unable to load stats data.</span>
            </div>
        );
    }

    return <StatsPage stats={stats} />;
}

export async function loader({ request: req }: Route.LoaderArgs) {
    const res = await serverFetch(req, "/api/statistics");
    const data = await res.json();

    return data as Statistics;
}
