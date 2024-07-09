export default async function useFetch(url: string | Request | URL, init?: FetchRequestInit | undefined) {
    return await fetch(`${import.meta.env.VITE_SERVER_URL}${url}`, {
        ...init,
        credentials: "include",
    });
}
