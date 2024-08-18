import { Button, CancelButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Projectcontext } from "@/src/contexts/curr-project";
import useFetch from "@/src/hooks/fetch";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Trash2Icon } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";

const RemoveGalleryImage = ({ children, id }: { children: React.ReactNode; id: string; }) => {
    const { projectData, fetchProjectData } = useContext(Projectcontext);
    const [isLoading, setIsLoading] = useState(false);

    const deleteImage = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await useFetch(`/api/project/${projectData?.slug}/gallery`, {
                method: "DELETE",
                body: JSON.stringify({ id: id })
            });

            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            await fetchProjectData();
            return toast.success(result?.message || "Success");
        } catch (error) {
            setIsLoading(false);
        }
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this gallery image?</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Delete gallery image</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <span className="text-muted-foreground">This will remove this gallery image forever (like really forever).</span>
                <DialogFooter>
                    <DialogClose asChild disabled={isLoading}>
                        <CancelButton disabled={isLoading} />
                    </DialogClose>

                    <Button variant={"destructive"} disabled={isLoading} onClick={deleteImage}>
                        {isLoading ? <LoadingSpinner size="xs" /> : <Trash2Icon className="w-btn-icon h-btn-icon" />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};

export default RemoveGalleryImage;