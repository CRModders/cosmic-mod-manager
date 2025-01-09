import { PassThrough } from "node:stream";

import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import ReactDomServer, { type RenderToPipeableStreamOptions } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { getLocale } from "./locales";
import { GetLocaleMetadata } from "./locales/meta";
import { LocaleProvider } from "./locales/provider";
import { useUrlLocale } from "./utils/urls";

const ABORT_DELAY = 5000;

export default function handleRequest(request: Request, responseStatusCode: number, responseHeaders: Headers, routerContext: EntryContext) {
    if (import.meta.env.DEV) {
        return HandleReq_Dev(request, responseStatusCode, responseHeaders, routerContext);
    } else if (import.meta.env.PROD) {
        return HandleReq_Prod(request, responseStatusCode, responseHeaders, routerContext);
    }
}

function HandleReq_Prod(request: Request, responseStatusCode: number, responseHeaders: Headers, routerContext: EntryContext) {
    const AbortSignal = new AbortController();

    const response = new Promise(async (resolve) => {
        let shellRendered = false;
        const userAgent = request.headers.get("user-agent");

        const localeCode = useUrlLocale(true, new URL(request.url).pathname);
        const initLocaleModule = await getLocale(localeCode);
        const initLocaleMetadata = GetLocaleMetadata(localeCode);

        const stream = await ReactDomServer.renderToReadableStream(
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

function HandleReq_Dev(request: Request, responseStatusCode: number, responseHeaders: Headers, routerContext: EntryContext) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        let userAgent = request.headers.get("user-agent");

        let readyOption: keyof RenderToPipeableStreamOptions =
            (userAgent && isbot(userAgent)) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";

        const localeCode = useUrlLocale(true, new URL(request.url).pathname);
        getLocale(localeCode).then(async (initLocaleModule) => {
            const initLocaleMetadata = GetLocaleMetadata(localeCode);

            const { pipe, abort } = ReactDomServer.renderToPipeableStream(
                <LocaleProvider initLocale={initLocaleModule} initMetadata={initLocaleMetadata}>
                    <ServerRouter context={routerContext} url={request.url} />
                </LocaleProvider>,
                {
                    [readyOption]() {
                        shellRendered = true;
                        const body = new PassThrough();
                        const stream = createReadableStreamFromReadable(body);

                        responseHeaders.set("Content-Type", "text/html");

                        resolve(
                            new Response(stream, {
                                headers: responseHeaders,
                                status: responseStatusCode,
                            }),
                        );

                        pipe(body);
                    },
                    onShellError(error: unknown) {
                        reject(error);
                    },
                    onError(error: unknown) {
                        responseStatusCode = 500;
                        if (shellRendered) {
                            console.error(error);
                        }
                    },
                },
            );

            setTimeout(abort, ABORT_DELAY);
        });
    });
}
