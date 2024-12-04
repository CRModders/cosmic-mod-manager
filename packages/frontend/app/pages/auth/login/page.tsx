import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "@remix-run/react";
import clientFetch from "@root/utils/client-fetch";
import { disableInteractions, enableInteractions } from "@root/utils/dom";
import { LoginFormSchema } from "@shared/schemas/auth";
import { AuthActionIntent, AuthProvider } from "@shared/types";
import { LogInIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { FormErrorMessage } from "~/components/ui/form-message";
import HorizontalSeparator from "~/components/ui/hr-separator";
import { Input } from "~/components/ui/input";
import Link from "~/components/ui/link";
import { LoadingSpinner } from "~/components/ui/spinner";
import OAuthProvidersWidget from "../oauth-providers";

export default function LoginPage() {
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState<{ value: boolean; provider: AuthProvider | null }>({ value: false, provider: null });
    const navigate = useNavigate();
    const location = useLocation();

    const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleCredentialLogin = async (formData: z.infer<typeof LoginFormSchema>) => {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, provider: AuthProvider.CREDENTIAL });
            disableInteractions();

            const response = await clientFetch(`/api/auth/${AuthActionIntent.SIGN_IN}/${AuthProvider.CREDENTIAL}`, {
                method: "POST",
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            toast.success(result?.message || "Success");
            window.location.reload();
        } finally {
            setIsLoading({ value: false, provider: null });
            enableInteractions();
        }
    };

    return (
        <main className="full_page w-full flex items-center justify-center py-12">
            <Card className="w-full max-w-md relative">
                <CardHeader className="mb-1">
                    <CardTitle>Log In</CardTitle>
                </CardHeader>
                <CardContent className="w-full flex flex-col items-start justify-start gap-4">
                    <Form {...loginForm}>
                        <form
                            onSubmit={loginForm.handleSubmit(handleCredentialLogin)}
                            name="Login"
                            className="w-full flex flex-col items-center justify-center gap-form-elements"
                        >
                            <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => (
                                    <>
                                        <FormItem>
                                            <FormLabel>
                                                Email
                                                <FormMessage />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="example@abc.com"
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        field.onChange(e);
                                                        setFormError("");
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    </>
                                )}
                            />

                            <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                    <>
                                        <FormItem>
                                            <FormLabel>
                                                Password
                                                <FormMessage />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="********"
                                                    type="password"
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        field.onChange(e);
                                                        setFormError("");
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    </>
                                )}
                            />

                            {formError && <FormErrorMessage text={formError} />}

                            <Button type="submit" aria-label="Login" className="w-full h-form-submit-btn" disabled={isLoading.value}>
                                {isLoading.provider === AuthProvider.CREDENTIAL ? (
                                    <LoadingSpinner size="xs" />
                                ) : (
                                    <LogInIcon className="w-[1.1rem] h-[1.1rem]" />
                                )}
                                Login
                            </Button>
                        </form>
                    </Form>

                    <HorizontalSeparator />

                    <div className="w-full flex flex-col items-start justify-start gap-2">
                        <p>Login using:</p>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <OAuthProvidersWidget
                                actionIntent={AuthActionIntent.SIGN_IN}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                            />
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center mt-4">
                        <div className="text-center">
                            <span className="text-muted-foreground">Don't have an account?&nbsp;</span>
                            <Link prefetch="render" to="/signup" aria-label="Sign up" className="text_link">
                                Sign up
                            </Link>
                        </div>
                        <div className="text-center">
                            <span className="text-muted-foreground">Forgot password?&nbsp;</span>
                            <Link prefetch="render" to="/change-password" aria-label="Change password" className="text_link">
                                Change password
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
