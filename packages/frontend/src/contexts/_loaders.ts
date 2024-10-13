import { routeLoader } from "@/lib/route-loader";
import type { LoggedInUserData } from "@shared/types";
import type { ProjectDetailsData, ProjectListItem, ProjectVersionData } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import type { QueryClient } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "react-router-dom";
import useFetch from "../hooks/fetch";

// Auth Session Data Loader
const getSessionData = async () => {
    try {
        const response = await useFetch("/api/auth/me");
        const result = await response.json();

        if (!response.ok || !result?.data) {
            return null;
        }

        return result?.data as LoggedInUserData;
    } catch (err) {
        console.error(err);
        return null;
    }
};
export const getSessionDataQuery = () => {
    return {
        queryKey: ["user-session"],
        queryFn: getSessionData,
    };
};
export const sessionDataLoader = routeLoader(getSessionDataQuery(), undefined);

// User Profile Data Loader
const getUserProfileData = async (userName: string | undefined) => {
    if (!userName) return null;

    try {
        const response = await useFetch(`/api/user/${userName}`);
        const data = await response.json();
        if (!response.ok) {
            return null;
        }

        return data as UserProfileData;
    } catch (err) {
        console.error(err);
        return null;
    }
};
export const getUserProfileDataQuery = (userName: string | undefined) => {
    return {
        queryKey: ["user-profile", userName],
        queryFn: () => getUserProfileData(userName),
    };
};

const getProjectsListData = async (userName: string | undefined) => {
    if (!userName) return null;

    try {
        const response = await useFetch(`/api/user/${userName}/projects?listedOnly=true`);
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
export const getProjectsListDataQuery = (userName: string | undefined) => {
    return {
        queryKey: ["user-projects-list", userName],
        queryFn: () => getProjectsListData(userName),
    };
};

const profilePageQueries = async (queryClient: QueryClient, { params }: LoaderFunctionArgs) => {
    const data = await Promise.all([
        queryClient.ensureQueryData(getUserProfileDataQuery(params.userName)),
        queryClient.ensureQueryData(getProjectsListDataQuery(params.userName)),
    ]);

    return {
        userData: data[0],
        projectsList: data[1],
    };
};
export const userProfilePageLoader = routeLoader(null, profilePageQueries);

// Project context
const getProjectData = async (slug: string | undefined) => {
    if (!slug) return null;

    try {
        const response = await useFetch(`/api/project/${slug}`);
        const data = await response.json();
        if (!response.ok || !data?.project) return null;

        return data?.project as ProjectDetailsData;
    } catch (err) {
        console.error(err);
        return null;
    }
};
export const getProjectDataQuery = (slug: string | undefined) => {
    return {
        queryKey: ["project-data", slug],
        queryFn: () => getProjectData(slug),
    };
};

const getAllProjectVersions = async (slug: string | undefined) => {
    if (!slug) return null;

    try {
        const response = await useFetch(`/api/project/${slug}/version`);
        const data = await response.json();
        if (!response.ok || !data?.data) return null;

        return data.data as ProjectVersionData[];
    } catch (err) {
        console.error(err);
        return null;
    }
};
export const getAllProjectVersionsQuery = (slug: string | undefined) => {
    return {
        queryKey: ["project-versions", slug],
        queryFn: () => getAllProjectVersions(slug),
    };
};

const getProjectDependencies = async (slug: string | undefined) => {
    if (!slug) return null;

    try {
        const response = await useFetch(`/api/project/${slug}/dependencies`);
        const data = await response.json();
        if (!response.ok || !data) return null;

        return data as {
            projects: ProjectListItem[];
            versions: ProjectVersionData[];
        };
    } catch (err) {
        console.error(err);
        return null;
    }
};
export const getProjectDependenciesQuery = (slug: string | undefined) => {
    return {
        queryKey: ["project-dependencies", slug],
        queryFn: () => getProjectDependencies(slug),
    };
};

const projectPageQueries = async (queryClient: QueryClient, { params }: LoaderFunctionArgs) => {
    const data = await Promise.all([
        queryClient.ensureQueryData(getProjectDataQuery(params.slug)),
        queryClient.ensureQueryData(getAllProjectVersionsQuery(params.slug)),
        queryClient.ensureQueryData(getProjectDependenciesQuery(params.slug)),
    ]);

    return {
        projectData: data[0],
        projectVersions: data[1],
        projectDependencies: data[2],
    };
};
export const projectPageLoader = routeLoader(null, projectPageQueries);
