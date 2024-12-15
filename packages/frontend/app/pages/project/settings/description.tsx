import { zodResolver } from "@hookform/resolvers/zod";
import clientFetch from "@root/utils/client-fetch";
import { updateDescriptionFormSchema } from "@shared/schemas/project/settings/description";
import { SaveIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";
import MarkdownEditor from "~/components/layout/md-editor/md-editor";
import { ContentCardTemplate } from "~/components/layout/panel";
import RefreshPage from "~/components/refresh-page";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem } from "~/components/ui/form";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";

export default function DescriptionSettings() {
    const { t } = useTranslation();
    const ctx = useProjectData();
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<z.infer<typeof updateDescriptionFormSchema>>({
        resolver: zodResolver(updateDescriptionFormSchema),
        defaultValues: {
            description: ctx.projectData?.description || "",
        },
    });
    form.watch();

    async function updateDescription(values: z.infer<typeof updateDescriptionFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await clientFetch(`/api/project/${ctx.projectData.slug}/description`, {
                method: "PATCH",
                body: JSON.stringify(values),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            RefreshPage(navigate, location);
            toast.success(result?.message || t.common.success);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ContentCardTemplate title={t.form.description}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(updateDescription)}
                    className="w-full flex flex-col items-start justify-start gap-form-elements"
                >
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <MarkdownEditor
                                    editorValue={field.value || ""}
                                    setEditorValue={field.onChange}
                                    textAreaClassName="min-h-[36rem]"
                                />
                            </FormItem>
                        )}
                    />

                    <div className="w-full flex items-center justify-end">
                        <Button type="submit" disabled={(ctx.projectData.description || "") === form.getValues().description || isLoading}>
                            {isLoading ? <LoadingSpinner size="xs" /> : <SaveIcon className="w-btn-icon h-btn-icon" />}
                            {t.form.saveChanges}
                        </Button>
                    </div>
                </form>
            </Form>
        </ContentCardTemplate>
    );
}
