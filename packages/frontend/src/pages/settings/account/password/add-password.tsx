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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { setNewPasswordFormSchema } from "@shared/schemas/settings";
import { KeyRoundIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

const AddPasswordForm = () => {
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

        const response = await useFetch("/api/user/add-new-password", {
            method: "POST",
            body: JSON.stringify(values),
        });
        setIsLoading(false);
        const data = await response.json();

        if (!response.ok || data?.success !== true) {
            setIsLoading(false);
            return toast.error(data?.message || "");
        }
        toast.success(data?.message || "");
        setIsDialogOpen(false);
        form.reset();
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant={"secondary"}>
                    <KeyRoundIcon className="w-btn-icon h-btn-icon" />
                    Add password
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add password</DialogTitle>
                    <DialogDescription>You will be able to use this password to log into your account</DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <Form {...form}>
                        <form
                            className="flex flex-col items-center justify-start gap-form-elements"
                            onSubmit={form.handleSubmit(addNewPassword)}
                        >
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            New password
                                            <FormMessage />
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" placeholder="Your new password" spellCheck={false} />
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
                                            Confirm password
                                            <FormMessage />
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" placeholder="Re-enter your password" spellCheck={false} />
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
                                    Add password
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
