import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@app/components/ui/popover";
import { toast } from "@app/components/ui/sonner";
import { MODERATOR_ROLES } from "@app/utils/config/roles";
import { disableInteractions, enableInteractions } from "@app/utils/dom";
import { ProjectPublishingStatus } from "@app/utils/types";
import { CheckIcon, EyeOffIcon, MoreVerticalIcon, XIcon } from "lucide-react";
import { useLocation } from "react-router";
import { useNavigate } from "~/components/ui/link";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

export default function ModerationBanner() {
    const { t } = useTranslation();
    const ctx = useProjectData();
    const session = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    if (!session?.id || !MODERATOR_ROLES.includes(session.role)) return null;
    if (!ctx.projectData.requestedStatus) return null;

    async function updateStatus(status = ProjectPublishingStatus.APPROVED) {
        disableInteractions();

        const res = await clientFetch(`/api/moderation/project/${ctx.projectData.id}`, {
            method: "POST",
            body: JSON.stringify({ status: status }),
        });
        const data = await res.json();

        if (!res.ok || data?.success === false) {
            toast.error(data?.message);
            enableInteractions();
        }

        toast.success(data?.message);
        RefreshPage(navigate, location);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg-plus">{t.moderation.awaitingApproval}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-x-3 flex-row items-center justify-start">
                <Button size="sm" onClick={() => updateStatus(ProjectPublishingStatus.APPROVED)}>
                    <CheckIcon className="w-btn-icon h-btn-icon" />
                    {t.moderation.approve}
                </Button>

                <Button size="sm" variant="secondary-destructive" onClick={() => updateStatus(ProjectPublishingStatus.REJECTED)}>
                    <XIcon className="w-btn-icon h-btn-icon" />
                    {t.moderation.reject}
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="icon" className="rounded-full" variant="outline">
                            <MoreVerticalIcon className="w-btn-icon h-btn-icon" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="min-w-0 w-fit p-1">
                        <Button size="sm" variant="ghost-destructive" onClick={() => updateStatus(ProjectPublishingStatus.WITHHELD)}>
                            <EyeOffIcon className="w-btn-icon h-btn-icon" />
                            {t.moderation.withhold}
                        </Button>
                    </PopoverContent>
                </Popover>
            </CardContent>
        </Card>
    );
}
