import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { getLocale } from "./locales";
import { GetLocaleMetadata } from "./locales/meta";
import { LocaleProvider } from "./locales/provider";
import { useUrlLocale } from "./utils/urls";

const ABORT_DELAY = 5000;

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
    _loadContext: AppLoadContext,
) {
    const AbortSignal = new AbortController();

    const response = new Promise(async (resolve) => {
        let shellRendered = false;
        const userAgent = request.headers.get("user-agent");

        const localeCode = useUrlLocale(true, new URL(request.url).pathname);
        const initLocaleModule = await getLocale(localeCode);
        const initLocaleMetadata = GetLocaleMetadata(localeCode);

        const stream = await renderToReadableStream(
            <LocaleProvider initLocale={initLocaleModule} initMetadata={initLocaleMetadata}>
                <ServerRouter context={routerContext} url={request.url} />
            </LocaleProvider>,
            {
                onError(error: unknown) {
                    responseStatusCode = 500;
                    if (shellRendered) {
                        console.error(error);
                    }
                },
                signal: AbortSignal.signal,
            },
        );
        shellRendered = true;

        if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) await stream.allReady;

        responseHeaders.set("Content-Type", "text/html");
        resolve(
            new Response(stream, {
                headers: responseHeaders,
                status: responseStatusCode,
            }),
        );
    });

    // Abort the request after a delay to prevent hanging requests
    setTimeout(() => {
        AbortSignal.abort();
    }, ABORT_DELAY);

    return response;
}
