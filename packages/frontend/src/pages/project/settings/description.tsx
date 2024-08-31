import MarkdownEditor from "@/components/layout/md-editor/md-editor";
import { ContentCardTemplate } from "@/components/layout/panel";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/spinner";
import { projectContext } from "@/src/contexts/curr-project";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDescriptionFormSchema } from "@shared/schemas/project";
import { SaveIcon } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

const DescriptionSettings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { projectData, fetchProjectData } = useContext(projectContext);

    const form = useForm<z.infer<typeof updateDescriptionFormSchema>>({
        resolver: zodResolver(updateDescriptionFormSchema),
        defaultValues: {
            description: projectData?.description || "",
        },
    });
    form.watch();

    const updateDescription = async (values: z.infer<typeof updateDescriptionFormSchema>) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await useFetch(`/api/project/${projectData?.slug}/description`, {
                method: "PATCH",
                body: JSON.stringify(values),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            await fetchProjectData();
            toast.success(result?.message || "Success");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ContentCardTemplate title="Description">
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
                        <Button type="submit" disabled={(projectData?.description || "") === form.getValues().description || isLoading}>
                            {isLoading ? <LoadingSpinner size="xs" /> : <SaveIcon className="w-btn-icon h-btn-icon" />}
                            Save changes
                        </Button>
                    </div>
                </form>
            </Form>
        </ContentCardTemplate>
    );
};

export default DescriptionSettings;
