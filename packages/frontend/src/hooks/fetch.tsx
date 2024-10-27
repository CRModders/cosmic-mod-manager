export const SERVER_URL = import.meta.env.PUBLIC_BACKEND_SERVER_URL;

export default async function useFetch(path: string | Request | URL, init?: FetchRequestInit | undefined) {
    return await fetch(`${SERVER_URL}${path}`, {
        ...init,
        credentials: "include",
    });
}

if (!SERVER_URL) throw new Error("Environment variable BACKEND_SERVER_URL is not set!");
