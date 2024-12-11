import { doesOrgMemberHaveAccess } from "@shared/lib/utils";
import { OrganisationPermission } from "@shared/types";
import { useLocation, useNavigate } from "react-router";
import RefreshPage from "~/components/refresh-page";
import { CardTitle, SectionCard } from "~/components/ui/card";
import { useOrgData } from "~/hooks/org";
import { useSession } from "~/hooks/session";
import InviteMemberForm from "~/pages/project/settings/members/invite-member";
import { LeaveTeam } from "~/pages/project/settings/members/page";
import { OrgTeamMember } from "./edit-member";

export default function OrgMemberSettings() {
    const session = useSession();
    const ctx = useOrgData();
    const currUsersMembership = ctx.currUsersMembership;
    const orgData = ctx.orgData;

    const navigate = useNavigate();
    const location = useLocation();

    async function refreshOrgData() {
        RefreshPage(navigate, location);
    }

    if (!currUsersMembership) return null;
    const canInviteMembers = doesOrgMemberHaveAccess(
        OrganisationPermission.MANAGE_INVITES,
        currUsersMembership.organisationPermissions,
        currUsersMembership.isOwner,
        session?.role,
    );

    return (
        <>
            <title>{`Members - ${orgData.name}`}</title>

            <SectionCard className="w-full flex flex-col p-card-surround gap-4">
                <CardTitle>Manage members</CardTitle>
                <InviteMemberForm teamId={orgData.teamId} canInviteMembers={canInviteMembers} dataRefetch={refreshOrgData} isOrg />
                <LeaveTeam teamId={orgData.teamId} currUsersMembership={currUsersMembership} refreshData={refreshOrgData} />
            </SectionCard>

            {orgData.members.map((member) => {
                return (
                    <OrgTeamMember
                        session={session}
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
