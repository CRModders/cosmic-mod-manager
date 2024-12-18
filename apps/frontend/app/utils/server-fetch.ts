import { getSessionIp } from "@app/utils/headers";
import Config from "./config";

export async function serverFetch(clientReq: Request, pathname: string, init?: RequestInit): Promise<Response> {
    function getHeader(key: string) {
        return clientReq.headers.get(key);
    }

    try {
        const startTime = Date.now();
        const backendHost = Config.BACKEND_URL_LOCAL;

        let fetchUrl = pathname;
        const clientIp = getSessionIp(getHeader, "::1");
        const userAgent = getHeader("User-Agent") || "";

        const headers = {
            "X-Forwarded-For": clientIp,
            "User-Agent": userAgent,

            "x-client-ip": clientIp,
            "x-identity-token": "",
            Cookie: "",
        };

        if (fetchUrl.startsWith("/")) {
            fetchUrl = `${backendHost}${fetchUrl}`;
            headers.Cookie = getHeader("Cookie") || "";
            headers["x-identity-token"] = process.env.FRONTEND_SECRET || "";
        }

        const res = await fetch(fetchUrl, {
            ...init,
            headers: { ...init?.headers, ...headers },
        });

        console.log(`${pathname} ${Date.now() - startTime}ms | ${clientIp}`);
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
