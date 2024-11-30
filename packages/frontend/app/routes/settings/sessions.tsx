import type { LoaderFunctionArgs } from "@remix-run/node";
import { Navigate, useLoaderData, useOutletContext } from "@remix-run/react";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import type { SessionListData } from "@shared/types/api";
import ClientOnly from "~/components/client-only";
import SessionsPage from "~/pages/settings/sessions/page";
import type { RootOutletData } from "~/routes/layout";

export default function _Sessions() {
    const { session } = useOutletContext<RootOutletData>();
    const { sessionsList } = useLoaderData<typeof loader>();

    if (!session?.id) return <Navigate to="/login" />;
    return <ClientOnly Element={() => <SessionsPage session={session} loggedInSessions={sessionsList} />} />;
}

export async function loader(props: LoaderFunctionArgs) {
    const res = await serverFetch(props.request, "/api/auth/sessions");
    const data = await resJson(res);

    return {
        sessionsList: (data as SessionListData[]) || [],
    };
}

export function meta() {
    return MetaTags({
        title: "Sessions",
        description: "All the devices where you are logged in",
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/settings/sessions`,
        suffixTitle: true,
    });
}
