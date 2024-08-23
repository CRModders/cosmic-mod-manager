import { constructProjectPageUrl } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import type { ProjectDetailsData, ProjectVersionData, TeamMember } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "./auth";

type ProjectContextType = {
    fetchProjectData: (slug?: string) => Promise<void>;
    alterProjectSlug: (slug: string) => void;
    projectData: ProjectDetailsData | null | undefined;
    fetchingProjectData: boolean;
    featuredProjectVersions: ProjectVersionData[] | undefined | null;
    fetchFeaturedProjectVersions: () => Promise<void>;
    allProjectVersions: ProjectVersionData[] | undefined | null;
    fetchAllProjectVersions: () => Promise<void>;
    currUsersMembership: TeamMember | null;
};

export const projectContext = createContext<ProjectContextType>({
    projectData: undefined,
    fetchProjectData: async (slug?: string) => {
        slug;
    },
    fetchingProjectData: true,
    alterProjectSlug: (slug: string) => {
        slug;
    },
    featuredProjectVersions: undefined,
    allProjectVersions: undefined,
    fetchFeaturedProjectVersions: async () => { },
    fetchAllProjectVersions: async () => { },
    currUsersMembership: null,
});

const getProjectData = async (slug: string) => {
    try {
        const response = await useFetch(`/api/project/${slug}`);
        if (!response.ok) return null;
        return ((await response.json())?.project as ProjectDetailsData) || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const getFeaturedProjectVersions = async (slug: string) => {
    try {
        const response = await useFetch(`/api/project/${slug}/version?featured=true`);
        return ((await response.json())?.data as ProjectVersionData[]) || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const getAllProjectVersions = async (slug: string) => {
    try {
        const response = await useFetch(`/api/project/${slug}/version`);
        return ((await response.json())?.data as ProjectVersionData[]) || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const ProjectContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { slug } = useParams();
    const [fetchingProjectData, setFetchingProjectData] = useState(true);
    const [currUsersMembership, setCurrUsersMembership] = useState<TeamMember | null>(null);
    const [currProjectSlug, setCurrProjectSlug] = useState(slug || "");
    const { session } = useSession();
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
        const data = projectData.data || null;
        if (data?.id) {
            const constructedUrl = constructProjectPageUrl(data.type[0], data.slug);

            if (window.location.href.replace(window.location.origin, "") !== constructedUrl) {
                navigate(constructedUrl);
            }
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        redirectToCorrectProjectUrl();

        if (!projectData.data?.id) setCurrUsersMembership(null);
        else {
            let valueSet = false;
            for (const member of projectData.data.members) {
                if (member.userId === session?.id) {
                    valueSet = true;
                    setCurrUsersMembership(member);
                    break;
                }
            }

            if (!valueSet) {
                for (const member of projectData.data.organisation?.members || []) {
                    if (member.userId === session?.id) {
                        setCurrUsersMembership(member);
                    }
                }
            }
        }
    }, [session, projectData, currProjectSlug]);

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
        <projectContext.Provider
            value={{
                projectData: projectData.data,
                fetchProjectData: fetchProjectData,
                fetchingProjectData: fetchingProjectData,
                alterProjectSlug: setCurrProjectSlug,
                featuredProjectVersions: featuredProjectVersions.data,
                allProjectVersions: allProjectVersions.data,
                fetchFeaturedProjectVersions: fetchFeaturedProjectVersions,
                fetchAllProjectVersions: fetchAllProjectVersions,
                currUsersMembership: currUsersMembership,
            }}
        >
            {children}
        </projectContext.Provider>
    );
};

export default ProjectContextProvider;
