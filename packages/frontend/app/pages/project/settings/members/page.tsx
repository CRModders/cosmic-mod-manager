import { hasRootAccess } from "@shared/config/roles";
import { doesMemberHaveAccess } from "@shared/lib/utils";
import { type LoggedInUserData, ProjectPermission } from "@shared/types";
import type { Organisation, TeamMember } from "@shared/types/api";
import { UserXIcon } from "lucide-react";
import { useState } from "react";
import { type Location, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import RefreshPage from "~/components/refresh-page";
import { Button, CancelButton } from "~/components/ui/button";
import { Card, CardTitle } from "~/components/ui/card";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { OrgTeamMember, ProjectTeamMember } from "./edit-member";
import InviteMemberForm from "./invite-member";
import { RemoveProjectFromOrg, TransferProjectManagementCard } from "./transfer-management";
import { leaveTeam } from "./utils";

interface Props {
    userOrgs: Organisation[];
}

export default function ProjectMemberSettingsPage({ userOrgs }: Props) {
    // Session cant be null here, as the user is redirected to login if they are not logged in
    const session = useSession() as LoggedInUserData;

    const ctx = useProjectData();
    const projectData = ctx.projectData;
    const currUsersMembership = ctx.currUsersMembership;

    const navigate = useNavigate();
    const location = useLocation();

    const canInviteMembers = doesMemberHaveAccess(
        ProjectPermission.MANAGE_INVITES,
        currUsersMembership?.permissions,
        currUsersMembership?.isOwner,
        session?.role,
    );

    const refreshProjectData = async (path: string | Location = location) => {
        RefreshPage(navigate, path);
    };

    return (
        <>
            <Card className="w-full flex flex-col p-card-surround gap-4">
                <CardTitle>Manage members</CardTitle>
                <InviteMemberForm teamId={projectData.teamId} canInviteMembers={canInviteMembers} dataRefetch={refreshProjectData} />
                {currUsersMembership ? (
                    <LeaveTeam teamId={projectData.teamId} currUsersMembership={currUsersMembership} refreshData={refreshProjectData} />
                ) : null}
            </Card>

            {projectData.members
                .filter((member) => !projectData.organisation?.members?.some((orgMember) => orgMember.userId === member.userId))
                .map((member) => (
                    <ProjectTeamMember
                        session={session}
                        key={member.userId}
                        member={member}
                        currUsersMembership={currUsersMembership}
                        fetchProjectData={refreshProjectData}
                        projectTeamId={projectData.teamId}
                        doesProjectHaveOrg={!!projectData.organisation}
                    />
                ))}

            {userOrgs?.length && !projectData.organisation && hasRootAccess(currUsersMembership?.isOwner, session.role) ? (
                <TransferProjectManagementCard organisations={userOrgs} projectId={projectData.id} />
            ) : null}

            {projectData.organisation ? <RemoveProjectFromOrg org={projectData.organisation} projectId={projectData.id} /> : null}

            {projectData.organisation?.members?.map((member) => (
                <OrgTeamMember
                    session={session}
                    key={member.userId}
                    project={projectData}
                    orgMember={member}
                    currUsersMembership={currUsersMembership}
                    fetchProjectData={refreshProjectData}
                />
            ))}
        </>
    );
}

export function LeaveTeam({
    currUsersMembership,
    teamId,
    refreshData,
    isOrgTeam,
}: { currUsersMembership: TeamMember; teamId: string; isOrgTeam?: boolean; refreshData: () => Promise<void> }) {
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
                <h2 className="text-lg font-semibold">{isOrgTeam === true ? "Leave organisation" : "Leave project"}</h2>
                <p className="text-muted-foreground">Remove yourself as a member of this {isOrgTeam ? "organization" : "project"}.</p>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary-destructive" disabled={currUsersMembership.isOwner || currUsersMembership.teamId !== teamId}>
                        <UserXIcon className="w-btn-icon-md h-btn-icon-md" strokeWidth={2.5} />
                        Leave {isOrgTeam ? "organisation" : "project"}
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Leave project</DialogTitle>
                    </DialogHeader>
                    <DialogBody className="flex flex-col gap-4">
                        <p>Are you sure you want to leave this team?</p>
                        <DialogFooter>
                            <DialogClose asChild>
                                <CancelButton />
                            </DialogClose>
                            <Button variant="destructive" disabled={isLoading} onClick={handleLeaveProject}>
                                {isLoading ? (
                                    <LoadingSpinner size="xs" />
                                ) : (
                                    <UserXIcon className="w-btn-icon-md h-btn-icon-md" strokeWidth={2.5} />
                                )}
                                Leave {isOrgTeam ? "organisation" : "project"}
                            </Button>
                        </DialogFooter>
                    </DialogBody>
                </DialogContent>
            </Dialog>
        </div>
    );
}
