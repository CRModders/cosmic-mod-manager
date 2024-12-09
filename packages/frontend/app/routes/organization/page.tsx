import { useOutletContext } from "react-router";
import OrganizationPage from "~/pages/organization/page";
import type { OrgDataContext } from "./data-wrapper";

export default function _OrganizationPage() {
    const { orgProjects } = useOutletContext<OrgDataContext>();

    return <OrganizationPage projectsList={orgProjects} />;
}
