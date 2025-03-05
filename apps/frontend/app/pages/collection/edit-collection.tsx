import { Button, CancelButton } from "@app/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
    DialogClose,
} from "@app/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { Textarea } from "@app/components/ui/textarea";
import { VisuallyHidden } from "@app/components/ui/visually-hidden";
import { disableInteractions, enableInteractions } from "@app/utils/dom";
import type { z } from "@app/utils/schemas";
import { updateCollectionFormSchema } from "@app/utils/schemas/collections";
import type { Collection } from "@app/utils/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { EditIcon, PlusIcon, SaveIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import { CollectionPagePath } from "~/utils/urls";
import useCollections from "./provider";
import RefreshPage from "@app/components/misc/refresh-page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { CollectionVisibility } from "@app/utils/types";
import { Capitalize } from "@app/utils/string";
import IconPicker from "~/components/icon-picker";
import { fallbackProjectIcon } from "@app/components/icons";

interface EditCollectionProps {
    collection: Collection;
}

export default function EditCollection(props: EditCollectionProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const collectionsCtx = useCollections();

    const form = useForm<z.infer<typeof updateCollectionFormSchema>>({
        resolver: zodResolver(updateCollectionFormSchema),
        defaultValues: {
            name: props.collection.name,
            description: props.collection.description || "",
            visibility: props.collection.visibility,
            icon: props.collection.icon || "",
        },
    });

    async function createCollection(values: z.infer<typeof updateCollectionFormSchema>) {
        try {
            if (isLoading || !isFormSubmittable()) return;
            setIsLoading(true);
            disableInteractions();

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description || "");
            formData.append("visibility", values.visibility);
            formData.append("icon", values.icon || "");

            const response = await clientFetch(`/api/collections/${props.collection.id}`, {
                method: "PATCH",
                body: formData,
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                enableInteractions();
                return toast.error(result?.message || t.common.error);
            }

            collectionsCtx.refetchCollections();
            RefreshPage(navigate, location);
            setDialogOpen(false);
        } finally {
            setIsLoading(false);
        }
    }

    function isFormSubmittable() {
        const values = form.getValues();
        const isFormInvalid = !values.name;
        return !isFormInvalid;
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary-inverted">
                    <EditIcon aria-hidden className="w-btn-icon h-btn-icon" />
                    {t.form.edit}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.collection.editingCollection}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{t.collection.editingCollection}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <DialogBody>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(createCollection)}
                            className="w-full flex flex-col items-start justify-center gap-form-elements"
                        >
                            <FormField
                                name="icon"
                                control={form.control}
                                render={({ field }) => (
                                    <IconPicker
                                        icon={form.getValues().icon}
                                        fieldName={field.name}
                                        onChange={field.onChange}
                                        fallbackIcon={fallbackProjectIcon}
                                        originalIcon={props.collection.icon || ""}
                                    />
                                )}
                            />

                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="collection-name-input">
                                            {t.form.name}
                                            <FormMessage />
                                        </FormLabel>
                                        <Input
                                            placeholder={t.dashboard.enterCollectionName}
                                            id="collection-name-input"
                                            type="text"
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="visibility"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t.form.visibility}
                                            <FormMessage />
                                        </FormLabel>

                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={CollectionVisibility.PUBLIC}>
                                                    {Capitalize(CollectionVisibility.PUBLIC)}
                                                </SelectItem>
                                                <SelectItem value={CollectionVisibility.UNLISTED}>
                                                    {Capitalize(CollectionVisibility.UNLISTED)}
                                                </SelectItem>
                                                <SelectItem value={CollectionVisibility.PRIVATE}>
                                                    {Capitalize(CollectionVisibility.PRIVATE)}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="collection-description-input">
                                            {t.form.description}
                                            <FormMessage />
                                        </FormLabel>
                                        <Textarea
                                            id="collection-description-input"
                                            {...field}
                                            className="resize-none"
                                            placeholder="..."
                                        />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <CancelButton type="button" />
                                </DialogClose>
                                <Button disabled={isLoading || !isFormSubmittable()}>
                                    {isLoading ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <SaveIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                                    )}
                                    {t.form.saveChanges}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
