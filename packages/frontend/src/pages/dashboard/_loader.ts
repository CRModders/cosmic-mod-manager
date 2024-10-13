import { routeLoader } from "@/lib/route-loader";
import useFetch from "@/src/hooks/fetch";
import type { ProjectListItem } from "@shared/types/api";
import type { QueryClient } from "@tanstack/react-query";
import { getNotificationsQuery } from "./notifications/_loader";

const getAllUserProjects = async () => {
    try {
        const response = await useFetch("/api/project");
        const data = await response.json();
        if (!response.ok || !data) return null;

        return data as ProjectListItem[];
    } catch (error) {
        console.error(error);
        return null;
    }
};
export const getAllUserProjectsQuery = () => {
    return {
        queryKey: ["session-user-projects"],
        queryFn: getAllUserProjects,
        staleTime: Number.POSITIVE_INFINITY,
    };
};

const overViewPageQueries = async (queryClient: QueryClient) => {
    const data = await Promise.all([
        queryClient.ensureQueryData(getAllUserProjectsQuery()),
        queryClient.ensureQueryData(getNotificationsQuery()),
    ]);

    return {
        projects: data[0],
        notifications: data[1],
    };
};
export const overviewPageLoader = routeLoader(null, overViewPageQueries);
