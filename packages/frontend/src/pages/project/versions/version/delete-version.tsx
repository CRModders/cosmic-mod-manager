import { Button, CancelButton } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/spinner";
import { projectContext } from "@/src/contexts/curr-project";
import useFetch from "@/src/hooks/fetch";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Trash2Icon } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DeleteVersionDialog = ({ projectSlug, versionSlug, featured }: { projectSlug: string; versionSlug: string; featured: boolean }) => {
    const { projectData, fetchAllProjectVersions } = useContext(projectContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const deleteVersion = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await useFetch(`/api/project/${projectSlug}/version/${versionSlug}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            navigate(`/${projectData?.type[0]}/${projectSlug}/versions`);
            await fetchAllProjectVersions();
            return toast.success(result?.message || "Success");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"secondary-destructive"}>
                    <Trash2Icon className="h-btn-icon w-btn-icon" />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this version?</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Delete version</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>

                <DialogBody className="flex flex-col items-start justify-start gap-4">
                    <span className="text-muted-foreground">This will remove this version forever (like really forever).</span>

                    <DialogFooter>
                        <DialogClose asChild disabled={isLoading}>
                            <CancelButton disabled={isLoading} />
                        </DialogClose>

                        <Button variant={"destructive"} onClick={deleteVersion} disabled={isLoading}>
                            {isLoading ? <LoadingSpinner size="xs" /> : <Trash2Icon className="w-btn-icon" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteVersionDialog;
