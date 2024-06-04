import type { ProjectDataType, ProjectVersionsList } from "@/types";
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

export const ProjectContextProvider = ({ children }: { children: React.ReactNode }) => {
	const { projectUrlSlug } = useParams();
	const [projectData, setProjectData] = useState<ProjectDataType | null | undefined>(undefined);
	const [featuredProjectVersions, setFeaturedProjectVersions] = useState<ProjectVersionsList | null | undefined>(
		undefined,
	);
	const [allProjectVersions, setAllProjectVersions] = useState<ProjectVersionsList | null | undefined>(undefined);
	const [fetchingProjectData, setFetchingProjectData] = useState(true);
	const [currProjectSlug, setCurrProjectSlug] = useState(projectUrlSlug || "");
	const navigate = useNavigate();

	const fetchProjectData = async (slug?: string) => {
		slug && alterProjectSlug(slug);

		setFetchingProjectData(true);
		const response = await useFetch(`/api/project/${slug || currProjectSlug}`);
		setFetchingProjectData(false);
		const result = await response.json();
		setProjectData(result?.data || null);
	};

	const fetchFeaturedProjectVersions = async () => {
		setFetchingProjectData(true);
		const response = await useFetch(`/api/project/${currProjectSlug}/version?featured=true`);
		setFetchingProjectData(false);
		const result = await response.json();
		setFeaturedProjectVersions(result?.data || null);
	};

	const fetchAllProjectVersions = async () => {
		setFetchingProjectData(true);
		const response = await useFetch(`/api/project/${currProjectSlug}/version`);
		setFetchingProjectData(false);
		const result = await response.json();
		setAllProjectVersions(result?.data || null);
	};

	const alterProjectSlug = (slug: string) => {
		setCurrProjectSlug(slug);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const fetches = [fetchProjectData(), fetchFeaturedProjectVersions(), fetchAllProjectVersions()];
		Promise.all(fetches);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (projectData?.id && window.location.pathname.includes(projectData?.id)) {
			navigate(window.location.pathname.replace(projectData?.id, projectData?.url_slug));
		}
	}, [projectData]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (projectUrlSlug && currProjectSlug !== projectUrlSlug) {
			navigate(window.location.pathname.replace(projectUrlSlug, currProjectSlug));
		}
	}, [currProjectSlug]);

	return (
		<Projectcontext.Provider
			value={{
				projectData: projectData,
				fetchProjectData: fetchProjectData,
				fetchingProjectData: fetchingProjectData,
				alterProjectSlug: alterProjectSlug,
				featuredProjectVersions: featuredProjectVersions,
				fetchFeaturedProjectVersions: fetchFeaturedProjectVersions,
				allProjectVersions: allProjectVersions,
				fetchAllProjectVersions: fetchAllProjectVersions,
			}}
		>
			{children}
		</Projectcontext.Provider>
	);
};
