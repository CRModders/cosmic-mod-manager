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
import { CancelButton } from "~/components/ui/button";
import { Trash2Icon } from "lucide-react";

interface ConfirmDialogProps {
    title: string;
    shortDesc?: string;
    description: string;

    onConfirm: () => void | Promise<void>;
    children: React.ReactNode;
    confirmIcon?: React.ReactNode;
    confirmText: string;
    confirmBtnVariant?: "default" | "destructive";
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>{props.children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                    {props.shortDesc ? <DialogDescription>{props.shortDesc}</DialogDescription> : null}
                </DialogHeader>

                <DialogBody>
                    <p className="mb-4">{props.description}</p>

                    <DialogFooter>
                        <DialogClose asChild>
                            <CancelButton />
                        </DialogClose>

                        <Button onClick={props.onConfirm} variant={props.confirmBtnVariant || "default"}>
                            {props.confirmIcon ? (
                                props.confirmIcon
                            ) : (
                                <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />
                            )}

                            {props.confirmText}
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
