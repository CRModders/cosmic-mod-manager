import { Button, CancelButton } from "@app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@app/components/ui/card";
import { FormSuccessMessage } from "@app/components/ui/form-message";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { SITE_NAME_SHORT } from "@app/utils/constants";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import SessionsPageLink from "./help-link";

export default function DeleteAccountConfirmationCard({ code }: { code: string }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<{ value: boolean; action: "cancelling" | "confirming" | null }>({
        value: false,
        action: null,
    });
    const [successMessage, setSuccessMessage] = useState("");

    async function confirmAccountDeletion() {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, action: "confirming" });

            const response = await clientFetch("/api/user", {
                method: "DELETE",
                body: JSON.stringify({ code: code }),
            });

            const result = await response.json();
            if (result?.success === true) {
                return setSuccessMessage(result?.message || t.common.success);
            }

            return toast.error(result?.message || t.common.error);
        } finally {
            setIsLoading({ value: false, action: null });
        }
    }

    async function cancelAccountDeletion() {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, action: "cancelling" });

            const response = await clientFetch("/api/user/confirmation-action", {
                method: "DELETE",
                body: JSON.stringify({ code: code }),
            });

            const result = await response.json();
            if (result?.success === true) {
                return setSuccessMessage(result?.message || t.common.success);
            }

            return toast.error(result?.message || t.common.error);
        } finally {
            setIsLoading({ value: false, action: null });
        }
    }

    return (
        <>
            <title>{`${t.auth.deleteAccount} - ${SITE_NAME_SHORT}`}</title>
            <meta name="description" content={`Confirm to delete your ${SITE_NAME_SHORT} account`} />

            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>{t.auth.deleteAccount}</CardTitle>
                </CardHeader>
                {successMessage ? (
                    <CardContent className="gap-2 items-center justify-center">
                        <FormSuccessMessage text={successMessage} />
                        <a href="/" className="font-semibold hover:underline underline-offset-2">
                            {t.common.home}
                        </a>
                    </CardContent>
                ) : (
                    <>
                        <CardContent>
                            <CardDescription>{t.auth.deleteAccountDesc}</CardDescription>
                            <div className="w-full flex items-center justify-end gap-panel-cards mt-3">
                                <CancelButton
                                    icon={isLoading.action === "cancelling" ? <LoadingSpinner size="xs" /> : null}
                                    onClick={cancelAccountDeletion}
                                    disabled={isLoading.value}
                                />
                                <Button variant={"destructive"} onClick={confirmAccountDeletion} disabled={isLoading.value}>
                                    {isLoading.action === "confirming" ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />
                                    )}
                                    {t.form.delete}
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <SessionsPageLink />
                        </CardFooter>
                    </>
                )}
            </Card>
        </>
    );
}
