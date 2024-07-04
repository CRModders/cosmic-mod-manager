import { constructProjectPageUrl } from "@/lib/utils";
import type { ProjectDataType, ProjectVersionsList } from "@root/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/fetch";

type ProjectContextType = {
    fetchProjectData: (slug?: string) => Promise<void>;
    fetchFeaturedProjectVersions: () => Promise<void>;
    alterProjectSlug: (slug: string) => void;
    projectData: ProjectDataType | null | undefined;
    featuredProjectVersions: ProjectVersionsList | undefined | null;
    allProjectVersions: ProjectVersionsList | undefined | null;
    fetchAllProjectVersions: () => Promise<void>;
    fetchingProjectData: boolean;
};

export const Projectcontext = createContext<ProjectContextType>({
    projectData: undefined,
    featuredProjectVersions: undefined,
    allProjectVersions: undefined,
    fetchProjectData: async (slug?: string) => {
        slug;
    },
    fetchFeaturedProjectVersions: async () => {},
    fetchAllProjectVersions: async () => {},
    fetchingProjectData: true,
    alterProjectSlug: (slug: string) => {
        slug;
    },
});

const getProjectData = async (projectSlug: string) => {
    try {
        const response = await useFetch(`/api/project/${projectSlug}`);
        return await response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};

const getFeaturedProjectVersions = async (projectSlug: string) => {
    try {
        const response = await useFetch(`/api/project/${projectSlug}/version?featured=true`);
        return await response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};

const getAllProjectVersions = async (projectSlug: string) => {
    try {
        const response = await useFetch(`/api/project/${projectSlug}/version`);
        return await response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const ProjectContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { projectUrlSlug } = useParams();
    const [fetchingProjectData, setFetchingProjectData] = useState(true);
    const [currProjectSlug, setCurrProjectSlug] = useState(projectUrlSlug || "");
    const navigate = useNavigate();

    const projectData = useQuery({
        queryKey: [`${currProjectSlug}-project-data`],
        queryFn: () => getProjectData(currProjectSlug),
    });
    const featuredProjectVersions = useQuery({
        queryKey: [`${currProjectSlug}-project-featured-versions`],
        queryFn: () => getFeaturedProjectVersions(currProjectSlug),
    });
    const allProjectVersions = useQuery({
        queryKey: [`${currProjectSlug}-project-all-versions`],
        queryFn: () => getAllProjectVersions(currProjectSlug),
    });

    const fetchProjectData = async (slug?: string) => {
        if (slug && currProjectSlug !== slug) {
            setCurrProjectSlug(slug);
        } else {
            await projectData.refetch();
        }
    };

    const fetchFeaturedProjectVersions = async () => {
        await featuredProjectVersions.refetch();
    };
    const fetchAllProjectVersions = async () => {
        await allProjectVersions.refetch();
    };

    const redirectToCorrectProjectUrl = () => {
        const data = projectData.data?.data || null;
        if (data?.id) {
            const constructedUrl = constructProjectPageUrl(data.type[0], data.url_slug);

            if (window.location.href.replace(window.location.origin, "") !== constructedUrl) {
                navigate(constructedUrl);
            }
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        redirectToCorrectProjectUrl();
    }, [projectData, currProjectSlug]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (currProjectSlug) projectData.refetch();
    }, [currProjectSlug]);

    useEffect(() => {
        if (projectData.isFetching || featuredProjectVersions.isFetching || allProjectVersions.isFetching)
            setFetchingProjectData(true);
        else setFetchingProjectData(false);
    }, [projectData.isFetching, featuredProjectVersions.isFetching, allProjectVersions.isFetching]);

    return (
        <Projectcontext.Provider
            value={{
                projectData: projectData.data?.data || undefined,
                fetchProjectData: fetchProjectData,
                fetchingProjectData: fetchingProjectData,
                alterProjectSlug: setCurrProjectSlug,
                featuredProjectVersions: featuredProjectVersions.data?.data || undefined,
                fetchFeaturedProjectVersions: fetchFeaturedProjectVersions,
                allProjectVersions: allProjectVersions.data?.data || undefined,
                fetchAllProjectVersions: fetchAllProjectVersions,
            }}
        >
            {children}
        </Projectcontext.Provider>
    );
};

export default ProjectContextProvider;
