import { routeLoader } from "@/lib/route-loader";
import useFetch from "@/src/hooks/fetch";
import { reactQueryClient } from "@/src/providers";
import type { ProjectListItem } from "@shared/types/api";
import type { UseQueryOptions } from "@tanstack/react-query";

const getUserProjects = async () => {
    try {
        const response = await useFetch("/api/project");
        const result = await response.json();
        return (result as ProjectListItem[]) || null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getUserProjectsQuery = () => {
    return {
        queryKey: ["session-user-projects"],
        queryFn: getUserProjects,
    } satisfies UseQueryOptions;
};

export const invalidateUserProjectsQuery = async () => {
    await reactQueryClient.invalidateQueries(getUserProjectsQuery());
};

const userProjectsLoader = routeLoader(getUserProjectsQuery());
export default userProjectsLoader;
