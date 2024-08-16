import { Button, CancelButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSuccessMessage } from "@/components/ui/form-message";
import { LoadingSpinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import SessionsPageLink from "./sessions-page-link";

const ConfirmNewPasswordCard = ({ code }: { code: string }) => {
    const [isLoading, setIsLoading] = useState<{ value: boolean; action: "cancelling" | "confirming" | null }>({
        value: false,
        action: null,
    });
    const [successMessage, setSuccessMessage] = useState("");

    const confirmToAddNewPassword = async () => {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, action: "confirming" });

            const response = await useFetch("/api/user/confirm-adding-new-password", {
                method: "POST",
                body: JSON.stringify({ code: code }),
            });

            const result = await response.json();
            if (result?.success === true) {
                return setSuccessMessage(result?.message || "Success");
            }

            return toast.error(result?.message || "Error");
        } finally {
            setIsLoading({ value: false, action: null });
        }
    };

    const cancelAddingNewPassword = async () => {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, action: "cancelling" });

            const response = await useFetch("/api/user/cancel-adding-new-password", {
                method: "POST",
                body: JSON.stringify({ code: code }),
            });

            const result = await response.json();
            if (result?.success === true) {
                return setSuccessMessage(result?.message || "Success");
            }

            return toast.error(result?.message || "Error");
        } finally {
            setIsLoading({ value: false, action: null });
        }
    };

    return (
        <>
            <Helmet>
                <title>Confirm new password | {SITE_NAME_SHORT}</title>
                <meta name="description" content={`Add new password to your ${SITE_NAME_SHORT} account`} />
            </Helmet>

            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>Confirm new password</CardTitle>
                </CardHeader>
                {successMessage ? (
                    <CardContent className="gap-2 items-center justify-center">
                        <FormSuccessMessage text={successMessage} />
                        <a href="/" className="font-semibold hover:underline underline-offset-2">
                            Home
                        </a>
                    </CardContent>
                ) : (
                    <>
                        <CardContent>
                            <CardDescription>
                                A new password was recently added to your account and is awaiting confirmation. Confirm below if this was
                                you.
                            </CardDescription>
                            <div className="w-full flex items-center justify-end gap-panel-cards mt-3">
                                <CancelButton
                                    icon={isLoading.action === "cancelling" ? <LoadingSpinner size="xs" /> : null}
                                    onClick={cancelAddingNewPassword}
                                    disabled={isLoading.value}
                                />
                                <Button onClick={confirmToAddNewPassword} disabled={isLoading.value}>
                                    {isLoading.action === "confirming" ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <CheckIcon className="w-btn-icon h-btn-icon" />
                                    )}
                                    Confirm
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
};

export default ConfirmNewPasswordCard;
