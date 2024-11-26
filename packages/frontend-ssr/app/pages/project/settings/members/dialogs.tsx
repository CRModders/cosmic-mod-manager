import clientFetch from "@root/utils/client-fetch";
import type { TeamMember } from "@shared/types/api";
import { ArrowRightLeftIcon, UserXIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button, CancelButton } from "~/components/ui/button";
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

interface RemoveMemberDialogProps {
    member: TeamMember;
    refreshData: () => Promise<void>;
    children: React.ReactNode;
}

export function RemoveMemberDialog({ member, refreshData, children }: RemoveMemberDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const removeTeamMember = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${member.teamId}/member/${member.id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || "Error");
            }

            await refreshData();
            return toast.success("Member removed successfully");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove member</DialogTitle>
                </DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <p>Are you sure you want to remove {member.userName} from this team?</p>
                    <DialogFooter>
                        <DialogClose asChild>
                            <CancelButton />
                        </DialogClose>
                        <Button type="button" variant="destructive" disabled={isLoading} onClick={removeTeamMember}>
                            {isLoading ? <LoadingSpinner size="xs" /> : <UserXIcon className="w-btn-icon h-btn-icon" />}
                            Remove member
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

interface TransferOwnershipDialogProps {
    member: TeamMember;
    teamId: string;
    refreshData: () => Promise<void>;
    children: React.ReactNode;
}

export function TransferOwnershipDialog({ member, teamId, refreshData, children }: TransferOwnershipDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const transferOwnership = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${teamId}/owner`, {
                method: "PATCH",
                body: JSON.stringify({ userId: member.userId }),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || "Error");
            }

            await refreshData();
            return toast.success(data?.message || "Ownership transferred successfully");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transfer Ownership</DialogTitle>
                </DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <p>Are you sure you want to make {member.userName} the owner of this team?</p>
                    <DialogFooter>
                        <DialogClose asChild>
                            <CancelButton />
                        </DialogClose>
                        <Button variant="destructive" size="sm" disabled={isLoading} onClick={transferOwnership}>
                            {isLoading ? <LoadingSpinner size="xs" /> : <ArrowRightLeftIcon className="w-btn-icon h-btn-icon" />}
                            Transfer ownership
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
