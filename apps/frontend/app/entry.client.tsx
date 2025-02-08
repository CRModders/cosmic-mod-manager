import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { getLocale } from "~/locales";
import { GetLocaleMetadata } from "~/locales/meta";
import { LocaleProvider } from "~/locales/provider";
import { useUrlLocale } from "~/utils/urls";

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
