import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import type { ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/fetch";
import NotFoundPage from "../pages/not-found";

interface UserProfileContext {
    userData: UserProfileData | null;
    projectsList: ProjectListItem[] | null;
}

export const userProfileContext = createContext<UserProfileContext>({ userData: null, projectsList: null });

const getUserProfileData = async (userName: string | undefined) => {
    if (!userName) return null;

    try {
        const response = await useFetch(`/api/user/${userName}`);
        return ((await response.json())?.user as UserProfileData) || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const getProjectsListData = async (userName: string | undefined) => {
    if (!userName) return null;

    try {
        const response = await useFetch(`/api/user/${userName}/projects?listedOnly=true`);
        return ((await response.json())?.projects as ProjectListItem[]) || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const UserProfileContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { userName } = useParams();

    const userData = useQuery({ queryKey: [`user-profile-${userName}`], queryFn: () => getUserProfileData(userName) });
    const projectsList = useQuery({ queryKey: [`user-projects-${userName}`], queryFn: () => getProjectsListData(userName) });
    const isFetchingData = userData.isLoading && projectsList.isLoading;

    return (
        <userProfileContext.Provider value={{ userData: userData.data || null, projectsList: projectsList.data || null }}>
            {children}
            {isFetchingData ? <AbsolutePositionedSpinner /> : null}
            {!isFetchingData && !userData.data ? (
                <NotFoundPage title="User not found" description={`No user exists with username or ID of "${userName}"`} />
            ) : null}
        </userProfileContext.Provider>
    );
};
