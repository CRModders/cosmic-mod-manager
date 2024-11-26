import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useLocation, useNavigate } from "@remix-run/react";
import clientFetch from "@root/utils/client-fetch";
import { Capitalize, formatUserName } from "@shared/lib/utils";
import { getAuthProviderFromString } from "@shared/lib/utils/convertors";
import { profileUpdateFormSchema } from "@shared/schemas/settings";
import type { LinkedProvidersListData, LoggedInUserData } from "@shared/types";
import { Edit3Icon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { LoadingSpinner } from "~/components/ui/spinner";

const EditProfileDialog = ({
    session,
    linkedAuthProviders,
}: {
    session: LoggedInUserData;
    linkedAuthProviders: LinkedProvidersListData[] | null;
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const initialFormValues = {
        avatarUrlProvider: getAuthProviderFromString(session?.avatarProvider || ""),
        userName: session.userName,
        name: session.name,
    };
    const form = useForm<z.infer<typeof profileUpdateFormSchema>>({
        resolver: zodResolver(profileUpdateFormSchema),
        defaultValues: initialFormValues,
    });

    const handleSubmit = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const response = await clientFetch("/api/user", {
            method: "PATCH",
            body: JSON.stringify(form.getValues()),
        });
        const data = await response.json();

        if (!response.ok || data?.success !== true) {
            setIsLoading(false);
            return toast.error(data?.message || "");
        }
        toast.success(data?.message || "");
        RefreshPage(navigate, location);
        setIsLoading(false);
        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="" variant={"ghost"}>
                    <Edit3Icon className="w-btn-icon h-btn-icon" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <VisuallyHidden>
                    <DialogDescription>Edit your crmm profile</DialogDescription>
                </VisuallyHidden>

                <DialogBody>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            name="Edit profile"
                            className="w-full flex flex-col items-start justify-start gap-3"
                        >
                            <FormField
                                control={form.control}
                                name="avatarUrlProvider"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Avatar provider
                                            <FormMessage />
                                        </FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {linkedAuthProviders
                                                    ?.map((provider) => ({
                                                        ...provider,
                                                        providerName: getAuthProviderFromString(provider.providerName),
                                                    }))
                                                    .map((provider) => {
                                                        return (
                                                            <SelectItem key={provider.id} value={provider.providerName}>
                                                                {Capitalize(provider.providerName)}
                                                            </SelectItem>
                                                        );
                                                    })}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <>
                                        <FormItem>
                                            <FormLabel>
                                                Username
                                                <FormMessage />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    spellCheck={false}
                                                    onChange={(e) => {
                                                        e.target.value = formatUserName(e.target.value);
                                                        field.onChange(e);
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    </>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <>
                                        <FormItem>
                                            <FormLabel>
                                                Name
                                                <FormMessage />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    spellCheck={false}
                                                    onChange={(e) => {
                                                        e.target.value = formatUserName(e.target.value, " ");
                                                        field.onChange(e);
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    </>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <CancelButton />
                                </DialogClose>
                                <Button disabled={isLoading || JSON.stringify(form.getValues()) === JSON.stringify(initialFormValues)}>
                                    {isLoading ? <LoadingSpinner size="xs" /> : <SaveIcon className="size-4" />}
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileDialog;
