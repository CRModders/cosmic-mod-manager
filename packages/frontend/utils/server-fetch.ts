export async function serverFetch(clientReq: Request, pathname: string, init?: RequestInit): Promise<Response> {
    try {
        const startTime = Date.now();

        const backendHost = process.env.BACKEND_HOST || "http://localhost:5500";
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
            fetchUrl = `${backendHost}${fetchUrl}`;
            headers.Cookie = clientReq.headers.get("Cookie") || "";
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
