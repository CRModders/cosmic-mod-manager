import Config from "@root/utils/config";
import { LdJsonId, LdJsonIdType, MetaTags, OrganizationLdJson, ProjectLdJson, UserLdJson } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { UserProfilePath } from "@root/utils/urls";
import { SITE_NAME_SHORT } from "@shared/config";
import type { Organisation, ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import type { MetaDescriptor } from "react-router";
import { Outlet, type ShouldRevalidateFunctionArgs, useLoaderData } from "react-router";
import UserPageLayout from "~/pages/user/layout";
import NotFoundPage from "../$";
import type { Route } from "./+types/layout";

export interface UserOutletData {
    projectsList: ProjectListItem[];
}

export default function _UserLayout() {
    const data = useLoaderData() as LoaderData;

    if (!data.userData?.id) {
        return (
            <NotFoundPage
                title="User not found"
                description={`The user with username/ID "${data?.userSlug}" does not exist.`}
                linkHref="/"
                linkLabel="Home"
            />
        );
    }

    return (
        <UserPageLayout userData={data.userData} projectsList={data.projects || []} orgsList={data.orgs || []}>
            <Outlet
                context={
                    {
                        projectsList: data.projects,
                    } satisfies UserOutletData
                }
            />
        </UserPageLayout>
    );
}

interface LoaderData {
    userSlug?: string;
    userData: UserProfileData | null;
    projects: ProjectListItem[];
    orgs: Organisation[];
}

export async function loader(props: Route.LoaderArgs): Promise<LoaderData> {
    const userName = props.params.userName;

    if (!userName)
        return {
            userSlug: userName,
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
        userSlug: userName,
        userData: userData,
        projects: projects || [],
        orgs: orgs || [],
    };
}

export function meta(props: Route.MetaArgs): MetaDescriptor[] {
    const { userData, orgs, projects, userSlug } = props.data as LoaderData;
    const image = userData?.avatar || `${Config.FRONTEND_URL}/icon.png`;

    if (!userData?.id) {
        return MetaTags({
            title: "User not found",
            description: `No user with the username/ID ${userSlug} exists on ${SITE_NAME_SHORT}`,
            image: `${Config.FRONTEND_URL}/icon.png`,
            url: `${Config.FRONTEND_URL}${UserProfilePath(userSlug || "")}`,
            suffixTitle: true,
        });
    }

    const orgsData = orgs?.map((org) => OrganizationLdJson(org));
    let memberOf = {};
    if (orgsData?.length) memberOf = { memberOf: orgsData };

    const userJson = UserLdJson(userData, {
        ...memberOf,
    });

    // Projects
    const projectsJson = projects?.map((project) =>
        ProjectLdJson(project, {
            creator: {
                "@id": LdJsonId(userData.id, LdJsonIdType.Person),
            },
        }),
    );

    const ldJson = {
        "@context": "https://schema.org",
        "@graph": [userJson, ...(projectsJson || [])],
    };

    return MetaTags({
        title: userData?.userName || "",
        description: `${userData?.bio} - Download ${userData?.userName}'s projects on ${SITE_NAME_SHORT}`,
        image: image,
        url: `${Config.FRONTEND_URL}${UserProfilePath(userData?.userName)}`,
        suffixTitle: true,
        ldJson: ldJson,
    });
}

export function shouldRevalidate({ currentParams, nextParams, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
    const currentId = currentParams.userName?.toLowerCase();
    const nextId = nextParams.userName?.toLowerCase();

    if (currentId === nextId) return false;
    return defaultShouldRevalidate;
}
