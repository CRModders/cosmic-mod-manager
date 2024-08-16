export default async function useFetch(url: string | Request | URL, init?: FetchRequestInit | undefined) {
    return await fetch(`${import.meta.env.PUBLIC_BACKEND_SERVER_URL}${url}`, {
        ...init,
        credentials: "include",
    });
}

export const SERVER_URL = import.meta.env.PUBLIC_BACKEND_SERVER_URL;
