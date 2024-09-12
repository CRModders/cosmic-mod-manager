import { Card, CardTitle } from "@/components/ui/card";
import { projectContext } from "@/src/contexts/curr-project";
import type { TeamMember } from "@shared/types/api";
import { useContext } from "react";
import InviteMemberForm from "./invite-member";

const ProjectMemberSettingsPage = () => {
    const { projectData, fetchProjectData } = useContext(projectContext);

    if (!projectData) return null;

    return (
        <>
            <Card className="w-full flex flex-col p-card-surround gap-4">
                <CardTitle>Manage members</CardTitle>
                <InviteMemberForm projectSlug={projectData.slug} fetchProjectData={fetchProjectData} />
            </Card>

            {projectData.members.map((member) => (
                <ProjectMember key={member.userId} member={member} />
            ))}
        </>
    );
};

export default ProjectMemberSettingsPage;

const ProjectMember = ({ member }: { member: TeamMember }) => {
    return <Card className="w-full flex flex-col gap-4 p-card-surround">{member.userName}</Card>;
};
