import type { LoaderFunctionArgs } from "@remix-run/node";
import { Navigate, useLoaderData, useOutletContext } from "@remix-run/react";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import ClientOnly from "~/components/client-only";
import AccountSettingsPage from "~/pages/settings/account/page";
import type { RootOutletData } from "~/routes/layout";

export default function _AccountSettings() {
    const { session } = useOutletContext<RootOutletData>();
    const { linkedProviders } = useLoaderData<typeof loader>();

    if (!session?.id) return <Navigate to="/login" />;

    return <ClientOnly Element={() => <AccountSettingsPage session={session} linkedAuthProviders={linkedProviders || []} />} />;
}

export async function loader(props: LoaderFunctionArgs) {
    const res = await serverFetch(props.request, "/api/auth/linked-providers");
    const data = await resJson(res);

    return {
        linkedProviders: data,
    };
}

export function meta() {
    return MetaTags({
        title: "Account settings",
        description: `Your ${SITE_NAME_SHORT} account settings`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/settings/account`,
        suffixTitle: true,
    });
}
