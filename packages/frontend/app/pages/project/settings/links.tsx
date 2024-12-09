import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import clientFetch from "@root/utils/client-fetch";
import { updateExternalLinksFormSchema } from "@shared/schemas/project/settings/links";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import RefreshPage from "~/components/refresh-page";
import { Button } from "~/components/ui/button";
import { Card, CardTitle } from "~/components/ui/card";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/spinner";
import type { ProjectSettingsContext } from "./layout";

export default function ExternalLinksSettingsPage() {
    const { projectData } = useOutletContext<ProjectSettingsContext>();
    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<z.infer<typeof updateExternalLinksFormSchema>>({
        resolver: zodResolver(updateExternalLinksFormSchema),
        defaultValues: {
            issueTracker: projectData?.issueTrackerUrl || undefined,
            sourceCode: projectData?.projectSourceUrl || undefined,
            wikiPage: projectData?.projectWikiUrl || undefined,
            discordServer: projectData?.discordInviteUrl || undefined,
        },
    });
    form.watch();

    const updateLinks = async (values: z.infer<typeof updateExternalLinksFormSchema>) => {
        const res = await clientFetch(`/api/project/${projectData?.slug}/external-links`, {
            method: "PATCH",
            body: JSON.stringify(values),
        });
        const data = await res.json();

        if (!res.ok || !data?.success) {
            return toast.error(data?.message || "Failed to update external links");
        }

        RefreshPage(navigate, location);
        return toast.success(data?.message);
    };

    const formValues = form.getValues();
    const hasFormChanged =
        (projectData?.issueTrackerUrl || "") !== (formValues.issueTracker || "") ||
        (projectData?.projectSourceUrl || "") !== (formValues.sourceCode || "") ||
        (projectData?.projectWikiUrl || "") !== (formValues.wikiPage || "") ||
        (projectData?.discordInviteUrl || "") !== (formValues.discordServer || "");

    return (
        <Card className="w-full flex flex-col items-start justify-start gap-6 p-card-surround">
            <CardTitle>External links</CardTitle>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(updateLinks)} className="w-full flex flex-col items-start justify-start gap-4">
                    <FormField
                        control={form.control}
                        name="issueTracker"
                        render={({ field }) => (
                            <FormItem className="flex md:flex-row items-center justify-between gap-x-4">
                                <FormLabel htmlFor="issue-tracker-url-input">
                                    <span className="flex flex-col items-start justify-start gap-1">
                                        <span className="font-bold">Issue tracker</span>
                                        <FormDescription className="text-base font-normal text-muted-foreground">
                                            A place for users to report bugs, issues, and concerns about your project.
                                        </FormDescription>
                                    </span>
                                    <FormMessage />
                                </FormLabel>

                                <Input
                                    {...field}
                                    id="issue-tracker-url-input"
                                    value={field.value || ""}
                                    placeholder="Enter a valid URL"
                                    className="w-full md:w-[48ch] lg:w-[36ch] xl:w-[48ch]"
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sourceCode"
                        render={({ field }) => (
                            <FormItem className="flex md:flex-row items-center justify-between gap-x-4">
                                <FormLabel htmlFor="source-code-url-input">
                                    <span className="flex flex-col items-start justify-start gap-1">
                                        <span className="font-bold">Source code</span>
                                        <FormDescription className="text-base font-normal text-muted-foreground">
                                            A page/repository containing the source code for your project
                                        </FormDescription>
                                    </span>
                                    <FormMessage />
                                </FormLabel>

                                <Input
                                    {...field}
                                    id="source-code-url-input"
                                    value={field.value || ""}
                                    placeholder="Enter a valid URL"
                                    className="w-full md:w-[48ch] lg:w-[36ch] xl:w-[48ch]"
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="wikiPage"
                        render={({ field }) => (
                            <FormItem className="flex md:flex-row items-center justify-between gap-x-4">
                                <FormLabel htmlFor="wiki-page-url-input">
                                    <span className="flex flex-col items-start justify-start gap-1">
                                        <span className="font-bold">Wiki page</span>
                                        <FormDescription className="text-base font-normal text-muted-foreground">
                                            A page containing information, documentation, and help for the project.
                                        </FormDescription>
                                    </span>
                                    <FormMessage />
                                </FormLabel>

                                <Input
                                    {...field}
                                    id="wiki-page-url-input"
                                    value={field.value || ""}
                                    placeholder="Enter a valid URL"
                                    className="w-full md:w-[48ch] lg:w-[36ch] xl:w-[48ch]"
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="discordServer"
                        render={({ field }) => (
                            <FormItem className="flex md:flex-row items-center justify-between gap-x-4">
                                <FormLabel htmlFor="discord-invite-url-input">
                                    <span className="flex flex-col items-start justify-start gap-1">
                                        <span className="font-bold">Discord invite</span>
                                        <FormDescription className="text-base font-normal text-muted-foreground">
                                            An invitation link to your Discord server.
                                        </FormDescription>
                                    </span>
                                    <FormMessage />
                                </FormLabel>

                                <Input
                                    {...field}
                                    id="discord-invite-url-input"
                                    value={field.value || ""}
                                    placeholder="Enter a valid URL"
                                    className="w-full md:w-[48ch]"
                                />
                            </FormItem>
                        )}
                    />

                    <div className="w-full flex items-center justify-end">
                        <Button type="submit" disabled={!hasFormChanged || form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <LoadingSpinner size="xs" /> : <SaveIcon className="w-btn-icon h-btn-icon" />}
                            Save changes
                        </Button>
                    </div>
                </form>
            </Form>
        </Card>
    );
}
