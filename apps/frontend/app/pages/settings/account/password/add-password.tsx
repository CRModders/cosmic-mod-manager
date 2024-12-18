import { Button, CancelButton } from "@app/components/ui/button";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { disableInteractions, enableInteractions } from "@app/utils/dom";
import type { z } from "@app/utils/schemas";
import { setNewPasswordFormSchema } from "@app/utils/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRoundIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

const AddPasswordForm = ({ email }: { email: string }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof setNewPasswordFormSchema>>({
        resolver: zodResolver(setNewPasswordFormSchema),
        defaultValues: {
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    form.watch();
    const isFormSubmittable =
        !!form.getValues().confirmNewPassword &&
        !!form.getValues()?.newPassword &&
        form.getValues().newPassword === form.getValues().confirmNewPassword;

    const addNewPassword = async (values: z.infer<typeof setNewPasswordFormSchema>) => {
        if (isLoading || !isFormSubmittable) return;
        setIsLoading(true);
        disableInteractions();

        try {
            const response = await clientFetch("/api/user/password", {
                method: "POST",
                body: JSON.stringify(values),
            });
            setIsLoading(false);
            const data = await response.json();

            if (!response.ok || data?.success !== true) {
                return toast.error(data?.message || t.common.error);
            }
            toast.success(data?.message || t.common.success);
            form.reset();
        } finally {
            enableInteractions();
            setIsLoading(false);
            setIsDialogOpen(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant={"secondary"}>
                    <KeyRoundIcon className="w-btn-icon h-btn-icon" />
                    {t.settings.addPass}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.settings.addPass}</DialogTitle>
                    <DialogDescription>{t.settings.addPassDialogDesc}</DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <Form {...form}>
                        <form
                            className="flex flex-col items-center justify-start gap-form-elements"
                            onSubmit={form.handleSubmit(addNewPassword)}
                        >
                            <input type="email" name="email" readOnly hidden value={email} />

                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t.auth.newPass}
                                            <FormMessage />
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" placeholder={t.auth.newPass_label} spellCheck={false} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmNewPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t.auth.confirmPass}
                                            <FormMessage />
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" placeholder={t.auth.confirmNewPassDesc} spellCheck={false} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <CancelButton />
                                </DialogClose>
                                <Button disabled={!isFormSubmittable || isLoading}>
                                    {isLoading ? <LoadingSpinner size="xs" /> : <PlusIcon className="w-btn-icon-md h-btn-icon-md" />}
                                    {t.settings.addPass}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};

export default AddPasswordForm;
