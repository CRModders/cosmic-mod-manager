/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import { createReadableStreamFromReadable } from "@react-router/node";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { useUrlLocale } from "~/utils/urls";
import { getLocale } from "./locales";
import { GetLocaleMetadata } from "./locales/meta";
import { LocaleProvider } from "./locales/provider";

const ABORT_DELAY = 7_000;

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    reactRouterContext: EntryContext,
) {
    return handleDocRequest(request, responseStatusCode, responseHeaders, reactRouterContext);
}

function handleDocRequest(request: Request, responseStatusCode: number, responseHeaders: Headers, reactRouterContext: EntryContext) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;

        const localeCode = useUrlLocale(true, new URL(request.url).pathname);
        getLocale(localeCode).then((initLocaleModule) => {
            const initLocaleMetadata = GetLocaleMetadata(localeCode);

            const { pipe, abort } = renderToPipeableStream(
                <LocaleProvider initLocale={initLocaleModule} initMetadata={initLocaleMetadata}>
                    <ServerRouter context={reactRouterContext} url={request.url} abortDelay={ABORT_DELAY} />
                </LocaleProvider>,

                {
                    onShellReady() {
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
                        // Log streaming rendering errors from inside the shell.  Don't log
                        // errors encountered during initial shell rendering since they'll
                        // reject and get logged in handleDocumentRequest.
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
