import type { AuthProvidersEnum } from "@root/types";
import useFetch from "../hooks/fetch";

export const authConfig = {
    baseUrl: import.meta.env.VITE_SERVER_URL,
    basePath: "/api/auth",
};

export const getSignInUrl = async (provider: AuthProvidersEnum): Promise<string> => {
    const res = await useFetch(`${authConfig.basePath}/signin/${provider}`);
    return (await res.json())?.signinUrl as string;
};
