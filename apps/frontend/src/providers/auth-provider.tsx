import type { LocalUserSession, OAuthCallbackHandlerResult } from "@root/types";
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
	logout: async () => {},
	// @ts-ignore
	handleOAuthCallback: async (fetchReq: Promise<Response>) => {},
	validateSession: async () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [session, setSession] = useState<LocalUserSession | null | undefined>(undefined);

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
		const res = await useFetch("/api/auth/session/validate");
		const data = await res.json();

		if (!data?.isValid) {
			setSession(null);
		}

		setSession((data?.session as LocalUserSession) || null);
	};

	const initialiseAuthContext = async () => {
		await validateSession();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		initialiseAuthContext();
	}, []);

	return (
		<AuthContext.Provider value={{ session, setNewSession, logout, handleOAuthCallback, validateSession }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
