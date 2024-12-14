import { zodResolver } from "@hookform/resolvers/zod";
import clientFetch from "@root/utils/client-fetch";
import { disableInteractions } from "@root/utils/dom";
import { removeAccountPasswordFormSchema } from "@shared/schemas/settings";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";
import RefreshPage from "~/components/refresh-page";
import { Button, CancelButton } from "~/components/ui/button";
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
} from "~/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useTranslation } from "~/locales/provider";

export default function RemovePasswordForm() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<z.infer<typeof removeAccountPasswordFormSchema>>({
        resolver: zodResolver(removeAccountPasswordFormSchema),
        defaultValues: {
            password: "",
        },
    });

    const removeAccountPassword = async () => {
        try {
            if (isLoading) return;
            setIsLoading(true);
            disableInteractions();

            const response = await clientFetch("/api/user/password", {
                method: "DELETE",
                body: JSON.stringify(form.getValues()),
            });

            const result = await response.json();
            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            return toast.success(result?.message || t.common.success);
        } finally {
            setDialogOpen(false);
            setIsLoading(false);

            RefreshPage(navigate, location);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant={"secondary-destructive"}>
                    <Trash2Icon className="w-btn-icon h-btn-icon" />
                    {t.settings.removePass}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.settings.removePassTitle}</DialogTitle>
                    <DialogDescription>{t.settings.removePassDesc}</DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(removeAccountPassword)}
                            className="w-full flex flex-col items-start justify-start gap-form-elements"
                        >
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="password-input">
                                            {t.auth.password}
                                            <FormMessage />
                                        </FormLabel>
                                        <Input {...field} type="password" id="password-input" placeholder={t.settings.enterCurrentPass} />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <CancelButton disabled={isLoading} />
                                </DialogClose>
                                <Button type="submit" variant={"destructive"} disabled={isLoading || !form.getValues().password}>
                                    {isLoading ? <LoadingSpinner size="xs" /> : <Trash2Icon className="w-btn-icon h-btn-icon" />}
                                    {t.settings.removePass}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
