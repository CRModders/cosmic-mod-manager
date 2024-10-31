import { Button, CancelButton, buttonVariants } from "@/components/ui/button";
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
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { projectContext } from "@/src/contexts/curr-project";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { addNewGalleryImageFormSchema } from "@shared/schemas/project/settings/gallery";
import { handleFormError } from "@shared/schemas/utils";
import { FileIcon, PlusIcon, StarIcon, UploadIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

const UploadGalleryImageForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { projectData, fetchProjectData } = useContext(projectContext);

    const form = useForm<z.infer<typeof addNewGalleryImageFormSchema>>({
        resolver: zodResolver(addNewGalleryImageFormSchema),
        defaultValues: {
            title: "",
            description: "",
            orderIndex: (projectData?.gallery?.[0]?.orderIndex || 0) + 1,
            featured: false,
        },
    });
    form.watch();

    const uploadGalleryImage = async (values: z.infer<typeof addNewGalleryImageFormSchema>) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("image", values.image);
            formData.append("title", values.title);
            formData.append("description", values.description || "");
            formData.append("orderIndex", (values.orderIndex || 0).toString());
            formData.append("featured", values.featured.toString());

            const response = await useFetch(`/api/project/${projectData?.slug}/gallery`, {
                method: "POST",
                body: formData,
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            await fetchProjectData();
            toast.success(result?.message || "Success");
            form.reset();
            setDialogOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (projectData) {
            form.setValue("orderIndex", (projectData?.gallery?.[0]?.orderIndex || 0) + 1);
        }
    }, [projectData]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant={"default"}>
                    <UploadIcon className="w-btn-icon h-btn-icon" />
                    Upload gallery image
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[36rem]">
                <DialogHeader>
                    <DialogTitle>Upload an image</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>Upload a new gallery image</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>

                <DialogBody>
                    <Form {...form}>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                await handleFormError(async () => {
                                    const formValues = await addNewGalleryImageFormSchema.parseAsync(form.getValues());
                                    await uploadGalleryImage(formValues);
                                });
                            }}
                            className="w-full flex flex-col items-start justify-start gap-form-elements"
                        >
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="w-full flex flex-col items-center justify-center">
                                            <div
                                                className={cn(
                                                    "w-full flex flex-wrap sm:flex-nowrap items-center justify-between bg-shallow-background rounded px-4 py-3 gap-x-4 gap-y-2",
                                                    field.value && "rounded-b-none",
                                                )}
                                            >
                                                <div className="w-full flex items-center justify-start gap-1.5">
                                                    <input
                                                        hidden
                                                        type="file"
                                                        name={field.name}
                                                        id="gallery-image-input"
                                                        className="hidden"
                                                        accept={".jpg, .jpeg, .png, .webp, .gif"}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                field.onChange(file);
                                                            }
                                                        }}
                                                    />
                                                    <FileIcon className="flex-shrink-0 w-btn-icon h-btn-icon text-muted-foreground" />
                                                    {field.value ? (
                                                        <div className="flex items-center flex-wrap justify-start gap-x-2">
                                                            <span className="font-semibold">{field.value.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground italic">No file choosen</span>
                                                    )}
                                                </div>

                                                <label
                                                    htmlFor="gallery-image-input"
                                                    className={cn(buttonVariants({ variant: "secondary-dark" }), "cursor-pointer")}
                                                >
                                                    {field.value ? "Replace file" : "Choose file"}
                                                </label>
                                            </div>
                                            {field.value ? (
                                                <div className="w-full aspect-[2/1] rounded rounded-t-none overflow-hidden bg-[hsla(var(--background-dark))]">
                                                    <img
                                                        src={URL.createObjectURL(field.value)}
                                                        alt="img"
                                                        className="object-contain w-full h-full"
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="gallery-item-title">
                                            Title
                                            <FormMessage />
                                        </FormLabel>
                                        <Input {...field} placeholder="Enter title..." id="gallery-item-title" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="gallery-item-description">
                                            Description
                                            <FormMessage />
                                        </FormLabel>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter description..."
                                            className="h-fit min-h-14 resize-none"
                                            id="gallery-item-description"
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="orderIndex"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="gallery-item-ordering">
                                            Ordering
                                            <FormMessage />
                                            <FormDescription className="my-1 leading-normal text-sm">
                                                Image with higher ordering will be listed first.
                                            </FormDescription>
                                        </FormLabel>
                                        <Input
                                            {...field}
                                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                            placeholder="Enter order index..."
                                            min={0}
                                            type="number"
                                            id="gallery-item-ordering"
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="featured"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="gallery-item-featured">
                                            Featured
                                            <FormMessage />
                                            <FormDescription className="my-1 leading-normal text-sm">
                                                A featured gallery image shows up in search and your project card. Only one gallery image
                                                can be featured.
                                            </FormDescription>
                                        </FormLabel>
                                        {/* <Input {...field} placeholder="Enter order index..." type="number" /> */}
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            onClick={() => field.onChange(!field.value)}
                                            id="gallery-item-featured"
                                        >
                                            {field.value === true ? (
                                                <StarIcon fill="currentColor" className="w-btn-icon-md h-btn-icon-md" />
                                            ) : (
                                                <StarIcon className="w-btn-icon-md h-btn-icon-md" />
                                            )}
                                            {field.value === true ? "Unfeature image" : "Feature image"}
                                        </Button>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild disabled={isLoading}>
                                    <CancelButton disabled={isLoading} />
                                </DialogClose>

                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <LoadingSpinner size="xs" /> : <PlusIcon className="w-btn-icon-md h-btn-icon-md" />}
                                    Add gallery image
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};

export default UploadGalleryImageForm;
