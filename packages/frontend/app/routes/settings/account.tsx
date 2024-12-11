import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import type { LinkedProvidersListData } from "@shared/types";
import { useLoaderData } from "react-router";
import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import AccountSettingsPage from "~/pages/settings/account/page";
import type { Route } from "./+types/account";

export default function _AccountSettings() {
    const session = useSession();
    const linkedProviders = useLoaderData() as LinkedProvidersListData[];

    if (!session?.id) return <Redirect to="/login" />;
    return <AccountSettingsPage session={session} linkedAuthProviders={linkedProviders || []} />;
}

export async function loader(props: Route.LoaderArgs): Promise<LinkedProvidersListData[]> {
    const res = await serverFetch(props.request, "/api/auth/linked-providers");
    const providersList = await resJson<LinkedProvidersListData[]>(res);

    return providersList || [];
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
