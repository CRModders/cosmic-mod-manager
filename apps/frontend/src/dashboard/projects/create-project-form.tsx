import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormErrorMessage } from "@/components/ui/form-message";
import { Input, InputWithInlineLabel } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { maxProjectNameLength, maxProjectSummaryLength, minProjectNameLength } from "@root/config";
import { CapitalizeAndFormatString, createURLSafeSlug } from "@root/lib/utils";
import { ProjectVisibility } from "@root/types";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

type Props = {
    fetchProjects: () => Promise<void>;
    children: React.ReactNode;
};

const formSchema = z.object({
    name: z
        .string()
        .min(minProjectNameLength, "Enter the project name")
        .max(maxProjectNameLength, `Project name can contain only a maximum of ${maxProjectNameLength} characters`),
    url: z
        .string()
        .min(minProjectNameLength)
        .max(maxProjectNameLength, `Project url slug can contain only a maximum of ${maxProjectNameLength} characters`),
    visibility: z.enum([ProjectVisibility.PRIVATE, ProjectVisibility.PUBLIC, ProjectVisibility.UNLISTED]),
    summary: z.string().max(maxProjectSummaryLength).optional(),
});

const CreateProjectForm = ({ children, fetchProjects }: Props) => {
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [keepNameAndUrlSynced, setKeepNameAndUrlSynced] = useState<boolean>(true);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            url: "",
            visibility: ProjectVisibility.PUBLIC,
            summary: "",
        },
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (loading) return;
        if (!values?.name || !values.url || !values.visibility || !values.summary) {
            return setFormError("Missing required fields");
        }
        setLoading(true);
        const response = await useFetch("/api/project/create-new-project", {
            method: "POST",
            body: JSON.stringify({
                name: values.name,
                url: values.url,
                visibility: values.visibility,
                summary: values.summary,
            }),
        });
        setLoading(false);
        const result = await response.json();

        if (!response.ok) {
            return setFormError(result?.message);
        }

        toast({
            title: result.message,
        });
        setDialogOpen(false);
        await fetchProjects();

        navigate(`/${createURLSafeSlug(result?.data?.projectType).value}/${result?.data?.projectUrl}`);
    };

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(open: boolean) => {
                if (open === false) {
                    form.reset();
                    setFormError("");
                }
                setDialogOpen(open);
            }}
        >
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-foreground-muted font-semibold">Create a project</DialogTitle>
                </DialogHeader>

                <div className="w-full flex flex-col items-center justify-center">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="w-full flex flex-col items-center justify-center"
                        >
                            <div className="w-full flex flex-col items-center justify-center gap-4">
                                <div className="w-full flex flex-col items-center justify-center">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="w-full flex items-end justify-between text-left gap-12 min-h-4">
                                                    <span className="text-foreground font-semibold">Name</span>
                                                    <FormMessage className="text-danger-text dark:text-danger-text leading-tight" />
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter project name..."
                                                        type="text"
                                                        {...field}
                                                        onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
                                                            field.onChange(val);
                                                            const generatedSlug = createURLSafeSlug(
                                                                form.getValues().name,
                                                            ).value;
                                                            if (keepNameAndUrlSynced === true) {
                                                                form.setValue("url", generatedSlug);
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full flex flex-col items-center justify-center">
                                    <FormField
                                        control={form.control}
                                        name="url"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="w-full flex items-end justify-between text-left gap-12 min-h-4">
                                                    <span className="text-foreground font-semibold">URL</span>
                                                    <FormMessage className="text-danger-text dark:text-danger-text leading-tight" />
                                                </FormLabel>
                                                <FormControl>
                                                    <InputWithInlineLabel
                                                        label="/project/"
                                                        id="project-url-input"
                                                        wrapperClassName="place-items-baseline"
                                                        {...field}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            field.onChange({
                                                                ...event,
                                                                target: {
                                                                    ...event.target,
                                                                    value: createURLSafeSlug(event.target.value).value,
                                                                },
                                                            });
                                                            setKeepNameAndUrlSynced(false);
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full flex flex-col items-center justify-center">
                                    <FormField
                                        control={form.control}
                                        name="visibility"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    <>
                                                        <FormLabel className="w-full flex items-center justify-start text-foreground font-semibold">
                                                            Visibility
                                                        </FormLabel>
                                                        <Select value={field.value} onValueChange={field.onChange}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Project visibility..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value={ProjectVisibility.PRIVATE}>
                                                                    {CapitalizeAndFormatString(
                                                                        ProjectVisibility.PRIVATE,
                                                                    )}
                                                                </SelectItem>
                                                                <SelectItem value={ProjectVisibility.PUBLIC}>
                                                                    {CapitalizeAndFormatString(
                                                                        ProjectVisibility.PUBLIC,
                                                                    )}
                                                                </SelectItem>
                                                                <SelectItem value={ProjectVisibility.UNLISTED}>
                                                                    {CapitalizeAndFormatString(
                                                                        ProjectVisibility.UNLISTED,
                                                                    )}
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full flex flex-col items-center justify-center">
                                    <FormField
                                        control={form.control}
                                        name="summary"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="w-full flex items-end justify-between text-left gap-12 min-h-4">
                                                    <span className="text-foreground font-semibold">Summary</span>
                                                    <FormMessage className="text-danger-text dark:text-danger-text leading-tight" />
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter project summary..."
                                                        cols={8}
                                                        maxLength={maxProjectSummaryLength}
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="w-full min-h-6 my-4">
                                {formError && <FormErrorMessage text={formError} />}
                            </div>

                            <div className="w-full flex items-center justify-end gap-2">
                                <DialogClose aria-label="Cancel" asChild>
                                    <Button variant={"secondary"}>Cancel</Button>
                                </DialogClose>

                                <Button
                                    type="submit"
                                    aria-label="Continue"
                                    className="gap-2"
                                    disabled={
                                        !form.getValues().name || !form.getValues().url || !form.getValues().summary
                                    }
                                >
                                    <ArrowRightIcon className="w-5 h-5" />
                                    Continue
                                </Button>
                            </div>
                        </form>
                        {loading === true && <AbsolutePositionedSpinner />}
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectForm;
