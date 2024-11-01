import { fallbackUserIcon } from "@/components/icons";
import { ImgWrapper } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LabelledCheckbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { imageUrl } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { RemoveMemberDialog, TransferOwnershipDialog } from "@/src/pages/project/settings/members/dialogs";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrgPermissionsList, ProjectPermissionsList } from "@shared/config/project";
import { CapitalizeAndFormatString, doesOrgMemberHaveAccess } from "@shared/lib/utils";
import { updateTeamMemberFormSchema } from "@shared/schemas/project/settings/members";
import { handleFormError } from "@shared/schemas/utils";
import { OrganisationPermission } from "@shared/types";
import type { Organisation, TeamMember } from "@shared/types/api";
import { ArrowRightLeftIcon, ChevronDownIcon, ChevronUpIcon, CrownIcon, RefreshCcwIcon, SaveIcon, UserXIcon } from "lucide-react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { z } from "zod";

interface OrgTeamMemberProps {
    org: Organisation;
    member: TeamMember;
    currMember: TeamMember;
    fetchOrgData: () => Promise<void>;
}

export const OrgTeamMember = ({ org, member, currMember, fetchOrgData }: OrgTeamMemberProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const defaultValues = {
        role: member.role,
        permissions: member.permissions,
        organisationPermissions: member.organisationPermissions,
    };

    const form = useForm<z.infer<typeof updateTeamMemberFormSchema>>({
        resolver: zodResolver(updateTeamMemberFormSchema),
        defaultValues: defaultValues,
    });
    form.watch();

    const updateMemberDetails = async (values: z.infer<typeof updateTeamMemberFormSchema>) => {
        if (isLoading || !currMember) return;
        setIsLoading(true);
        try {
            const res = await useFetch(`/api/team/${org.teamId}/member/${member.id}`, {
                method: "PATCH",
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || "Error");
            }

            await fetchOrgData();
            return toast.success("Member updated successfully");
        } finally {
            setIsLoading(false);
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        form.reset(defaultValues);
    }, [member]);

    const canEditMember = doesOrgMemberHaveAccess(
        OrganisationPermission.EDIT_MEMBER,
        currMember.organisationPermissions,
        currMember.isOwner,
    );
    const canEditDefaultPermissions = doesOrgMemberHaveAccess(
        OrganisationPermission.EDIT_MEMBER_DEFAULT_PERMISSIONS,
        currMember.organisationPermissions,
        currMember.isOwner,
    );
    const canAddPermissions = currMember.isOwner;
    const canRemoveMembers = doesOrgMemberHaveAccess(
        OrganisationPermission.REMOVE_MEMBER,
        currMember.organisationPermissions,
        currMember.isOwner,
    );
    const canTransferOwnership = currMember.isOwner && member.accepted && member.userId !== currMember.userId;

    return (
        <Card className="w-full flex flex-col gap-4 p-card-surround">
            {/* Head */}
            <div className="w-full flex flex-wrap items-center justify-between">
                {/* Member profile details */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <ImgWrapper
                        src={imageUrl(member.avatarUrl)}
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
                            disabled={!canEditMember}
                            render={({ field }) => (
                                <FormItem className="flex-col md:flex-row justify-between">
                                    <div className="flex flex-col items-start justify-center gap-1">
                                        <FormLabel className="font-bold" htmlFor={`member-role-input_${member.id}`}>
                                            Role
                                            <FormMessage />
                                        </FormLabel>
                                        <span className="text-muted-foreground/90 leading-tight">
                                            The title of the role that this member plays for this project.
                                        </span>
                                    </div>
                                    <Input {...field} placeholder="Role" className="w-[24ch]" id={`member-role-input_${member.id}`} />
                                </FormItem>
                            )}
                        />

                        {member.isOwner === false && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="permissions"
                                    disabled={!canEditDefaultPermissions}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Project permissions</FormLabel>
                                            <div
                                                className="w-full grid gap-x-4 gap-y-1"
                                                style={{
                                                    gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
                                                }}
                                            >
                                                {ProjectPermissionsList.map((permission) => {
                                                    const checked = (field?.value || []).includes(permission);
                                                    return (
                                                        <LabelledCheckbox
                                                            key={permission}
                                                            name={permission}
                                                            checked={checked}
                                                            disabled={field.disabled}
                                                            onCheckedChange={(checked) => {
                                                                const currList = field.value || [];
                                                                if (checked === true) {
                                                                    field.onChange([...currList, permission]);
                                                                } else {
                                                                    field.onChange(currList.filter((p) => p !== permission));
                                                                }
                                                            }}
                                                        >
                                                            {CapitalizeAndFormatString(permission)}
                                                        </LabelledCheckbox>
                                                    );
                                                })}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="organisationPermissions"
                                    disabled={!canEditMember}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Organization permissions</FormLabel>
                                            <div
                                                className="w-full grid gap-x-4 gap-y-1"
                                                style={{
                                                    gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
                                                }}
                                            >
                                                {OrgPermissionsList.map((permission) => {
                                                    const checked = (field?.value || []).includes(permission);
                                                    return (
                                                        <LabelledCheckbox
                                                            key={permission}
                                                            name={permission}
                                                            checked={checked}
                                                            disabled={field.disabled || (!checked && !canAddPermissions)}
                                                            onCheckedChange={(checked) => {
                                                                const currList = field.value || [];
                                                                if (checked === true) {
                                                                    field.onChange([...currList, permission]);
                                                                } else {
                                                                    field.onChange(currList.filter((p) => p !== permission));
                                                                }
                                                            }}
                                                        >
                                                            {CapitalizeAndFormatString(permission)}
                                                        </LabelledCheckbox>
                                                    );
                                                })}
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <div className="w-full flex flex-wrap gap-x-4 gap-y-2">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isLoading || !form.formState.isDirty}
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
                                <RemoveMemberDialog member={member} refreshData={fetchOrgData}>
                                    <Button type="button" variant="secondary-destructive" size="sm" disabled={isLoading}>
                                        <UserXIcon className="w-btn-icon h-btn-icon" />
                                        Remove member
                                    </Button>
                                </RemoveMemberDialog>
                            )}

                            {canTransferOwnership ? (
                                <TransferOwnershipDialog member={member} teamId={org.teamId} refreshData={fetchOrgData}>
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
