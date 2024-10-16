import { routeLoader } from "@/lib/route-loader";
import useFetch from "@/src/hooks/fetch";
import type { Organisation } from "@shared/types/api";
import type { UseQueryOptions } from "@tanstack/react-query";

const getUserOrganisations = async () => {
    try {
        const response = await useFetch("/api/organisation");
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
        queryKey: ["dashboard-organisations"],
        queryFn: getUserOrganisations,
    } satisfies UseQueryOptions;
};

const orgsLoader = routeLoader(getdashboardOrgsListQuery);
export default orgsLoader;
