import type { LocalUserSession, OAuthCallbackHandlerResult } from "@root/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import useFetch from "../hooks/fetch";

type AuthContextType = {
    session: LocalUserSession | null | undefined;
    setNewSession: (newSession: Partial<LocalUserSession>) => void;
    logout: () => Promise<void>;
    handleOAuthCallback: (fetchReq: Promise<Response>) => Promise<OAuthCallbackHandlerResult>;
    validateSession: () => Promise<void>;
};

// undefined state is initial, null is for when the context has been initialized but session is empty
export const AuthContext = createContext<AuthContextType>({
    session: undefined,
    setNewSession: (newSession: Partial<LocalUserSession>) => {
        newSession;
    },
    logout: async () => { },
    // @ts-ignore
    handleOAuthCallback: async (fetchReq: Promise<Response>) => { },
    validateSession: async () => { },
});

const getSessionData = async () => {
    try {
        const response = await useFetch("/api/auth/session/validate");
        return (await response.json())?.session || null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<LocalUserSession | null | undefined>(undefined);

    const sessionData = useQuery({ queryKey: ["auth-session-data"], queryFn: () => getSessionData() })

    const setNewSession = (newSession: Partial<LocalUserSession>) => {
        if (session && newSession) {
            setSession({ ...session, ...newSession });
        } else {
            setSession(newSession as LocalUserSession);
        }
    };

    const handleOAuthCallback = async (fetchReq: Promise<Response>) => {
        const res = await fetchReq;
        const result = await res.json();

        return result as OAuthCallbackHandlerResult;
    };

    const logout = async () => {
        await useFetch("/api/auth/session/logout", {
            method: "POST",
            body: JSON.stringify({ session }),
        });

        setSession(null);
        window.location.href = `${window.location.href}`;
    };

    const validateSession = async () => {
        await sessionData.refetch();
    };

    useEffect(() => {
        setSession(sessionData.data || null);
    }, [sessionData.data])

    return (
        <AuthContext.Provider value={{ session, setNewSession, logout, handleOAuthCallback, validateSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
