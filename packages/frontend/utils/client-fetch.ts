import Config from "./config";

export default async function clientFetch(pathname: string, init?: RequestInit): Promise<Response> {
    const startTime = Date.now();

    let fetchPath = pathname;
    let credentials: RequestCredentials = "same-origin";

    if (fetchPath.startsWith("/")) {
        fetchPath = fetchUrl(pathname);
        credentials = "include";
    }

    const res = await fetch(fetchPath, {
        credentials: credentials,
        ...init,
    });

    console.log(`[Fetch] ${pathname} ${Date.now() - startTime}ms`);
    return res;
}

// Not prefixing non-localhost URLs so that vite can proxy them to the defined proxy in vite.config.ts (Only for development)
function fetchUrl(path: string) {
    const origin = window?.location?.origin;

    if (Config?.proxy === true && origin.includes("localhost")) {
        return path;
    }

    return `${Config.BACKEND_URL}${path}`;
}
