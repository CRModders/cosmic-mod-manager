import { zodResolver } from "@hookform/resolvers/zod";
import clientFetch from "@root/utils/client-fetch";
import { sendAccoutPasswordChangeLinkFormSchema } from "@shared/schemas/settings";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import HorizontalSeparator from "~/components/ui/hr-separator";
import { Input } from "~/components/ui/input";
import Link from "~/components/ui/link";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useTranslation } from "~/locales/provider";

export default function ChangePasswordPage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof sendAccoutPasswordChangeLinkFormSchema>>({
        resolver: zodResolver(sendAccoutPasswordChangeLinkFormSchema),
        defaultValues: {
            email: "",
        },
    });

    async function sendAccountPasswordChangeEmail() {
        try {
            if (isLoading) return;
            setIsLoading(true);

            const response = await clientFetch("/api/user/change-password", {
                method: "POST",
                body: JSON.stringify(form.getValues()),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            toast.success(result?.message || t.common.success);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="full_page w-full flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(sendAccountPasswordChangeEmail)} className="w-full max-w-md">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>{t.auth.changePassword}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-form-elements">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email-input">
                                            {t.auth.email}
                                            <FormMessage />
                                        </FormLabel>

                                        <Input id="email-input" type="email" {...field} placeholder={t.auth.enterEmail} />
                                    </FormItem>
                                )}
                            />

                            <Button className="h-form-submit-btn w-full" disabled={isLoading}>
                                {isLoading ? <LoadingSpinner size="xs" /> : <ArrowRightIcon className="w-btn-icon-md h-btn-icon-md" />}
                                {t.form.continue}
                            </Button>
                        </CardContent>

                        <CardFooter className="w-full flex flex-col gap-1 items-center justify-center">
                            <HorizontalSeparator />

                            <Link prefetch="render" className="text_link" to="/login">
                                {t.form.login}
                            </Link>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </main>
    );
}
