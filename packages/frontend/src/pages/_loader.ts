import { routeLoader } from "@/lib/route-loader";
import type { ProjectListItem } from "@shared/types/api";
import type { UseQueryOptions } from "@tanstack/react-query";
import useFetch from "../hooks/fetch";

const getRandomProjects = async () => {
    try {
        const response = await useFetch("/api/projects/home-page-carousel");
        const result = await response.json();
        if (result?.length) {
            return result as ProjectListItem[];
        }
        return null;
    } catch (error) {
        return null;
    }
};
export const getRandomProjectsQuery = () => {
    return {
        queryKey: ["homepage-carousel"],
        queryFn: getRandomProjects,
        staleTime: Number.POSITIVE_INFINITY,
    } satisfies UseQueryOptions;
};

export const homePageLoader = routeLoader(getRandomProjectsQuery());
