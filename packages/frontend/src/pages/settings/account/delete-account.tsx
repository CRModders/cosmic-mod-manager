import { Button, CancelButton } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SITE_NAME_SHORT } from "@shared/config";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DeleteAccountDialog = () => {
    const [isLoading, setIsLoading] = useState(false);

    const deleteAccount = async () => {
        try {
            if (isLoading) return;
            setIsLoading(true);

            const response = await useFetch("/api/user/delete-account", { method: "POST" });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            return toast.success(result?.message as string);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"destructive"}>
                    <Trash2Icon className="w-btn-icon h-btn-icon" />
                    Delete account
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete account
                        <VisuallyHidden>
                            <DialogDescription>Delete your {SITE_NAME_SHORT.toLowerCase()} account</DialogDescription>
                        </VisuallyHidden>
                    </DialogTitle>
                </DialogHeader>

                <div className="w-full flex flex-col items-start justify-start gap-form-elements">
                    <p>Are you sure you want to delete your account?</p>

                    <DialogFooter>
                        <DialogClose asChild disabled={isLoading}>
                            <CancelButton disabled={isLoading} />
                        </DialogClose>

                        <Button variant={"destructive"} onClick={deleteAccount} disabled={isLoading}>
                            {isLoading ? <LoadingSpinner size="xs" /> : <Trash2Icon className="w-btn-icon h-btn-icon" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAccountDialog;
