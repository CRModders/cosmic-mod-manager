import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckIcon, XIcon } from "lucide-react";

interface Props {
    teamId: string;
    role: string;
    className?: string;
}

const JoinProjectBanner = ({ teamId, role, className }: Props) => {
    return (
        <Card className={cn("w-full p-card-surround flex flex-col gap-4", className)}>
            <CardTitle className="text-muted-foreground">Invitation to join project</CardTitle>
            <span className="text-muted-foregroundProjectDetailsData">
                You've been invited be a member of this project with the role of '{role}'.
            </span>
            <div className="flex  flex-wrap items-center justify-start gap-3">
                <Button className="" size="sm">
                    <CheckIcon className="w-btn-icon h-btn-icon" />
                    Accept
                </Button>

                <Button className="" size="sm" variant="secondary-destructive">
                    <XIcon className="w-btn-icon h-btn-icon" />
                    Decline
                </Button>
            </div>
        </Card>
    );
};

export default JoinProjectBanner;
