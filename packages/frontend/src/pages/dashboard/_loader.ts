import { routeLoader } from "@/lib/route-loader";
import useFetch from "@/src/hooks/fetch";
import type { ProjectListItem } from "@shared/types/api";

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
        queryKey: ["all-projects-logged-in-user"],
        queryFn: getAllUserProjects,
        staleTime: Number.POSITIVE_INFINITY,
    };
};

export const overviewPageLoader = routeLoader(getAllUserProjectsQuery());
