export const SERVER_URL = import.meta.env.PUBLIC_BACKEND_SERVER_URL;
export const FRONTEND_URL = window.location.origin;

export default async function useFetch(path: string, init?: FetchRequestInit | undefined) {
    return await fetch(`${SERVER_URL}${path}`, {
        ...init,
        credentials: "include",
    });
}
