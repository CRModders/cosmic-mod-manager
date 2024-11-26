import { useOutletContext } from "@remix-run/react";
import OrganizationPage from "~/pages/organization/page";
import type { OrgDataContext } from "./data-wrapper";

export default function _OrganizationPage() {
    const { orgProjects } = useOutletContext<OrgDataContext>();

    return <OrganizationPage projectsList={orgProjects} />;
}
