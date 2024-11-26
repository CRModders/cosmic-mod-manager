import { cn } from "@root/utils";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardTitle } from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/spinner";
import { acceptTeamInvite, leaveTeam } from "./settings/members/utils";

interface Props {
    teamId: string;
    role: string;
    className?: string;
    refreshData: () => Promise<void>;
    isOrg?: boolean;
}

interface LoadingData {
    value: boolean;
    action: "accept" | "decline" | null;
}

export default function TeamInvitationBanner({ teamId, role, className, refreshData, isOrg }: Props) {
    const [isLoading, setIsLoading] = useState<LoadingData>({ value: false, action: null });

    const handleAcceptInvite = async () => {
        if (isLoading.value) return;
        setIsLoading({ value: true, action: "accept" });

        try {
            const data = await acceptTeamInvite(teamId);
            if (!data?.success) return toast.error(data?.message || "Error");

            await refreshData();
            return toast.success(data?.message || "Success");
        } finally {
            setIsLoading({ value: false, action: null });
        }
    };

    const handleDeclineInvite = async () => {
        if (isLoading.value) return;
        setIsLoading({ value: true, action: "decline" });

        try {
            const data = await leaveTeam(teamId);
            if (!data?.success) return toast.error(data?.message || "Error");

            await refreshData();
            return toast.success("Declined invitation");
        } finally {
            setIsLoading({ value: false, action: null });
        }
    };

    return (
        <Card className={cn("w-full p-card-surround flex flex-col gap-4", className)}>
            <CardTitle className="text-muted-foreground">Invitation to join {isOrg ? "organization" : "project"}</CardTitle>
            <span className="text-muted-foreground ProjectDetailsData">
                You've been invited be a member of this {isOrg ? "organization" : "project"} with the role of '{role}'.
            </span>
            <div className="flex  flex-wrap items-center justify-start gap-3">
                <Button className="" size="sm" onClick={handleAcceptInvite} disabled={isLoading.value}>
                    {isLoading.value === true && isLoading.action === "accept" ? (
                        <LoadingSpinner size="xs" />
                    ) : (
                        <CheckIcon className="w-btn-icon h-btn-icon" />
                    )}
                    Accept
                </Button>

                <Button className="" size="sm" variant="secondary-destructive" disabled={isLoading.value} onClick={handleDeclineInvite}>
                    {isLoading.value === true && isLoading.action === "decline" ? (
                        <LoadingSpinner size="xs" />
                    ) : (
                        <XIcon className="w-btn-icon h-btn-icon" />
                    )}
                    Decline
                </Button>
            </div>
        </Card>
    );
}
