import { useOutletContext } from "react-router";
import UserProjectsList from "~/pages/user/page";
import type { UserOutletData } from "~/routes/user/layout";

export default function _UserProjects() {
    const { projectsList } = useOutletContext<UserOutletData>();

    if (!projectsList) return null;
    return <UserProjectsList projectsList={projectsList} />;
}
