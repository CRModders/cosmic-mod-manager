import { ProjectStatusIcon } from "@app/components/icons";
import { Button, type ButtonVariants_T } from "@app/components/ui/button";
import { toast } from "@app/components/ui/sonner";
import { disableInteractions, enableInteractions } from "@app/utils/dom";
import { ProjectPublishingStatus, type ProjectType } from "@app/utils/types";
import ConfirmDialog from "~/components/confirm-dialog";
import MarkdownRenderBox from "~/components/md-renderer";
import { useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

interface UpdateProjectStatusProps {
    projectId: string;
    projectName: string;
    projectType: ProjectType;
    prevStatus: ProjectPublishingStatus;
    newStatus: ProjectPublishingStatus;

    trigger: {
        icon?: React.ReactNode;
        text: string;
        variant?: ButtonVariants_T["variant"];
        className?: string;
    };

    dialogConfirmBtn?: {
        icon?: React.ReactNode;
        text?: string;
        variant?: "default" | "destructive";
    };
}

export default function UpdateProjectStatusDialog(props: UpdateProjectStatusProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    async function updateStatus(status = ProjectPublishingStatus.APPROVED) {
        disableInteractions();

        const res = await clientFetch(`/api/moderation/project/${props.projectId}`, {
            method: "POST",
            body: JSON.stringify({ status: status }),
        });
        const data = await res.json();

        if (!res.ok || data?.success === false) {
            toast.error(data?.message);
            enableInteractions();
        }

        toast.success(data?.message);
        navigate("/moderation/review");
    }

    return (
        <ConfirmDialog
            title={t.project.updateProjectStatus}
            description={
                <MarkdownRenderBox
                    text={t.project.sureToUpdateStatus(props.projectName, t.navbar[props.projectType], props.prevStatus, props.newStatus)}
                />
            }
            confirmText={props.dialogConfirmBtn?.text || props.trigger.text}
            confirmIcon={props.dialogConfirmBtn?.icon || props.trigger.icon || <ProjectStatusIcon status={props.newStatus} />}
            confirmBtnVariant={props.dialogConfirmBtn?.variant}
            onConfirm={() => {
                return updateStatus(props.newStatus);
            }}
        >
            <Button variant={props.trigger.variant} size="sm" className={props.trigger.className}>
                {props.trigger.icon || <ProjectStatusIcon status={props.newStatus} />}
                {props.trigger.text}
            </Button>
        </ConfirmDialog>
    );
}
