import { zodResolver } from "@hookform/resolvers/zod";
import clientFetch from "@root/utils/client-fetch";
import { inviteTeamMemberFormSchema } from "@shared/schemas/project/settings/members";
import { UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/spinner";

interface Props {
    teamId: string;
    canInviteMembers: boolean;
    dataRefetch: () => Promise<void>;
    isOrg?: boolean;
}

export default function InviteMemberForm({ teamId, canInviteMembers, dataRefetch, isOrg }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof inviteTeamMemberFormSchema>>({
        resolver: zodResolver(inviteTeamMemberFormSchema),
        defaultValues: {
            userName: "",
        },
    });

    async function inviteMember(values: z.infer<typeof inviteTeamMemberFormSchema>) {
        if (!canInviteMembers) {
            return toast.error("You don't have access to manage member invites");
        }

        if (isLoading || !values.userName) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${teamId}/invite`, {
                method: "POST",
                body: JSON.stringify({ userName: values.userName }),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || "Error");
            }

            await dataRefetch();
            return;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(inviteMember)} className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-col gap-1.5">
                    <h3 className="leading-none text-lg font-bold">Invite a member</h3>
                    <span className="leading-none text-muted-foreground">
                        Enter the username of the person you'd like to invite to be a member of this {isOrg ? "organization" : "project"}.
                    </span>
                </div>

                <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                        <FormItem className="w-fit mb-0">
                            <FormLabel htmlFor="username-input">
                                <FormMessage />
                            </FormLabel>

                            <div className="w-full flex flex-wrap gap-x-4 gap-y-1">
                                <Input {...field} className="w-full md:w-[32ch]" placeholder="Username" id="username-input" />
                                <Button type="submit" disabled={!canInviteMembers || isLoading}>
                                    {isLoading ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <UserPlusIcon className="w-btn-icon-md h-btn-icon-md" strokeWidth={2.25} />
                                    )}
                                    Invite
                                </Button>
                            </div>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
