import Config from "./config";

export default async function clientFetch(pathname: string, init?: RequestInit): Promise<Response> {
    let fetchUrl = pathname;
    if (fetchUrl.startsWith("/")) fetchUrl = `${Config.BACKEND_URL}${fetchUrl}`;

    return await fetch(fetchUrl, {
        credentials: "include",
        ...init,
    });
}
