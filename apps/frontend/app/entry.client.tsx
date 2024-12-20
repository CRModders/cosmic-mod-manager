/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { useUrlLocale } from "~/utils/urls";
import { getLocale } from "./locales";
import { GetLocaleMetadata } from "./locales/meta";
import { LocaleProvider } from "./locales/provider";

startTransition(async () => {
    const initLocaleModule = await getLocale(useUrlLocale(true));
    const initLocaleMetadata = GetLocaleMetadata(useUrlLocale(true));

    hydrateRoot(
        document,

        <LocaleProvider initLocale={initLocaleModule} initMetadata={initLocaleMetadata}>
            <HydratedRouter />
        </LocaleProvider>,
    );
});
