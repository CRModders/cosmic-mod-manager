import Config from "./config";

export default async function clientFetch(pathname: string, init?: RequestInit): Promise<Response> {
    let fetchUrl = pathname;
    let credentials: RequestCredentials = "omit";

    if (fetchUrl.startsWith("/")) {
        fetchUrl = `${Config.BACKEND_URL}${fetchUrl}`;
        credentials = "include";
    }

    return await fetch(fetchUrl, {
        credentials: credentials,
        ...init,
    });
}
