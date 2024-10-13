import useFetch from "@/src/hooks/fetch";
import type { LoggedInUserData } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { reactQueryClient } from "../providers";
import { getSessionDataQuery } from "./_loaders";

type AuthContextType = {
    session: LoggedInUserData | null | undefined;
    logout: () => Promise<void>;
    validateSession: () => Promise<void>;
    invalidateSessionQuery: () => Promise<void>;
    isFetchingInitialData: boolean;
    isFetchingData: boolean;
    isRefetchingData: boolean;
};

// undefined state is initial, null is for when the context has been initialized but session is empty
export const AuthContext = createContext<AuthContextType>({
    session: undefined,
    logout: async () => {},
    validateSession: async () => {},
    invalidateSessionQuery: async () => {},
    isFetchingInitialData: true,
    isFetchingData: true,
    isRefetchingData: false,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const sessionData = useQuery(getSessionDataQuery());
    const navigate = useNavigate();

    const logout = async () => {
        await useFetch("/api/auth/sessions", {
            method: "DELETE",
        });

        invalidateSessionQuery();
        navigate(window.location.href.replace(window.location.origin, ""));
    };

    async function validateSession() {
        await sessionData.refetch();
    }

    async function invalidateSessionQuery() {
        await reactQueryClient.invalidateQueries(getSessionDataQuery());
    }

    return (
        <AuthContext.Provider
            value={{
                session: sessionData.data,
                logout,
                validateSession,
                invalidateSessionQuery,
                isFetchingInitialData: sessionData.isLoading,
                isFetchingData: sessionData.isFetching,
                isRefetchingData: sessionData.isRefetching,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useSession = () => {
    return useContext(AuthContext);
};
