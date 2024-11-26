import type { LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { type ShouldRevalidateFunctionArgs, useLoaderData, useOutletContext } from "@remix-run/react";
import type { AwaitedReturnType } from "@root/types";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import type { Organisation, ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import ClientOnly from "~/components/client-only";
import UserPageLayout from "~/pages/user/layout";
import type { RootOutletData } from "~/root";

export default function _UserLayout() {
    const { session } = useOutletContext<RootOutletData>();
    const data = useLoaderData<typeof loader>();

    return (
        <ClientOnly
            Element={() => (
                <UserPageLayout session={session} userData={data.userData} projectsList={data.projects || []} orgsList={data.orgs || []} />
            )}
        />
    );
}

export async function loader(props: LoaderFunctionArgs) {
    const userName = props.params.userName;

    if (!userName)
        return {
            userData: null,
            projects: [],
            orgs: [],
        };

    const [userRes, projectsRes, orgsRes] = await Promise.all([
        serverFetch(props.request, `/api/user/${userName}`),
        serverFetch(props.request, `/api/user/${userName}/projects?listedOnly=true`),
        serverFetch(props.request, `/api/user/${userName}/organization`),
    ]);

    const userData = await resJson<UserProfileData>(userRes);
    const projects = await resJson<ProjectListItem[]>(projectsRes);
    const orgs = await resJson<Organisation[]>(orgsRes);

    return {
        userData: userData,
        projects: projects,
        orgs: orgs,
    };
}

export function meta(props: MetaArgs) {
    const { userData } = props.data as AwaitedReturnType<typeof loader>;
    const image = userData?.avatarUrl || `${Config.FRONTEND_URL}/icon.png`;

    return MetaTags({
        title: userData?.userName || "",
        description: `${userData?.bio} - Download ${userData?.userName}'s projects on ${SITE_NAME_SHORT}`,
        image: image,
        url: `${Config.FRONTEND_URL}/user/${userData?.userName}`,
        suffixTitle: true,
    });
}

export function shouldRevalidate({ currentParams, nextParams, nextUrl, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
    const currentId = currentParams.userName;
    const nextId = nextParams.userName;

    if (currentId === nextId) return false;

    return defaultShouldRevalidate;
}
