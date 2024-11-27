import { useLocation, useNavigate, useOutletContext } from "@remix-run/react";
import { doesOrgMemberHaveAccess } from "@shared/lib/utils";
import { OrganisationPermission } from "@shared/types";
import { Helmet } from "react-helmet";
import RefreshPage from "~/components/refresh-page";
import { Card, CardTitle } from "~/components/ui/card";
import InviteMemberForm from "~/pages/project/settings/members/invite-member";
import { LeaveTeam } from "~/pages/project/settings/members/page";
import type { OrgDataContext } from "~/routes/organization/data-wrapper";
import { OrgTeamMember } from "./edit-member";

export default function OrgMemberSettings() {
    const { orgData, currUsersMembership } = useOutletContext<OrgDataContext>();
    const navigate = useNavigate();
    const location = useLocation();

    if (!currUsersMembership) return null;

    const refreshOrgData = async () => {
        RefreshPage(navigate, location);
    };

    const canInviteMembers = doesOrgMemberHaveAccess(
        OrganisationPermission.MANAGE_INVITES,
        currUsersMembership.organisationPermissions,
        currUsersMembership.isOwner,
    );

    return (
        <>
            <Helmet>
                <title>Members - {orgData.name}</title>
            </Helmet>

            <Card className="w-full flex flex-col p-card-surround gap-4">
                <CardTitle>Manage members</CardTitle>
                <InviteMemberForm teamId={orgData.teamId} canInviteMembers={canInviteMembers} dataRefetch={refreshOrgData} isOrg />
                <LeaveTeam teamId={orgData.teamId} currUsersMembership={currUsersMembership} refreshData={refreshOrgData} />
            </Card>

            {orgData.members.map((member) => {
                return (
                    <OrgTeamMember
                        key={member.userId}
                        org={orgData}
                        member={member}
                        currMember={currUsersMembership}
                        fetchOrgData={refreshOrgData}
                    />
                );
            })}
        </>
    );
}
