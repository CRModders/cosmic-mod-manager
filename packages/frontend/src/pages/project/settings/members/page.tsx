import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/spinner";
import { getUserOrgsListQuery } from "@/src/contexts/_loaders";
import { useSession } from "@/src/contexts/auth";
import { projectContext } from "@/src/contexts/curr-project";
import { doesMemberHaveAccess } from "@shared/lib/utils";
import { ProjectPermission } from "@shared/types";
import type { TeamMember } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import { UserXIcon } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { OrgTeamMember, ProjectTeamMember } from "./edit-member";
import InviteMemberForm from "./invite-member";
import { RemoveProjectFromOrg, TransferProjectManagementCard } from "./transfer-management";
import { leaveTeam } from "./utils";

const ProjectMemberSettingsPage = () => {
    const { session } = useSession();
    const { projectData, fetchProjectData, currUsersMembership, invalidateAllQueries } = useContext(projectContext);
    const currUsersMembershipData = currUsersMembership.data;
    const userOrgs = !projectData?.organisation ? useQuery(getUserOrgsListQuery(session?.userName)) : null;

    if (!projectData || !currUsersMembershipData) return null;
    const canInviteMembers = doesMemberHaveAccess(
        ProjectPermission.MANAGE_INVITES,
        currUsersMembershipData.permissions,
        currUsersMembershipData.isOwner,
    );

    return (
        <>
            <Card className="w-full flex flex-col p-card-surround gap-4">
                <CardTitle>Manage members</CardTitle>
                <InviteMemberForm teamId={projectData.teamId} canInviteMembers={canInviteMembers} dataRefetch={fetchProjectData} />
                <LeaveTeam teamId={projectData.teamId} currUsersMembership={currUsersMembershipData} refreshData={fetchProjectData} />
            </Card>

            {projectData.members
                .filter((member) => !projectData.organisation?.members?.some((orgMember) => orgMember.userId === member.userId))
                .map((member) => (
                    <ProjectTeamMember
                        key={member.userId}
                        member={member}
                        currUsersMembership={currUsersMembershipData}
                        fetchProjectData={fetchProjectData}
                    />
                ))}

            {userOrgs?.data?.length && !projectData.organisation ? (
                <TransferProjectManagementCard
                    organisations={userOrgs.data || []}
                    projectId={projectData.id}
                    invalidateProjectPageQueries={invalidateAllQueries}
                />
            ) : null}

            {projectData.organisation ? (
                <RemoveProjectFromOrg
                    org={projectData.organisation}
                    projectId={projectData.id}
                    invalidateProjectPageQueries={invalidateAllQueries}
                />
            ) : null}

            {projectData.organisation?.members?.map((member) => (
                <OrgTeamMember
                    key={member.userId}
                    project={projectData}
                    orgMembership={member}
                    currUsersMembership={currUsersMembershipData}
                    fetchProjectData={fetchProjectData}
                />
            ))}
        </>
    );
};

export const Component = ProjectMemberSettingsPage;

export const LeaveTeam = ({
    currUsersMembership,
    teamId,
    refreshData,
}: { currUsersMembership: TeamMember; teamId: string; refreshData: () => Promise<void> }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLeaveProject = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const data = await leaveTeam(teamId);
            if (!data?.success) return toast.error(data?.message || "Error");

            await refreshData();
            return toast.success("You have left the project team");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <div>
                <h2 className="text-lg font-semibold">Leave project</h2>
                <p className="text-muted-foreground">Remove yourself as a member of this project.</p>
            </div>

            <Button
                variant="destructive"
                disabled={currUsersMembership.isOwner || currUsersMembership.teamId !== teamId || isLoading}
                onClick={handleLeaveProject}
            >
                {isLoading ? <LoadingSpinner size="xs" /> : <UserXIcon className="w-btn-icon-md h-btn-icon-md" strokeWidth={2.5} />}
                Leave project
            </Button>
        </div>
    );
};
