import Config from "@root/utils/config";

export async function serverFetch(clientReq: Request, pathname: string, init?: RequestInit): Promise<Response> {
    let fetchUrl = pathname;

    const clientIp = clientReq.headers.get("x-forwarded-for") || clientReq.headers.get("x-real-ip") || "0.0.0.0";
    const userAgent = clientReq.headers.get("User-Agent") || "";

    const headers = {
        "X-Forwarded-For": clientIp,
        "User-Agent": userAgent,

        "x-client-ip": clientIp,
        "x-identity-token": "",
        Cookie: "",
    };

    console.log("");
    console.log("IP: ", clientIp);

    if (fetchUrl.startsWith("/")) {
        fetchUrl = `${Config.BACKEND_URL}${fetchUrl}`;
        headers.Cookie = clientReq.headers.get("Cookie") || "";
    }

    const res = await fetch(fetchUrl, {
        ...init,
        headers: { ...init?.headers, ...headers },
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
