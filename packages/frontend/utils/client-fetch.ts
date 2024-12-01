import Config from "./config";

export default async function clientFetch(pathname: string, init?: RequestInit): Promise<Response> {
    const startTime = Date.now();

    let fetchUrl = pathname;
    let credentials: RequestCredentials = "omit";

    if (fetchUrl.startsWith("/")) {
        fetchUrl = `${Config.BACKEND_URL}${fetchUrl}`;
        credentials = "include";
    }

    const res = await fetch(fetchUrl, {
        credentials: credentials,
        ...init,
    });

    console.log(`[Fetch] ${pathname} ${Date.now() - startTime}ms`);
    return res;
}
