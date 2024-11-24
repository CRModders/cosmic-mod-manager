import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormErrorMessage } from "@/components/ui/form-message";
import HorizontalSeparator from "@/components/ui/hr-separator";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useSession } from "@/src/contexts/auth";
import useFetch from "@/src/hooks/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { SITE_NAME_LONG } from "@shared/config";
import { LoginFormSchema } from "@shared/schemas/auth";
import { AuthActionIntent, AuthProvider } from "@shared/types";
import { LogInIcon } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";
import { RedirectIfLoggedIn } from "../guards";
import OAuthProvidersWidget from "../oauth-providers";

const LoginPage = () => {
    const { invalidateSessionQuery } = useSession();
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState<{ value: boolean; provider: AuthProvider | null }>({ value: false, provider: null });
    const navigate = useNavigate();

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

            const response = await useFetch(`/api/auth/${AuthActionIntent.SIGN_IN}/${AuthProvider.CREDENTIAL}`, {
                method: "POST",
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || "Error");
            }

            invalidateSessionQuery();
            toast.success(result?.message || "Success");
            navigate("/dashboard");
        } finally {
            setIsLoading({ value: false, provider: null });
        }
    };

    return (
        <>
            <Helmet>
                <title>Login | {SITE_NAME_LONG}</title>
                <meta name="description" content="Log into your CRMM account" />
            </Helmet>

            <RedirectIfLoggedIn redirectTo="/dashboard">
                <div className="full_page w-full flex items-center justify-center py-12">
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

                                    <Button
                                        type="submit"
                                        aria-label="Login"
                                        className="w-full h-form-submit-btn"
                                        disabled={isLoading.value}
                                    >
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

                            <div className="w-full flex flex-col items-center justify-center gap-1 mt-4">
                                <div className="text-center text-foreground">
                                    <span className="text-foreground-muted">Don't have an account?&nbsp;</span>
                                    <Link
                                        to="/signup"
                                        aria-label="Sign up"
                                        className="text-foreground font-semibold decoration-[0.1rem] hover:underline underline-offset-2"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                                <div className="text-center">
                                    <span className="text-foreground-muted">Forgot password?&nbsp;</span>
                                    <Link
                                        to="/change-password"
                                        aria-label="Change password"
                                        className="text-foreground font-semibold decoration-[0.1rem] hover:underline underline-offset-2"
                                    >
                                        Change password
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </RedirectIfLoggedIn>
        </>
    );
};

export const Component = LoginPage;
