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
import { SITE_NAME_LONG } from "@app/utils/constants";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { CancelButton } from "~/components/ui/button";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

export default function DeleteAccountDialog() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    async function deleteAccount() {
        try {
            if (isLoading) return;
            setIsLoading(true);

            const response = await clientFetch("/api/user/delete-account", { method: "POST" });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            return toast.success(result?.message || t.common.success);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"destructive"}>
                    <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />
                    {t.auth.deleteAccount}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t.auth.deleteAccount}
                        <VisuallyHidden>
                            <DialogDescription>Delete your {SITE_NAME_LONG.toLowerCase()} account</DialogDescription>
                        </VisuallyHidden>
                    </DialogTitle>
                </DialogHeader>

                <DialogBody className="w-full flex flex-col items-start justify-start gap-form-elements">
                    <p>{t.settings.sureToDeleteAccount}</p>

                    <DialogFooter>
                        <DialogClose asChild disabled={isLoading}>
                            <CancelButton disabled={isLoading} />
                        </DialogClose>

                        <Button variant={"destructive"} onClick={deleteAccount} disabled={isLoading}>
                            {isLoading ? <LoadingSpinner size="xs" /> : <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />}
                            {t.form.delete}
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
