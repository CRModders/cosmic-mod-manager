import { ensureQueryData, routeLoader } from "@/lib/route-loader";
import useFetch from "@/src/hooks/fetch";
import { reactQueryClient } from "@/src/providers";
import type { Organisation, ProjectListItem } from "@shared/types/api";
import type { LoaderFunctionArgs } from "react-router-dom";

// User Profile Data Loader
const getOrgData = async (slug: string | undefined) => {
    if (!slug) return null;

    try {
        const response = await useFetch(`/api/organization/${slug}`);
        const data = await response.json();
        if (!response.ok) {
            return null;
        }

        return data as Organisation;
    } catch (err) {
        console.error(err);
        return null;
    }
};
export const getOrgDataQuery = (slug: string | undefined) => {
    return {
        queryKey: ["organization", slug],
        queryFn: () => getOrgData(slug),
    };
};

const getOrgProjects = async (slug: string | undefined) => {
    if (!slug) return null;

    try {
        const response = await useFetch(`/api/organization/${slug}/projects`);
        const data = await response.json();
        if (!response.ok) {
            return null;
        }

        return data as ProjectListItem[];
    } catch (err) {
        console.error(err);
        return null;
    }
};
export const getOrgProjectsQuery = (slug: string | undefined) => {
    return {
        queryKey: ["org-projects", slug],
        queryFn: () => getOrgProjects(slug),
    };
};

export const invalidateOrgProjectsQuery = async (slug: string) => {
    await reactQueryClient.invalidateQueries(getOrgProjectsQuery(slug));
};

const orgPageQueries = async ({ params }: LoaderFunctionArgs) => {
    const data = await Promise.all([ensureQueryData(getOrgDataQuery(params.slug)), ensureQueryData(getOrgProjectsQuery(params.slug))]);

    return {
        userData: data[0],
        projectsList: data[1],
    };
};
export const orgPageLoader = routeLoader(null, orgPageQueries);
