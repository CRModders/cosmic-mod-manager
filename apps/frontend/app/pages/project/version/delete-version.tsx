import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@app/components/ui/dialog";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { VisuallyHidden } from "@app/components/ui/visually-hidden";
import type { ProjectDetailsData } from "@app/utils/types/api";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { CancelButton } from "~/components/ui/button";
import { useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

interface Props {
    projectData: ProjectDetailsData;
    projectSlug: string;
    versionSlug: string;
}

export default function DeleteVersionDialog({ projectData, projectSlug, versionSlug }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    async function deleteVersion() {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await clientFetch(`/api/project/${projectSlug}/version/${versionSlug}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            RefreshPage(navigate, `/${projectData?.type[0]}/${projectSlug}/versions`);
            return toast.success(result?.message || t.common.success);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"secondary-destructive"}>
                    <Trash2Icon className="h-btn-icon w-btn-icon" />
                    {t.form.delete}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.version.sureToDelete}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{t.version.deleteVersion}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>

                <DialogBody className="flex flex-col items-start justify-start gap-4">
                    <span className="text-muted-foreground">{t.version.deleteDesc}</span>

                    <DialogFooter>
                        <DialogClose asChild disabled={isLoading}>
                            <CancelButton disabled={isLoading} />
                        </DialogClose>

                        <Button variant={"destructive"} onClick={deleteVersion} disabled={isLoading}>
                            {isLoading ? <LoadingSpinner size="xs" /> : <Trash2Icon className="w-btn-icon" />}
                            {t.form.delete}
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
