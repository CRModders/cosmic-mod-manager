import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import type { ProfilePageProjectsListData } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/fetch";
import NotFoundPage from "../pages/not-found";

interface UserProfileContext {
    userData: UserProfileData | null;
    projectsList: ProfilePageProjectsListData[] | null;
}

export const userProfileContext = createContext<UserProfileContext>({ userData: null, projectsList: null });

const getUserProfileData = async (userName: string | undefined) => {
    if (!userName) return null;

    try {
        const response = await useFetch(`/api/user/_/${userName}`);
        return ((await response.json())?.user as UserProfileData) || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const getProjectsListData = async (userName: string | undefined) => {
    if (!userName) return null;

    try {
        const response = await useFetch(`/api/user/_/${userName}/projects`);
        return ((await response.json())?.projects as ProfilePageProjectsListData[]) || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const UserProfileContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { userName } = useParams();
    const [isFetchingData, setIsFetchingData] = useState(true);

    const userData = useQuery({ queryKey: [`user-profile-${userName}`], queryFn: () => getUserProfileData(userName) });
    const projectsList = useQuery({ queryKey: [`user-projects-${userName}`], queryFn: () => getProjectsListData(userName) });

    useEffect(() => {
        if (userData.isLoading || projectsList.isLoading) {
            setIsFetchingData(true);
        } else {
            setIsFetchingData(false);
        }
    }, [userData.isLoading, projectsList.isLoading]);

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
