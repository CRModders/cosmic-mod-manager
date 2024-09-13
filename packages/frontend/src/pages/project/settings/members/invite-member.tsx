import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteProjectMemberFormSchema } from "@shared/schemas/project";
import { UserPlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface Props {
    teamId: string;
    canInviteMembers: boolean;
    fetchProjectData: () => Promise<void>;
}

const InviteMemberForm = ({ teamId, canInviteMembers, fetchProjectData }: Props) => {
    const form = useForm<z.infer<typeof inviteProjectMemberFormSchema>>({
        resolver: zodResolver(inviteProjectMemberFormSchema),
        defaultValues: {
            userName: "",
        },
    });

    const inviteMember = async (values: z.infer<typeof inviteProjectMemberFormSchema>) => {
        if (!canInviteMembers) {
            return toast.error("You don't have access to manage member invites");
        }

        const res = await useFetch(`/api/team/${teamId}/invite`, {
            method: "POST",
            body: JSON.stringify({ userName: values.userName }),
        });
        const data = await res.json();

        if (!res.ok || !data?.success) {
            return toast.error(data?.message || "Error");
        }

        await fetchProjectData();
        return;
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(inviteMember)} className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-col gap-1.5">
                    <h3 className="leading-none text-lg font-bold">Invite a member</h3>
                    <span className="leading-none text-muted-foreground">
                        Enter the username of the person you'd like to invite to be a member of this project.
                    </span>
                </div>

                <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                        <FormItem className="w-fit mb-0">
                            <FormLabel>
                                <FormMessage />
                            </FormLabel>

                            <div className="w-full flex flex-wrap gap-x-4 gap-y-1">
                                <Input {...field} className="w-full md:w-[32ch]" placeholder="Username" />
                                <Button type="submit" disabled={!canInviteMembers}>
                                    <UserPlusIcon className="w-btn-icon-md h-btn-icon-md" strokeWidth={2.25} />
                                    Invite
                                </Button>
                            </div>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

export default InviteMemberForm;
