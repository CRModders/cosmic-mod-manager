import { Link } from "@remix-run/react";
import { AuthActionIntent, type AuthProvider } from "@shared/types";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import OAuthProvidersWidget from "../oauth-providers";

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState<{
        value: boolean;
        provider: AuthProvider | null;
    }>({ value: false, provider: null });

    return (
        <aside className="w-full flex items-center justify-center py-12 min-h-[100vh]">
            <Card className="w-full max-w-md relative">
                <CardHeader className="mb-1">
                    <CardTitle>Sign Up</CardTitle>
                </CardHeader>
                <CardContent className="w-full flex flex-col items-start justify-start gap-4">
                    <div className="w-full flex flex-col items-start justify-start gap-2">
                        <p>Signup using any of the auth providers:</p>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <OAuthProvidersWidget
                                actionIntent={AuthActionIntent.SIGN_UP}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                            />
                        </div>
                    </div>

                    <p className="text-muted-foreground">
                        By creating an account, you agree to our{" "}
                        <Link className="text_link" to="/legal/terms">
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link className="text_link" to="/legal/privacy">
                            Privacy Policy
                        </Link>
                        .
                    </p>

                    <Separator />

                    <div className="w-full flex flex-col items-center justify-center gap-1">
                        <p className="text-center">
                            <span className="text-muted-foreground">Already have an account?&nbsp;</span>
                            <Link to="/login" aria-label="Login" className="text_link">
                                Login
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </aside>
    );
}
