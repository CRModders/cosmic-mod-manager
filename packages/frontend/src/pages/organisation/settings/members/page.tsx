import { Card, CardTitle } from "@/components/ui/card";
import InviteMemberForm from "@/src/pages/project/settings/members/invite-member";
import { LeaveTeam } from "@/src/pages/project/settings/members/page";
import { doesOrgMemberHaveAccess } from "@shared/lib/utils";
import { OrganisationPermission } from "@shared/types";
import { useContext } from "react";
import { orgDataContext } from "../../org-context";
import { OrgTeamMember } from "./edit-member";

const OrgMemberSettings = () => {
    const { orgData, fetchOrgData, currUsersMembership } = useContext(orgDataContext);

    if (!orgData || !currUsersMembership) return null;
    const canInviteMembers = doesOrgMemberHaveAccess(
        OrganisationPermission.MANAGE_INVITES,
        currUsersMembership.organisationPermissions,
        currUsersMembership.isOwner,
    );

    return (
        <>
            <Card className="w-full flex flex-col p-card-surround gap-4">
                <CardTitle>Manage members</CardTitle>
                <InviteMemberForm teamId={orgData.teamId} canInviteMembers={canInviteMembers} dataRefetch={fetchOrgData} isOrg />
                <LeaveTeam teamId={orgData.teamId} currUsersMembership={currUsersMembership} refreshData={fetchOrgData} />
            </Card>

            {orgData.members.map((member) => {
                return (
                    <OrgTeamMember
                        key={member.userId}
                        org={orgData}
                        member={member}
                        currMember={currUsersMembership}
                        fetchOrgData={fetchOrgData}
                    />
                );
            })}
        </>
    );
};

export const Component = OrgMemberSettings;
