import Config from "@root/utils/config";

export async function serverFetch(clientReq: Request, pathname: string, init?: RequestInit): Promise<Response> {
    try {
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

        if (fetchUrl.startsWith("/")) {
            fetchUrl = `${Config.BACKEND_URL}${fetchUrl}`;
            headers.Cookie = clientReq.headers.get("Cookie") || "";
            headers["x-identity-token"] = process.env.FRONTEND_SECRET || "";
        }

        const res = await fetch(fetchUrl, {
            ...init,
            headers: { ...init?.headers, ...headers },
        });

        return res;
    } catch (error) {
        return new Response(null, { status: 500 });
    }
}

export async function resJson<T>(res: Response): Promise<T | null> {
    try {
        return (await res.json()) as T;
    } catch {
        return null;
    }
}
