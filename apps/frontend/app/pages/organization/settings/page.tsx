import { fallbackOrgIcon } from "@app/components/icons";
import { ContentCardTemplate } from "@app/components/misc/panel";
import RefreshPage from "@app/components/misc/refresh-page";
import { ImgWrapper } from "@app/components/ui/avatar";
import { Button, buttonVariants } from "@app/components/ui/button";
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
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { InteractiveLabel } from "@app/components/ui/label";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { Textarea } from "@app/components/ui/textarea";
import { VisuallyHidden } from "@app/components/ui/visually-hidden";
import { cn } from "@app/components/utils";
import type { z } from "@app/utils/schemas";
import { orgSettingsFormSchema } from "@app/utils/schemas/organisation/settings/general";
import { handleFormError, validImgFileExtensions } from "@app/utils/schemas/utils";
import { createURLSafeSlug } from "@app/utils/string";
import type { Organisation } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import MarkdownRenderBox from "~/components/md-renderer";
import { CancelButton } from "~/components/ui/button";
import { useNavigate } from "~/components/ui/link";
import { useOrgData } from "~/hooks/org";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { OrgPagePath } from "~/utils/urls";

const getInitialValues = (orgData: Organisation) => {
    return {
        icon: orgData.icon || "",
        name: orgData.name,
        slug: orgData.slug,
        description: orgData.description || "",
    };
};

export default function GeneralOrgSettings() {
    const { t } = useTranslation();
    const orgData = useOrgData().orgData;

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
                return toast.error(result?.message || t.common.error);
            }

            const newPathname = OrgPagePath(result?.slug || orgData?.slug, "settings");
            RefreshPage(navigate, newPathname);
            toast.success(result?.message || t.common.success);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <ContentCardTemplate title={t.organization.orgInfo}>
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
                                        {t.form.icon}
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
                                                {t.form.uploadIcon}
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
                                                    {t.form.removeIcon}
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
                                        {t.form.name}
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
                                        {t.form.url}
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
                                        {t.form.description}
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
                                    }, toast.error);
                                }}
                            >
                                {isLoading ? <LoadingSpinner size="xs" /> : <SaveIcon className="w-btn-icon h-btn-icon" />}
                                {t.form.saveChanges}
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
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [submittable, setSubmittable] = useState(false);
    const navigate = useNavigate();

    async function deleteOrg() {
        if (!submittable || isLoading) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/organization/${slug}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || t.common.error);
            }

            toast.success(data?.message || "Success");
            RefreshPage(navigate, "/dashboard/organizations");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ContentCardTemplate title={t.organization.deleteOrg} className="w-full flex flex-col gap-4">
            <p className="text-muted-foreground">{t.organization.deleteOrgDesc}</p>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive">
                        <Trash2Icon className="w-btn-icon h-btn-icon" />
                        {t.organization.deleteOrg}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.organization.sureToDeleteOrg}</DialogTitle>
                        <VisuallyHidden>
                            <DialogDescription>{t.organization.deleteOrgNamed(name)}</DialogDescription>
                        </VisuallyHidden>
                    </DialogHeader>
                    <DialogBody className="text-muted-foreground flex flex-col gap-4">
                        <p className="leading-snug">{t.organization.deletionWarning}</p>

                        <div className="w-full flex flex-col gap-1">
                            <MarkdownRenderBox text={t.projectSettings.typeToVerify(name)} divElem />

                            <Input
                                placeholder={t.projectSettings.typeHere}
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
                                {t.organization.deleteOrg}
                            </Button>
                        </DialogFooter>
                    </DialogBody>
                </DialogContent>
            </Dialog>
        </ContentCardTemplate>
    );
}
