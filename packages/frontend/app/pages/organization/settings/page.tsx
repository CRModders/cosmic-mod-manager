import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn, getOrgPagePathname, imageUrl } from "@root/utils";
import clientFetch from "@root/utils/client-fetch";
import Config from "@root/utils/config";
import { createURLSafeSlug } from "@shared/lib/utils";
import { orgSettingsFormSchema } from "@shared/schemas/organisation/settings/general";
import { handleFormError, validImgFileExtensions } from "@shared/schemas/utils";
import type { Organisation } from "@shared/types/api";
import { SaveIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";
import { fallbackOrgIcon } from "~/components/icons";
import { ContentCardTemplate } from "~/components/layout/panel";
import RefreshPage from "~/components/refresh-page";
import { ImgWrapper } from "~/components/ui/avatar";
import { Button, CancelButton, buttonVariants } from "~/components/ui/button";
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
import { InteractiveLabel } from "~/components/ui/label";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import type { OrgDataContext } from "~/routes/organization/data-wrapper";

const getInitialValues = (orgData: Organisation) => {
    return {
        icon: orgData.icon || "",
        name: orgData.name,
        slug: orgData.slug,
        description: orgData.description || "",
    };
};

export default function GeneralOrgSettings() {
    const { orgData } = useOutletContext<OrgDataContext>();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const initialValues = getInitialValues(orgData);
    const form = useForm<z.infer<typeof orgSettingsFormSchema>>({
        resolver: zodResolver(orgSettingsFormSchema),
        defaultValues: initialValues,
    });
    form.watch();

    async function saveSettings(values: z.infer<typeof orgSettingsFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("icon", values.icon || "");
            formData.append("name", values.name);
            formData.append("slug", values.slug);
            formData.append("description", values.description);

            const response = await clientFetch(`/api/organization/${orgData?.slug}`, {
                method: "PATCH",
                body: formData,
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            const newPathname = getOrgPagePathname(result?.slug || orgData?.slug, "/settings");
            RefreshPage(navigate, newPathname);
            toast.success(result?.message || "Success");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <ContentCardTemplate title="Organization information">
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                        className="w-full flex flex-col items-start justify-start gap-form-elements"
                    >
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">
                                        Icon
                                        <FormMessage />
                                    </FormLabel>
                                    <div className="flex flex-wrap items-center justify-start gap-4">
                                        <input
                                            hidden
                                            className="hidden"
                                            id="org-icon-input"
                                            accept={validImgFileExtensions.join(", ")}
                                            type="file"
                                            value={""}
                                            name={field.name}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                try {
                                                    await orgSettingsFormSchema.parseAsync({
                                                        ...form.getValues(),
                                                        icon: file,
                                                    });
                                                    field.onChange(file);
                                                } catch (error) {
                                                    // @ts-ignore
                                                    toast.error(error?.issues?.[0]?.message || "Error with the file");
                                                    console.error(error);
                                                }
                                            }}
                                        />

                                        <ImgWrapper
                                            alt={orgData.name}
                                            src={(() => {
                                                const image = form.getValues()?.icon;
                                                if (image instanceof File) {
                                                    return URL.createObjectURL(image);
                                                }
                                                if (!image) {
                                                    return "";
                                                }
                                                return imageUrl(orgData.icon || "");
                                            })()}
                                            className="rounded"
                                            fallback={fallbackOrgIcon}
                                        />

                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <InteractiveLabel
                                                htmlFor="org-icon-input"
                                                className={cn(buttonVariants({ variant: "secondary", size: "default" }), "cursor-pointer")}
                                            >
                                                <UploadIcon className="w-btn-icon h-btn-icon" />
                                                Upload icon
                                            </InteractiveLabel>
                                            {form.getValues().icon ? (
                                                <Button
                                                    variant={"secondary"}
                                                    type="button"
                                                    onClick={() => {
                                                        form.setValue("icon", undefined);
                                                    }}
                                                >
                                                    <Trash2Icon className="w-btn-icon h-btn-icon" />
                                                    Remove icon
                                                </Button>
                                            ) : null}
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground font-bold" htmlFor="org-name-input">
                                        Name
                                        <FormMessage />
                                    </FormLabel>
                                    <Input {...field} className="md:w-[32ch]" id="org-name-input" autoComplete="off" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground font-bold" htmlFor="org-slug-input">
                                        URL
                                        <FormMessage />
                                    </FormLabel>
                                    <div className="w-full flex flex-col items-start justify-center gap-0.5">
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(createURLSafeSlug(e.target.value).value);
                                            }}
                                            className="md:w-[32ch]"
                                            id="org-slug-input"
                                            autoComplete="off"
                                        />
                                        <span className="text-sm lg:text-base text-muted-foreground px-1">
                                            {Config.FRONTEND_URL}/organization/
                                            <em className="not-italic text-foreground font-[500]">{form.getValues().slug}</em>
                                        </span>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground font-bold" htmlFor="org-description-input">
                                        Description
                                        <FormMessage />
                                    </FormLabel>
                                    <Textarea
                                        {...field}
                                        className="resize-none md:w-[48ch] min-h-32"
                                        spellCheck="false"
                                        id="org-description-input"
                                    />
                                </FormItem>
                            )}
                        />

                        <div className="w-full flex items-center justify-end mt-2">
                            <Button
                                type="submit"
                                disabled={JSON.stringify(initialValues) === JSON.stringify(form.getValues()) || isLoading}
                                onClick={async () => {
                                    await handleFormError(async () => {
                                        const parsedValues = await orgSettingsFormSchema.parseAsync(form.getValues());
                                        saveSettings(parsedValues);
                                    });
                                }}
                            >
                                {isLoading ? <LoadingSpinner size="xs" /> : <SaveIcon className="w-btn-icon h-btn-icon" />}
                                Save changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </ContentCardTemplate>

            <DeleteOrgDialog name={orgData.name} slug={orgData.slug} />
        </>
    );
}

function DeleteOrgDialog({ name, slug }: { name: string; slug: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [submittable, setSubmittable] = useState(false);
    const navigate = useNavigate();

    const deleteOrg = async () => {
        if (!submittable || isLoading) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/organization/${slug}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || "Error");
            }

            toast.success(data?.message || "Success");
            RefreshPage(navigate, "/dashboard/organizations");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ContentCardTemplate title="Delete project" className="w-full flex flex-col gap-4">
            <p className="text-muted-foreground">
                Deleting your organization will transfer all of its projects to the organization owner. This action cannot be undone.
            </p>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive">
                        <Trash2Icon className="w-btn-icon h-btn-icon" />
                        Delete organization
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete {name}?</DialogTitle>
                        <VisuallyHidden>
                            <DialogDescription>Delete organization {name}</DialogDescription>
                        </VisuallyHidden>
                    </DialogHeader>
                    <DialogBody className="text-muted-foreground flex flex-col gap-4">
                        <p className="leading-snug">This will delete this organization forever (like forever ever).</p>

                        <div className="w-full flex flex-col gap-1">
                            <span className="font-bold flex items-center justify-start gap-1.5">
                                To verify, type<em className="font-normal">{name}</em>below:
                            </span>

                            <Input
                                placeholder="Type here..."
                                className="w-full sm:w-[32ch]"
                                onChange={(e) => {
                                    if (e.target.value === name) {
                                        setSubmittable(true);
                                    } else if (submittable === true) {
                                        setSubmittable(false);
                                    }
                                }}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <CancelButton />
                            </DialogClose>
                            <Button disabled={!submittable || isLoading} variant="destructive" onClick={deleteOrg}>
                                {isLoading ? <LoadingSpinner size="xs" /> : <Trash2Icon className="w-btn-icon h-btn-icon" />}
                                Delete organization
                            </Button>
                        </DialogFooter>
                    </DialogBody>
                </DialogContent>
            </Dialog>
        </ContentCardTemplate>
    );
}
