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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Capitalize, formatUserName } from "@shared/lib/utils";
import { getAuthProviderFromString } from "@shared/lib/utils/convertors";
import { profileUpdateFormSchema } from "@shared/schemas/settings";
import type { LinkedProvidersListData, LoggedInUserData } from "@shared/types";
import { Edit3Icon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

const EditProfileDialog = ({
    session,
    isFetchingData,
    linkedAuthProviders,
    validateSession,
}: {
    session: LoggedInUserData;
    isFetchingData: boolean;
    linkedAuthProviders: LinkedProvidersListData[] | null;
    validateSession: () => Promise<void>;
}) => {
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
        if (isLoading || isFetchingData) return;
        setIsLoading(true);

        const response = await useFetch("/api/user/update-profile", {
            method: "POST",
            body: JSON.stringify(form.getValues()),
        });
        const data = await response.json();

        if (!response.ok || data?.success !== true) {
            setIsLoading(false);
            return toast.error(data?.message || "");
        }
        toast.success(data?.message || "");
        await validateSession();
        setIsLoading(false);
        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="" variant={"ghost"}>
                    <Edit3Icon className="w-btn-icon-sm h-btn-icon-sm" />
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
                                <Button
                                    disabled={
                                        isLoading || isFetchingData || JSON.stringify(form.getValues()) === JSON.stringify(initialFormValues)
                                    }
                                >
                                    {isLoading || isFetchingData ? <LoadingSpinner size="xs" /> : <SaveIcon className="size-4" />}
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
