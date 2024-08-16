import { Button, CancelButton } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useSession } from "@/src/contexts/auth";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { removeAccountPasswordFormSchema } from "@shared/schemas/settings";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

const RemovePasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { validateSession } = useSession();

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

            const response = await useFetch("/api/user/remove-account-password", {
                method: "POST",
                body: JSON.stringify(form.getValues()),
            });

            const result = await response.json();
            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            await validateSession();
            setDialogOpen(false);
            return toast.success(result?.message || "Success");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant={"secondary-destructive"}>
                    <Trash2Icon className="w-btn-icon h-btn-icon" />
                    Remove password
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove your account password</DialogTitle>
                    <DialogDescription>
                        After removing your password you won't be able to use credentials to log into your account
                    </DialogDescription>
                </DialogHeader>

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
                                        Password
                                        <FormMessage />
                                    </FormLabel>
                                    <Input {...field} type="password" id="password-input" placeholder="Enter your current password" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <CancelButton disabled={isLoading} />
                            </DialogClose>
                            <Button type="submit" variant={"destructive"} disabled={isLoading || !form.getValues().password}>
                                {isLoading ? <LoadingSpinner size="xs" /> : <Trash2Icon className="w-btn-icon h-btn-icon" />}
                                Remove password
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default RemovePasswordForm;
