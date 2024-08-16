import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import HorizontalSeparator from "@/components/ui/hr-separator";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useSession } from "@/src/contexts/auth";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendAccoutPasswordChangeLinkFormSchema } from "@shared/schemas/settings";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { z } from "zod";

const ChangePasswordPage = () => {
    const { session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof sendAccoutPasswordChangeLinkFormSchema>>({
        resolver: zodResolver(sendAccoutPasswordChangeLinkFormSchema),
        defaultValues: {
            email: "",
        },
    });

    const sendAccountPasswordChangeEmail = async () => {
        try {
            if (isLoading) return;
            setIsLoading(true);

            const response = await useFetch("/api/user/send-password-change-email", {
                method: "POST",
                body: JSON.stringify(form.getValues()),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            toast.success(result?.message || "Success");
        } finally {
            setIsLoading(false);
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (session?.email) form.setValue("email", session.email);
    }, [session]);

    return (
        <div className="full_page w-full flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(sendAccountPasswordChangeEmail)} className="w-full max-w-md">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Change password</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-form-elements">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email-input">
                                            Email
                                            <FormMessage />
                                        </FormLabel>

                                        <Input id="email-input" type="email" {...field} placeholder="Enter your email address" />
                                    </FormItem>
                                )}
                            />

                            <Button className="h-form-submit-btn w-full" disabled={isLoading}>
                                {isLoading ? <LoadingSpinner size="xs" /> : <ArrowRightIcon className="w-btn-icon h-btn-icon" />}
                                Continue
                            </Button>
                        </CardContent>

                        <CardFooter className="w-full flex flex-col gap-1 items-center justify-center">
                            <HorizontalSeparator />

                            <Link className="hover:underline underline-offset-2 font-semibold" to={session?.id ? "/" : "/login"}>
                                {session?.id ? "Home" : "Login"}
                            </Link>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
};

export default ChangePasswordPage;
