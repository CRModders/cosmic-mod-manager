import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import type { SessionListData } from "@shared/types/api";
import { type LoaderFunctionArgs, Navigate, useLoaderData, useOutletContext } from "react-router";
import SessionsPage from "~/pages/settings/sessions/page";
import type { RootOutletData } from "~/root";

export default function _Sessions() {
    const { session } = useOutletContext<RootOutletData>();
    const loggedInSessions = useLoaderData() as SessionListData[];

    if (!session?.id) return <Navigate to="/login" />;
    return <SessionsPage session={session} loggedInSessions={loggedInSessions} />;
}

export async function loader(props: LoaderFunctionArgs): Promise<SessionListData[]> {
    const res = await serverFetch(props.request, "/api/auth/sessions");
    const sessions = await resJson<SessionListData[]>(res);

    return sessions || [];
}

export function meta() {
    return MetaTags({
        title: "User Sessions",
        description: "All the devices where you are logged in",
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/settings/sessions`,
        suffixTitle: true,
    });
}
