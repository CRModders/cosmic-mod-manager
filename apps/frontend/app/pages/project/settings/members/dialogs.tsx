import { Button } from "@app/components/ui/button";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@app/components/ui/dialog";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import type { TeamMember } from "@app/utils/types/api";
import { ArrowRightLeftIcon, UserXIcon } from "lucide-react";
import { useState } from "react";
import { CancelButton } from "~/components/ui/button";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

interface RemoveMemberDialogProps {
    member: TeamMember;
    refreshData: () => Promise<void>;
    children: React.ReactNode;
}

export function RemoveMemberDialog({ member, refreshData, children }: RemoveMemberDialogProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    async function removeTeamMember() {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${member.teamId}/member/${member.id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || t.common.error);
            }

            await refreshData();
            return toast.success(t.projectSettings.memberRemoved);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.projectSettings.removeMember}</DialogTitle>
                </DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <p>{t.projectSettings.sureToRemoveMember(member.userName)}</p>
                    <DialogFooter>
                        <DialogClose asChild>
                            <CancelButton />
                        </DialogClose>
                        <Button type="button" variant="destructive" disabled={isLoading} onClick={removeTeamMember}>
                            {isLoading ? <LoadingSpinner size="xs" /> : <UserXIcon aria-hidden className="w-btn-icon h-btn-icon" />}
                            {t.projectSettings.removeMember}
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
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    async function transferOwnership() {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${teamId}/owner`, {
                method: "PATCH",
                body: JSON.stringify({ userId: member.userId }),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || t.common.error);
            }

            await refreshData();
            return toast.success(data?.message || t.projectSettings.ownershipTransfered);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.projectSettings.transferOwnership}</DialogTitle>
                </DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <p>{t.projectSettings.sureToTransferOwnership(member.userName)}</p>
                    <DialogFooter>
                        <DialogClose asChild>
                            <CancelButton />
                        </DialogClose>
                        <Button variant="destructive" size="sm" disabled={isLoading} onClick={transferOwnership}>
                            {isLoading ? (
                                <LoadingSpinner size="xs" />
                            ) : (
                                <ArrowRightLeftIcon aria-hidden className="w-btn-icon h-btn-icon" />
                            )}
                            {t.projectSettings.transferOwnership}
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
