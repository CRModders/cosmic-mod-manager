const abortControllerMap = new Map<string, AbortController>();

export default async function useFetch(url: string | Request | URL, init?: FetchRequestInit | undefined) {
    const existingAbortController = abortControllerMap.get(url.toString());
    if (existingAbortController) existingAbortController.abort();

    const abortController = new AbortController();
    abortControllerMap.set(url.toString(), abortController);

    try {
        return await fetch(`${import.meta.env.VITE_SERVER_URL}${url}`, {
            ...init,
            signal: init?.signal ? init.signal : abortController.signal,
            credentials: "include",
        });
    } finally {
        abortControllerMap.delete(url.toString());
    }
}
