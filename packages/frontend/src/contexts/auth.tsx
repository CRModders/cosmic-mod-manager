import type { LoggedInUserData } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import useFetch from "@/src/hooks/fetch";

type AuthContextType = {
    session: LoggedInUserData | null | undefined;
    setNewSession: (newSession: Partial<LoggedInUserData>) => void;
    logout: () => Promise<void>;
    validateSession: () => Promise<void>;
    isFetchingInitialData: boolean;
    isFetchingData: boolean;
    isRefetchingData: boolean;
};

// undefined state is initial, null is for when the context has been initialized but session is empty
export const AuthContext = createContext<AuthContextType>({
    session: undefined,
    setNewSession: (newSession: Partial<LoggedInUserData>) => {
        newSession;
    },
    logout: async () => {},
    validateSession: async () => {},
    isFetchingInitialData: true,
    isFetchingData: true,
    isRefetchingData: false,
});

const getSessionData = async () => {
    try {
        const response = await useFetch("/api/auth/me");
        return (await response.json()) || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<LoggedInUserData | null | undefined>(undefined);

    const sessionData = useQuery({ queryKey: ["auth-session-data"], queryFn: () => getSessionData() });

    const setNewSession = (newSession: Partial<LoggedInUserData>) => {
        if (session && newSession) {
            setSession({ ...session, ...newSession });
        } else {
            setSession(newSession as LoggedInUserData);
        }
    };

    const logout = async () => {
        await useFetch("/api/auth/session/logout", {
            method: "POST",
            body: JSON.stringify(session),
        });

        setSession(null);
    };

    const validateSession = async () => {
        await sessionData.refetch();
    };

    useEffect(() => {
        setSession(sessionData.data);
    }, [sessionData.data]);

    return (
        <AuthContext.Provider
            value={{
                session,
                setNewSession,
                logout,
                validateSession,
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
