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
import { useLocation, useNavigate } from "react-router";
import { CancelButton } from "~/components/ui/button";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

interface Props {
    projectData: ProjectDetailsData;
    children: React.ReactNode;
    id: string;
}

export default function RemoveGalleryImage({ children, id, projectData }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    async function deleteImage() {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await clientFetch(`/api/project/${projectData?.slug}/gallery/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            RefreshPage(navigate, location);
            return toast.success(result?.message || t.common.success);
        } catch (error) {
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.project.sureToDeleteImg}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{t.project.sureToDeleteImg}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <span className="text-muted-foreground">{t.project.deleteImgDesc}</span>
                    <DialogFooter>
                        <DialogClose asChild disabled={isLoading}>
                            <CancelButton disabled={isLoading} />
                        </DialogClose>

                        <Button variant={"destructive"} disabled={isLoading} onClick={deleteImage}>
                            {isLoading ? <LoadingSpinner size="xs" /> : <Trash2Icon className="w-btn-icon h-btn-icon" />}
                            {t.form.delete}
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
