import { fallbackUserIcon } from "@/components/icons";
import { ImgWrapper } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { LabelledCheckbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { projectContext } from "@/src/contexts/curr-project";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectPermissionsList } from "@shared/config/project";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { updateProjectMemberFormSchema } from "@shared/schemas/project/settings/members";
import { checkFormValidity } from "@shared/schemas/utils";
import { ProjectPermissions } from "@shared/types";
import type { TeamMember } from "@shared/types/api";
import { ChevronDownIcon, ChevronUpIcon, CrownIcon, RefreshCcwIcon, SaveIcon, UserXIcon } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { z } from "zod";
import InviteMemberForm from "./invite-member";
import { leaveTeam } from "./utils";

const ProjectMemberSettingsPage = () => {
    const { projectData, fetchProjectData, currUsersMembership } = useContext(projectContext);
    const currUsersMembershipData = currUsersMembership.data;

    if (!projectData || !currUsersMembershipData) return null;
    const canInviteMembers = currUsersMembershipData.permissions.includes(ProjectPermissions.MANAGE_INVITES);

    return (
        <>
            <Card className="w-full flex flex-col p-card-surround gap-4">
                <CardTitle>Manage members</CardTitle>
                <InviteMemberForm teamId={projectData.teamId} canInviteMembers={canInviteMembers} fetchProjectData={fetchProjectData} />
                <LeaveProjectSection
                    teamId={projectData.teamId}
                    currUsersMembership={currUsersMembershipData}
                    fetchProjectData={fetchProjectData}
                />
            </Card>

            {projectData.members.map((member) => (
                <ProjectMember
                    key={member.userId}
                    member={member}
                    currUsersMembership={currUsersMembershipData}
                    fetchProjectData={fetchProjectData}
                />
            ))}
        </>
    );
};

export default ProjectMemberSettingsPage;

const ProjectMember = ({
    member,
    currUsersMembership,
    fetchProjectData,
}: { member: TeamMember; currUsersMembership: TeamMember; fetchProjectData: () => Promise<void> }) => {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof updateProjectMemberFormSchema>>({
        resolver: zodResolver(updateProjectMemberFormSchema),
        defaultValues: {
            role: member.role,
            permissions: member.permissions,
        },
    });

    const updateMemberDetails = async (values: z.infer<typeof updateProjectMemberFormSchema>) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await useFetch(`/api/team/${member.teamId}/member/${member.id}`, {
                method: "PATCH",
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || "Error");
            }

            await fetchProjectData();
            return toast.success("Member updated successfully");
        } finally {
            setIsLoading(false);
        }
    };

    const removeTeamMember = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await useFetch(`/api/team/${member.teamId}/member/${member.id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || "Error");
            }

            await fetchProjectData();
            return toast.success("Member removed successfully");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full flex flex-col gap-4 p-card-surround">
            {/* Head */}
            <div className="w-full flex flex-wrap items-center justify-between">
                {/* Member profile details */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <ImgWrapper
                        src={member.avatarUrl || ""}
                        alt={member.userName}
                        fallback={fallbackUserIcon}
                        className="h-12 rounded-full"
                    />
                    <div className="flex flex-col items-start justify-center gap-1.5">
                        <Link
                            to={`/user/${member.userName}`}
                            className="flex items-baseline justify-center gap-1.5 font-semibold text-foreground leading-none"
                        >
                            {member.userName}
                            {member.isOwner && (
                                <span className="flex items-baseline justify-center shrink-0" title="Owner">
                                    <CrownIcon className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                                </span>
                            )}
                        </Link>
                        <span className="leading-none text-[0.93rem] text-muted-foreground/80">{member.role}</span>
                    </div>
                </div>

                {/* Accepted status */}
                <div className="flex items-center justify-center gap-x-4">
                    {member.accepted === false && (
                        <span className="flex items-center justify-center gap-1.5 font-bold text-orange-500 dark:text-orange-400">
                            <RefreshCcwIcon className="w-btn-icon h-btn-icon" />
                            Pending
                        </span>
                    )}

                    <Button size="icon" variant="secondary" onClick={() => setDetailsOpen((prev) => !prev)}>
                        {detailsOpen ? (
                            <ChevronUpIcon className="w-btn-icon-lg h-btn-icon-lg" />
                        ) : (
                            <ChevronDownIcon className="w-btn-icon-lg h-btn-icon-lg" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Body */}
            {detailsOpen && (
                <Form {...form}>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                        }}
                        className="w-full flex flex-col gap-form-elements"
                    >
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="flex-col md:flex-row justify-between">
                                    <div className="flex flex-col items-start justify-center">
                                        <FormLabel className="font-bold">
                                            Role
                                            <FormMessage />
                                        </FormLabel>
                                        <span className="text-muted-foreground/90">
                                            The title of the role that this member plays for this project.
                                        </span>
                                    </div>
                                    <Input {...field} placeholder="Role" className="w-[24ch]" />
                                </FormItem>
                            )}
                        />

                        {member.isOwner === false && (
                            <FormField
                                control={form.control}
                                name="permissions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Permissions</FormLabel>
                                        <div
                                            className="w-full grid gap-x-4 gap-y-1"
                                            style={{
                                                gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
                                            }}
                                        >
                                            {ProjectPermissionsList.map((permissionName) => {
                                                return (
                                                    <LabelledCheckbox
                                                        key={permissionName}
                                                        checkBoxId={`member-(${member.id})-permission-${permissionName}`}
                                                        checked={(field?.value || []).includes(permissionName)}
                                                        onCheckedChange={(checked) => {
                                                            const currList = field.value || [];
                                                            if (checked === true) {
                                                                field.onChange([...currList, permissionName]);
                                                            } else {
                                                                field.onChange(currList.filter((p) => p !== permissionName));
                                                            }
                                                        }}
                                                    >
                                                        {CapitalizeAndFormatString(permissionName)}
                                                    </LabelledCheckbox>
                                                );
                                            })}
                                        </div>
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="w-full flex gap-x-4 gap-y-2">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isLoading}
                                onClick={async () => {
                                    await checkFormValidity(async () => {
                                        const values = await updateProjectMemberFormSchema.parseAsync(form.getValues());
                                        await updateMemberDetails(values);
                                    });
                                }}
                            >
                                <SaveIcon className="w-btn-icon h-btn-icon" />
                                Save changes
                            </Button>

                            {!member.isOwner && currUsersMembership.permissions.includes(ProjectPermissions.REMOVE_MEMBER) && (
                                <Button
                                    type="button"
                                    variant="secondary-destructive"
                                    size="sm"
                                    disabled={isLoading}
                                    onClick={removeTeamMember}
                                >
                                    <UserXIcon className="w-btn-icon h-btn-icon" />
                                    Remove member
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            )}
        </Card>
    );
};

const LeaveProjectSection = ({
    currUsersMembership,
    teamId,
    fetchProjectData,
}: { currUsersMembership: TeamMember; teamId: string; fetchProjectData: () => Promise<void> }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLeaveProject = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const data = await leaveTeam(teamId);
            if (!data?.success) return toast.error(data?.message || "Error");

            await fetchProjectData();
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

            <Button variant="destructive" disabled={currUsersMembership.isOwner || isLoading} onClick={handleLeaveProject}>
                {isLoading ? <LoadingSpinner size="xs" /> : <UserXIcon className="w-btn-icon-md h-btn-icon-md" strokeWidth={2.5} />}
                Leave project
            </Button>
        </div>
    );
};
