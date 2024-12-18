import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { Separator } from "@app/components/ui/separator";
import { AuthActionIntent, type AuthProvider } from "@app/utils/types";
import { useState } from "react";
import MarkdownRenderBox from "~/components/md-renderer";
import Link from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import OAuthProvidersWidget from "../oauth-providers";

export default function SignUpPage() {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState<{
        value: boolean;
        provider: AuthProvider | null;
    }>({ value: false, provider: null });

    return (
        <aside className="w-full flex items-center justify-center py-12 min-h-[100vh]">
            <Card className="w-full max-w-md relative">
                <CardHeader className="mb-1">
                    <CardTitle>{t.form.signup}</CardTitle>
                </CardHeader>
                <CardContent className="w-full flex flex-col items-start justify-start gap-4">
                    <div className="w-full flex flex-col items-start justify-start gap-2">
                        <p>{t.auth.signupWithProviders}</p>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <OAuthProvidersWidget
                                actionIntent={AuthActionIntent.SIGN_UP}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                            />
                        </div>
                    </div>

                    <MarkdownRenderBox text={t.auth.aggrement} divElem />

                    <Separator />

                    <div className="w-full flex flex-col items-center justify-center gap-1">
                        <p className="text-center">
                            <span className="text-muted-foreground">{t.auth.alreadyHaveAccount}</span>{" "}
                            <Link prefetch="render" to="/login" aria-label={t.form.login} className="text_link">
                                {t.form.login}
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </aside>
    );
}
