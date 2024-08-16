import { Button, CancelButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSuccessMessage } from "@/components/ui/form-message";
import { LoadingSpinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { SITE_NAME_SHORT } from "@shared/config";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import SessionsPageLink from "./sessions-page-link";

const DeleteAccountConfirmationCard = ({ code }: { code: string }) => {
    const [isLoading, setIsLoading] = useState<{ value: boolean; action: "cancelling" | "confirming" | null }>({
        value: false,
        action: null,
    });
    const [successMessage, setSuccessMessage] = useState("");

    const confirmAccountDeletion = async () => {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, action: "confirming" });

            const response = await useFetch("/api/user/confirm-account-deletion", {
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

    const cancelAccountDeletion = async () => {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, action: "cancelling" });

            const response = await useFetch("/api/user/cancel-account-deletion", {
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
                <title>Delete account | {SITE_NAME_SHORT}</title>
                <meta name="description" content={`Confirm to delete your ${SITE_NAME_SHORT} account`} />
            </Helmet>

            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>Delete account</CardTitle>
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
                                Deleting your account will remove all of your data from our database. There is no going back after you
                                delete your account.
                            </CardDescription>
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
                                        <Trash2Icon className="w-btn-icon h-btn-icon" />
                                    )}
                                    Delete
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

export default DeleteAccountConfirmationCard;
