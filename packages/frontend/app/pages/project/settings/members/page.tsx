import { type Location, useLocation, useNavigate, useOutletContext } from "react-router";
import { doesMemberHaveAccess } from "@shared/lib/utils";
import { ProjectPermission } from "@shared/types";
import type { Organisation, TeamMember } from "@shared/types/api";
import { UserXIcon } from "lucide-react";
import { useState } from "react";
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
import type { ProjectSettingsContext } from "../layout";
import { OrgTeamMember, ProjectTeamMember } from "./edit-member";
import InviteMemberForm from "./invite-member";
import { RemoveProjectFromOrg, TransferProjectManagementCard } from "./transfer-management";
import { leaveTeam } from "./utils";

interface Props {
    userOrgs: Organisation[];
}

export default function ProjectMemberSettingsPage({ userOrgs }: Props) {
    const { projectData, currUsersMembership } = useOutletContext<ProjectSettingsContext>();
    const navigate = useNavigate();
    const location = useLocation();

    const canInviteMembers = doesMemberHaveAccess(
        ProjectPermission.MANAGE_INVITES,
        currUsersMembership.permissions,
        currUsersMembership.isOwner,
    );

    const refreshProjectData = async (path: string | Location = location) => {
        RefreshPage(navigate, path);
    };

    return (
        <>
            <Card className="w-full flex flex-col p-card-surround gap-4">
                <CardTitle>Manage members</CardTitle>
                <InviteMemberForm teamId={projectData.teamId} canInviteMembers={canInviteMembers} dataRefetch={refreshProjectData} />
                <LeaveTeam teamId={projectData.teamId} currUsersMembership={currUsersMembership} refreshData={refreshProjectData} />
            </Card>

            {projectData.members
                .filter((member) => !projectData.organisation?.members?.some((orgMember) => orgMember.userId === member.userId))
                .map((member) => (
                    <ProjectTeamMember
                        key={member.userId}
                        member={member}
                        currUsersMembership={currUsersMembership}
                        fetchProjectData={refreshProjectData}
                        projectTeamId={projectData.teamId}
                        doesProjectHaveOrg={!!projectData.organisation}
                    />
                ))}

            {userOrgs?.length && !projectData.organisation && currUsersMembership.isOwner === true ? (
                <TransferProjectManagementCard organisations={userOrgs} projectId={projectData.id} />
            ) : null}

            {projectData.organisation ? <RemoveProjectFromOrg org={projectData.organisation} projectId={projectData.id} /> : null}

            {projectData.organisation?.members?.map((member) => (
                <OrgTeamMember
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
}: { currUsersMembership: TeamMember; teamId: string; refreshData: () => Promise<void> }) {
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

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary-destructive" disabled={currUsersMembership.isOwner || currUsersMembership.teamId !== teamId}>
                        <UserXIcon className="w-btn-icon-md h-btn-icon-md" strokeWidth={2.5} />
                        Leave project
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
                                Leave project
                            </Button>
                        </DialogFooter>
                    </DialogBody>
                </DialogContent>
            </Dialog>
        </div>
    );
}
