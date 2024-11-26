import Config from "@root/utils/config";

export async function serverFetch(clientReq: Request, pathname: string, init?: RequestInit): Promise<Response> {
    let fetchUrl = pathname;
    if (fetchUrl.startsWith("/")) fetchUrl = `${Config.BACKEND_URL}${fetchUrl}`;

    const res = await fetch(fetchUrl, {
        ...init,
        headers: {
            "User-Agent": clientReq.headers.get("User-Agent") || "",
            "x-client-ip": clientReq.headers.get("x-forwarded-for") || clientReq.headers.get("x-real-ip") || "",
            "x-identity-token": process.env.IDENTITY_SECRET || "",
            Cookie: clientReq.headers.get("Cookie") || "",
            ...init?.headers,
        },
    });

    return res;
}

export async function resJson<T>(res: Response): Promise<T | null> {
    try {
        return (await res.json()) as T;
    } catch {
        return null;
    }
}
