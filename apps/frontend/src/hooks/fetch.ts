export default function useFetch(url: string | Request | URL, init?: FetchRequestInit | undefined) {
    return fetch(`${import.meta.env.VITE_SERVER_URL}${url}`, {
        ...init,
        credentials: "include",
    });
}
