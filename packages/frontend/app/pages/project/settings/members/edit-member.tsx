import { zodResolver } from "@hookform/resolvers/zod";
import { imageUrl } from "@root/utils";
import clientFetch from "@root/utils/client-fetch";
import { ProjectPermissionsList } from "@shared/config/project";
import { CapitalizeAndFormatString, doesMemberHaveAccess } from "@shared/lib/utils";
import { updateTeamMemberFormSchema } from "@shared/schemas/project/settings/members";
import { handleFormError } from "@shared/schemas/utils";
import { ProjectPermission } from "@shared/types";
import type { ProjectDetailsData, TeamMember } from "@shared/types/api";
import { ArrowRightLeftIcon, ChevronDownIcon, ChevronUpIcon, CrownIcon, RefreshCcwIcon, SaveIcon, UserXIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { fallbackUserIcon } from "~/components/icons";
import { ImgWrapper } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import Link from "~/components/ui/link";
import { Switch } from "~/components/ui/switch";
import { RemoveMemberDialog, TransferOwnershipDialog } from "./dialogs";

interface ProjectTeamMemberProps {
    member: TeamMember;
    currUsersMembership: TeamMember;
    fetchProjectData: () => Promise<void>;
    projectTeamId: string;
    doesProjectHaveOrg: boolean;
}

export const ProjectTeamMember = ({
    member,
    currUsersMembership,
    fetchProjectData,
    projectTeamId,
    doesProjectHaveOrg,
}: ProjectTeamMemberProps) => {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof updateTeamMemberFormSchema>>({
        resolver: zodResolver(updateTeamMemberFormSchema),
        defaultValues: {
            role: member.role,
            permissions: member.permissions,
        },
    });
    form.watch();

    const updateMemberDetails = async (values: z.infer<typeof updateTeamMemberFormSchema>) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${member.teamId}/member/${member.id}`, {
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

    const canEditMember = doesMemberHaveAccess(ProjectPermission.EDIT_MEMBER, currUsersMembership.permissions, currUsersMembership.isOwner);
    const canAddPermissions = currUsersMembership.isOwner;
    const canRemoveMembers = doesMemberHaveAccess(
        ProjectPermission.REMOVE_MEMBER,
        currUsersMembership.permissions,
        currUsersMembership.isOwner,
    );
    const canTransferOwnership =
        currUsersMembership.isOwner && member.accepted && !doesProjectHaveOrg && member.userId !== currUsersMembership.userId;

    useEffect(() => {
        form.reset({
            role: member.role,
            permissions: member.permissions,
        });
    }, [member]);

    return (
        <Card className="w-full flex flex-col gap-4 p-card-surround">
            {/* Head */}
            <div className="w-full flex flex-wrap items-center justify-between">
                {/* Member profile details */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <ImgWrapper
                        vtId={member.userId}
                        src={imageUrl(member.avatar)}
                        alt={member.userName}
                        fallback={fallbackUserIcon}
                        className="h-12 w-12 rounded-full"
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

                    <Button size="icon" variant="ghost" onClick={() => setDetailsOpen((prev) => !prev)}>
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
                                        <FormLabel className="font-bold" htmlFor={`member-role-input_${member.id}`}>
                                            Role
                                            <FormMessage />
                                        </FormLabel>
                                        <span className="text-muted-foreground/90">
                                            The title of the role that this member plays for this project.
                                        </span>
                                    </div>
                                    <Input
                                        {...field}
                                        disabled={!canEditMember}
                                        placeholder="Role"
                                        className="w-[24ch]"
                                        id={`member-role-input_${member.id}`}
                                    />
                                </FormItem>
                            )}
                        />

                        {member.isOwner === false && (
                            <FormField
                                control={form.control}
                                disabled={!canEditMember}
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
                                                const checked = (field?.value || []).includes(permissionName);
                                                return (
                                                    <LabelledCheckbox
                                                        key={permissionName}
                                                        name={permissionName}
                                                        disabled={field.disabled || (!checked && !canAddPermissions)}
                                                        checked={checked}
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

                        <div className="w-full flex flex-wrap gap-x-4 gap-y-2">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isLoading || !form.formState.isDirty || (!canEditMember && !canAddPermissions)}
                                onClick={async () => {
                                    await handleFormError(async () => {
                                        const values = await updateTeamMemberFormSchema.parseAsync(form.getValues());
                                        await updateMemberDetails(values);
                                    });
                                }}
                            >
                                <SaveIcon className="w-btn-icon h-btn-icon" />
                                Save changes
                            </Button>

                            {!member.isOwner && canRemoveMembers && (
                                <RemoveMemberDialog member={member} refreshData={fetchProjectData}>
                                    <Button type="button" variant="secondary-destructive" size="sm" disabled={isLoading}>
                                        <UserXIcon className="w-btn-icon h-btn-icon" />
                                        Remove member
                                    </Button>
                                </RemoveMemberDialog>
                            )}

                            {canTransferOwnership ? (
                                <TransferOwnershipDialog member={member} teamId={projectTeamId} refreshData={fetchProjectData}>
                                    <Button variant="secondary" size="sm" disabled={isLoading}>
                                        <ArrowRightLeftIcon className="w-btn-icon h-btn-icon" />
                                        Transfer ownership
                                    </Button>
                                </TransferOwnershipDialog>
                            ) : null}
                        </div>
                    </form>
                </Form>
            )}
        </Card>
    );
};

interface OrgTeamMemberProps {
    project: ProjectDetailsData;
    orgMember: TeamMember;
    currUsersMembership: TeamMember | null;
    fetchProjectData: () => Promise<void>;
}

export const OrgTeamMember = ({ project, orgMember, fetchProjectData, currUsersMembership }: OrgTeamMemberProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const permsOverridden = project.members.find((teamMember) => teamMember.userId === orgMember.userId);
    const projectMembership = permsOverridden;
    const [overridePerms, setOverridePerms] = useState(!!permsOverridden);

    const effectiveMembership = projectMembership || orgMember;
    const canEditMember = doesMemberHaveAccess(
        ProjectPermission.EDIT_MEMBER,
        currUsersMembership?.permissions || [],
        currUsersMembership?.isOwner,
    );
    const canAddPermissions = currUsersMembership?.isOwner === true;
    const canRemoveMembers = doesMemberHaveAccess(
        ProjectPermission.REMOVE_MEMBER,
        currUsersMembership?.permissions || [],
        currUsersMembership?.isOwner,
    );

    const defaultValues = {
        role: effectiveMembership.role,
        permissions: effectiveMembership.permissions,
    };

    const form = useForm<z.infer<typeof updateTeamMemberFormSchema>>({
        resolver: zodResolver(updateTeamMemberFormSchema),
        defaultValues: defaultValues,
    });
    form.watch();

    const updateMemberDetails = async (values: z.infer<typeof updateTeamMemberFormSchema>) => {
        if (isLoading || !projectMembership) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${project.teamId}/member/${projectMembership.id}`, {
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

    const removePermissionOverride = async () => {
        if (isLoading || !projectMembership) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${project.teamId}/member/${projectMembership.id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || "Error");
            }

            await fetchProjectData();
            return toast.success("Member updated");
        } finally {
            setIsLoading(false);
        }
    };

    const addPermissionOverride = async (values: z.infer<typeof updateTeamMemberFormSchema>) => {
        if (isLoading || projectMembership) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${project.teamId}/members`, {
                method: "POST",
                body: JSON.stringify({
                    ...values,
                    userId: orgMember.userId,
                }),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || "Error");
            }

            await fetchProjectData();
            return toast.success("Member updated");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        form.reset({
            role: effectiveMembership.role,
            permissions: effectiveMembership.permissions,
        });
    }, [effectiveMembership]);

    useEffect(() => {
        setOverridePerms(!!permsOverridden);
    }, [permsOverridden]);

    return (
        <Card className="w-full flex flex-col gap-4 p-card-surround">
            {/* Head */}
            <div className="w-full flex flex-wrap items-center justify-between">
                {/* Member profile details */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <ImgWrapper
                        vtId={effectiveMembership.userId}
                        src={imageUrl(effectiveMembership.avatar)}
                        alt={effectiveMembership.userName}
                        fallback={fallbackUserIcon}
                        className="h-12 w-12 rounded-full"
                    />
                    <div className="flex flex-col items-start justify-center gap-1.5">
                        <Link
                            to={`/user/${effectiveMembership.userName}`}
                            className="flex items-baseline justify-center gap-1.5 font-semibold text-foreground leading-none"
                        >
                            {effectiveMembership.userName}
                            {orgMember.isOwner && (
                                <span className="flex items-baseline justify-center shrink-0" title="Owner">
                                    <CrownIcon className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                                </span>
                            )}
                        </Link>
                        <span className="leading-none text-[0.93rem] text-muted-foreground/80">{effectiveMembership.role}</span>
                    </div>
                </div>

                {/* Accepted status */}
                <div className="flex items-center justify-center gap-x-4">
                    {effectiveMembership.accepted === false && (
                        <span className="flex items-center justify-center gap-1.5 font-bold text-orange-500 dark:text-orange-400">
                            <RefreshCcwIcon className="w-btn-icon h-btn-icon" />
                            Pending
                        </span>
                    )}

                    <Button size="icon" variant="ghost" onClick={() => setDetailsOpen((prev) => !prev)}>
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
                        <FormItem className="flex-row justify-between items-center gap-x-4 sm:gap-x-8">
                            <div className="flex flex-col items-start justify-center gap-1">
                                <FormLabel className="font-bold" htmlFor={`override-perms-input_${effectiveMembership.id}`}>
                                    Override values
                                    <FormMessage />
                                </FormLabel>
                                <span className="text-muted-foreground/90 leading-tight">
                                    Override organization default values and assign custom permissions and roles to this user on the
                                    project.
                                </span>
                            </div>
                            <Switch
                                id={`override-perms-input_${effectiveMembership.id}`}
                                checked={overridePerms}
                                onCheckedChange={setOverridePerms}
                                disabled={!canEditMember || (overridePerms && !canRemoveMembers)}
                            />
                        </FormItem>

                        <FormField
                            control={form.control}
                            disabled={!overridePerms || !canEditMember}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="flex-col md:flex-row justify-between">
                                    <div className="flex flex-col items-start justify-center gap-1">
                                        <FormLabel className="font-bold" htmlFor={`member-role-input_${effectiveMembership.id}`}>
                                            Role
                                            <FormMessage />
                                        </FormLabel>
                                        <span className="text-muted-foreground/90 leading-tight">
                                            The title of the role that this member plays for this project.
                                        </span>
                                    </div>
                                    <Input
                                        {...field}
                                        placeholder="Role"
                                        className="w-[24ch]"
                                        id={`member-role-input_${effectiveMembership.id}`}
                                    />
                                </FormItem>
                            )}
                        />

                        {orgMember.isOwner === false && (
                            <FormField
                                control={form.control}
                                disabled={!overridePerms}
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
                                                const checked = (field?.value || []).includes(permissionName);
                                                return (
                                                    <LabelledCheckbox
                                                        key={permissionName}
                                                        name={permissionName}
                                                        disabled={field.disabled || (!checked && !canAddPermissions)}
                                                        checked={checked}
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

                        <div className="w-full flex flex-wrap gap-x-4 gap-y-2">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isLoading || !form.formState.isDirty || (!permsOverridden && !overridePerms) || !canEditMember}
                                onClick={async () => {
                                    if (permsOverridden && !overridePerms) return await removePermissionOverride();

                                    await handleFormError(async () => {
                                        const values = await updateTeamMemberFormSchema.parseAsync(form.getValues());
                                        if (permsOverridden && overridePerms) await updateMemberDetails(values);
                                        else if (!permsOverridden && overridePerms) await addPermissionOverride(values);
                                    });
                                }}
                            >
                                <SaveIcon className="w-btn-icon h-btn-icon" />
                                Save changes
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </Card>
    );
};
