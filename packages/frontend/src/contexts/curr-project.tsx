import { constructProjectPageUrl } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import type { DependencyData } from "@/types";
import type { ProjectDetailsData, ProjectVersionData, ProjectsListData, TeamMember } from "@shared/types/api";
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
    allProjectVersions: ProjectVersionData[] | undefined | null;
    fetchAllProjectVersions: () => Promise<void>;
    currUsersMembership: TeamMember | null;
    projectDependencies: DependencyData
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
    fetchAllProjectVersions: async () => { },
    currUsersMembership: null,
    projectDependencies: {
        projects: [],
        versions: []
    }
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

const getAllProjectVersions = async (slug: string) => {
    try {
        const response = await useFetch(`/api/project/${slug}/version`);
        return ((await response.json())?.data as ProjectVersionData[]) || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const getProjectDependencies = async (slug: string) => {
    try {
        const response = await useFetch(`/api/project/${slug}/dependencies`);
        return ((await response.json()) as {
            projects: ProjectsListData[];
            versions: ProjectVersionData[];
        }) || null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

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

    const [featuredProjectVersions, setFeaturedProjectVersions] = useState<ProjectVersionData[]>([]);

    const allProjectVersions = useQuery({
        queryKey: [`${currProjectSlug}-project-all-versions`],
        queryFn: () => getAllProjectVersions(currProjectSlug),
    });

    const projectDependencies = useQuery({
        queryKey: [`${currProjectSlug}-project-dependencies`],
        queryFn: () => getProjectDependencies(currProjectSlug),
    })

    const fetchProjectData = async (slug?: string) => {
        if (slug && currProjectSlug !== slug) {
            setCurrProjectSlug(slug);
        } else {
            await projectData.refetch();
        }
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
        if (slug !== currProjectSlug && slug !== projectData.data?.id) {
            fetchProjectData(slug);
        }
    }, [slug])

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
    }, [session, projectData.data]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (currProjectSlug) projectData.refetch();
    }, [currProjectSlug]);

    // Update featuredProjectVersionsList
    useEffect(() => {
        if (allProjectVersions.data) {
            const featuredVersions = allProjectVersions.data.filter((version) => version.featured === true);
            setFeaturedProjectVersions(featuredVersions);
        } else {
            setFeaturedProjectVersions([]);
        }
    }, [allProjectVersions.data]);

    useEffect(() => {
        if (projectData.isFetching || allProjectVersions.isFetching || projectDependencies.isFetching)
            setFetchingProjectData(true);
        else setFetchingProjectData(false);
    }, [projectData.isFetching, allProjectVersions.isFetching, projectDependencies.isFetching]);

    return (
        <projectContext.Provider
            value={{
                projectData: projectData.data,
                fetchProjectData: fetchProjectData,
                fetchingProjectData: fetchingProjectData,
                alterProjectSlug: setCurrProjectSlug,
                featuredProjectVersions: featuredProjectVersions,
                allProjectVersions: allProjectVersions.data,
                fetchAllProjectVersions: fetchAllProjectVersions,
                currUsersMembership: currUsersMembership,
                projectDependencies: projectDependencies.data || { projects: [], versions: [] }
            }}
        >
            {children}
        </projectContext.Provider>
    );
};

export default ProjectContextProvider;
