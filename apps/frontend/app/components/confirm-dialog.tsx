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
import type React from "react";
import { useState } from "react";
import { LoadingSpinner } from "@app/components/ui/spinner";

interface ConfirmDialogProps {
    title: string;
    shortDesc?: string;
    description: React.ReactNode;

    onConfirm: () => unknown | Promise<unknown>;
    children: React.ReactNode;
    confirmIcon?: React.ReactNode;
    confirmText: string;
    confirmBtnVariant?: "default" | "destructive";
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const primaryBtnIcon = props.confirmIcon ? props.confirmIcon : <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />;

    return (
        <Dialog>
            <DialogTrigger asChild>{props.children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                    {props.shortDesc ? <DialogDescription>{props.shortDesc}</DialogDescription> : null}
                </DialogHeader>

                <DialogBody className="grid grid-cols-1 gap-form-elements">
                    <p>{props.description}</p>

                    <DialogFooter>
                        <DialogClose asChild>
                            <CancelButton />
                        </DialogClose>

                        <Button
                            onClick={async () => {
                                try {
                                    setIsLoading(true);
                                    await props.onConfirm();
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            variant={props.confirmBtnVariant || "default"}
                            disabled={isLoading}
                        >
                            {isLoading ? <LoadingSpinner size="xs" /> : primaryBtnIcon}

                            {props.confirmText}
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
