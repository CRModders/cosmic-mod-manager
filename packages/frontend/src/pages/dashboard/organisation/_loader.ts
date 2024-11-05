import { routeLoader } from "@/lib/route-loader";
import useFetch from "@/src/hooks/fetch";
import { reactQueryClient } from "@/src/providers";
import type { Organisation } from "@shared/types/api";
import type { UseQueryOptions } from "@tanstack/react-query";

const getUserOrganisations = async () => {
    try {
        const response = await useFetch("/api/organization");
        const data = await response.json();
        if (!response.ok || data?.success === false) {
            return null;
        }

        return data as Organisation[];
    } catch (error) {
        return null;
    }
};

export const getdashboardOrgsListQuery = () => {
    return {
        queryKey: ["dashboard-organizations"],
        queryFn: getUserOrganisations,
        staleTime: 10 * 1000,
    } satisfies UseQueryOptions;
};

export const invalidateUserOrgsListQuery = async () => {
    await reactQueryClient.invalidateQueries(getdashboardOrgsListQuery());
};

const orgsLoader = routeLoader(getdashboardOrgsListQuery);
export default orgsLoader;
